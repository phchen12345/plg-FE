"use client";

import { useAuthStore } from "@/store/userAuthStore";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./orders.module.scss";
import {
  fetchOrders,
  OrderSummary,
  requestFamiWaybillPrint,
  requestSevenWaybillPrint,
} from "@/api/order/order_api";

type CvsCarrier = "familymart" | "seveneleven";

const resolveShippingMethod = (order: OrderSummary): CvsCarrier | null => {
  if (
    order.shippingMethod === "familymart" ||
    order.shippingMethod === "seveneleven"
  ) {
    return order.shippingMethod;
  }
  const tagSource = order.tags?.toLowerCase() ?? "";
  if (tagSource.includes("plg-cvs-seveneleven")) return "seveneleven";
  if (tagSource.includes("plg-cvs-familymart")) return "familymart";
  return null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待付款",
  authorized: "已授權",
  paid: "已付款",
  partially_paid: "部分付款",
  refunded: "已退款",
  voided: "已作廢",
};

const FULFILLMENT_LABEL: Record<string, string> = {
  fulfilled: "已出貨",
  partial: "部分出貨",
  restocked: "已退回庫存",
};

const formatCurrency = (amount: string, currency = "TWD") => {
  const value = Number(amount);
  if (Number.isNaN(value)) return `${currency} ${amount}`;
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const LOGISTICS_LABEL: Record<string, string> = {
  familymart: "全家",
  seveneleven: "7-11",
  home: "宅配",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [printingOrderId, setPrintingOrderId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { init, user } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        const data = await fetchOrders(20);
        // 如果後端回 { orders, isAdmin } 就在這裡取出
        if (Array.isArray((data as any).orders)) {
          setOrders((data as any).orders);
          setIsAdmin(Boolean((data as any).isAdmin));
        } else {
          setOrders(data as OrderSummary[]);
          setIsAdmin(Boolean(user?.isAdmin));
        }
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法取得訂單資料");
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [user?.isAdmin]
  );

  useEffect(() => {
    loadOrders(false);
  }, [loadOrders]);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const handlePrintWaybill = useCallback(
    async (order: OrderSummary, carrier: CvsCarrier) => {
      if (!isAdmin) {
        window.alert("只有管理員可以列印託運單");
        return;
      }

      const merchantTradeNo = order.merchantTradeNo ?? order.name ?? "";
      if (!merchantTradeNo) {
        window.alert("找不到對應的綠界物流訂單編號");
        return;
      }

      try {
        setPrintingOrderId(order.id);
        const api =
          carrier === "seveneleven"
            ? requestSevenWaybillPrint
            : requestFamiWaybillPrint;
        const { action, fields } = await api({ merchantTradeNo });

        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
        form.target = "_blank";

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "無法建立託運單列印資料";
        window.alert(message);
      } finally {
        setPrintingOrderId(null);
      }
    },
    [isAdmin]
  );

  if (loading) {
    return (
      <main className={styles.paymentPage}>
        <p className={styles.stateText}>訂單載入中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.paymentPage}>
        <div className={styles.emptyState}>
          <p>{error}</p>
          <button onClick={() => loadOrders(false)}>重新整理</button>
        </div>
      </main>
    );
  }

  if (!hasOrders) {
    return (
      <main className={styles.paymentPage}>
        <div className={styles.emptyState}>
          <p>目前沒有訂單紀錄</p>
          <Link href="/shop" className={styles.linkButton}>
            前往購物
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.paymentPage}>
      <section className={styles.layout}>
        <div className={styles.shippingCard}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>{isAdmin ? "管理員模式，顯示所有訂單" : "我的訂單"}</h1>
            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              style={{ minWidth: 120 }}
            >
              {refreshing ? "重新整理中..." : "重新整理"}
            </button>
          </div>

          {orders.map((order) => {
            const shippingMethod = resolveShippingMethod(order);
            return (
              <article key={order.id} className={styles.orderCard}>
                <header className={styles.orderCardHeader}>
                  <div>
                    <p className={styles.orderNumber}>{order.name}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString("zh-TW")}
                    </p>
                    {isAdmin && (
                      <p className={styles.orderDate}>
                        會員：{order.userId ?? "未知"}
                      </p>
                    )}
                  </div>
                  <div className={styles.orderStatus}>
                    <span>
                      付款狀態：
                      {STATUS_LABEL[order.financialStatus] ??
                        order.financialStatus}
                    </span>
                    <span>
                      物流廠商：
                      {LOGISTICS_LABEL[order.shippingMethod ?? ""] ??
                        order.shippingMethod ??
                        "未知"}
                    </span>
                    <span>
                      出貨狀態：
                      {order.fulfillmentStatus
                        ? FULFILLMENT_LABEL[order.fulfillmentStatus] ??
                          order.fulfillmentStatus
                        : "尚未出貨"}
                    </span>
                  </div>
                </header>

                <ul className={styles.orderItems}>
                  {order.lineItems.map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <strong>{formatCurrency(order.subtotalPrice)}</strong>
                    </li>
                  ))}
                </ul>

                <footer className={styles.orderFooter}>
                  <p className="text-[#fff] flex m-2">
                    總計：
                    <strong>
                      {formatCurrency(order.totalPrice, order.currency)}
                    </strong>
                  </p>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {shippingMethod === "familymart" && (
                        <button
                          type="button"
                          className={`${styles.linkButton} `}
                          onClick={() =>
                            handlePrintWaybill(order, "familymart")
                          }
                          disabled={printingOrderId === order.id}
                        >
                          {printingOrderId === order.id
                            ? "產生託運單..."
                            : "列印全家託運單"}
                        </button>
                      )}
                      {shippingMethod === "seveneleven" && (
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() =>
                            handlePrintWaybill(order, "seveneleven")
                          }
                          disabled={printingOrderId === order.id}
                        >
                          {printingOrderId === order.id
                            ? "產生託運單..."
                            : "列印 7-11 託運單"}
                        </button>
                      )}
                    </div>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
