// src/app/orders/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../payment/payment.module.scss";
import { fetchOrders, OrderSummary } from "@/api/order/order_api";

const STATUS_LABEL: Record<string, string> = {
  pending: "待付款",
  authorized: "授權中",
  paid: "已付款",
  partially_paid: "部分付款",
  refunded: "已退款",
  voided: "已作廢",
};

const FULFILLMENT_LABEL: Record<string, string> = {
  fulfilled: "已出貨",
  partial: "部分出貨",
  restocked: "退回入庫",
};

const formatCurrency = (amount: string, currency = "TWD") => {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return `${currency} ${amount}`;
  }
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders(20);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法取得訂單資訊");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

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
          <button onClick={() => window.location.reload()}>重新整理</button>
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
            前往選購
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.paymentPage}>
      <section className={styles.layout}>
        <div className={styles.shippingCard}>
          <h1>我的訂單</h1>
          {orders.map((order) => (
            <article key={order.id} className={styles.orderCard}>
              <header className={styles.orderCardHeader}>
                <div>
                  <p className={styles.orderNumber}>{order.name}</p>
                  <p className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString("zh-TW")}
                  </p>
                </div>
                <div className={styles.orderStatus}>
                  <span>
                    付款狀態：
                    {STATUS_LABEL[order.financialStatus] ??
                      order.financialStatus}
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
                    <strong>
                      {formatCurrency(item.price, order.currency)}
                    </strong>
                  </li>
                ))}
              </ul>

              <footer className={styles.orderFooter}>
                <p>
                  合計：{" "}
                  <strong>
                    {formatCurrency(order.totalPrice, order.currency)}
                  </strong>
                </p>
                {order.statusUrl && (
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkButton}
                  >
                    查看 Shopify 訂單
                  </a>
                )}
              </footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
