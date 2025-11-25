"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./payment.module.scss";
import { CartItem, fetchCart } from "@/api/cart/cart_api";
import {
  requestStoreMapToken,
  createOrder,
  createEcpayCheckout,
} from "@/api/payment/payment_api";

type ShippingMethod = "home" | "familymart" | "seveneleven";
type PaymentMethod = "cod" | "ecpay";

type SelectedStore = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  logisticsSubType?: string;
};

const STORAGE_KEY = "plg-selected-store";
const PICKER_WINDOW_FEATURES = "width=980,height=700,scrollbars=yes";
const PICKER_WINDOW_NAME = "plgStorePicker";
const THIRD_PARTY_PICKER_HOSTS = [
  "emap.pcsc.com.tw",
  "emap.famiport.com.tw",
  "famiport.com.tw",
];
const METHOD_TO_SUBTYPE: Record<ShippingMethod, string | null> = {
  home: null,
  familymart: "FAMIC2C",
  seveneleven: "UNIMARTC2C",
};

const SHIPPING_METHODS = [
  {
    value: "home",
    label: "宅配到府",
    fee: 120,
    description: "填寫地址，約 1-2 天送達",
  },
  {
    value: "familymart",
    label: "全家店到店",
    fee: 80,
    description: "選擇門市，約 3-5 天到貨",
  },
  {
    value: "seveneleven",
    label: "7-11 店到店",
    fee: 80,
    description: "選擇門市，約 3-5 天到貨",
  },
];

const PAYMENT_OPTIONS = [{ value: "ecpay", label: "綠界支付" }];

const currency = (cents = 0) =>
  `NTD ${cents.toLocaleString("zh-TW", { minimumFractionDigits: 0 })}`;

export default function PaymentPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<ShippingMethod>("home");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [address, setAddress] = useState({
    city: "",
    district: "",
    detail: "",
  });
  const [selectedStore, setSelectedStore] = useState<SelectedStore | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const storePopupRef = useRef<Window | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { cart } = await fetchCart();
        setItems(cart);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法載入購物車");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.priceCents ?? 0) * item.quantity,
        0
      ),
    [items]
  );
  const shippingFee =
    SHIPPING_METHODS.find((opt) => opt.value === method)?.fee ?? 0;
  const total = subtotal + shippingFee;

  const applyStoreSelection = useCallback(
    (payload: {
      storeid?: string | null;
      storename?: string | null;
      storeaddress?: string | null;
      phone?: string | null;
      logisticsSubType?: string | null;
    }) => {
      if (!payload?.storeid) return;
      const data: SelectedStore = {
        id: payload.storeid,
        name: payload.storename ?? payload.storeid,
        address: payload.storeaddress ?? "",
        phone: payload.phone ?? "",
        logisticsSubType: payload.logisticsSubType ?? "",
      };
      setSelectedStore(data);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setError("");
      storePopupRef.current?.close();
      storePopupRef.current = null;
    },
    []
  );

  useEffect(() => {
    const syncStore = () => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as SelectedStore;
        if (parsed?.id) setSelectedStore(parsed);
      } catch {
      } finally {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      let hostname = "";
      try {
        hostname = new URL(event.origin).hostname;
      } catch {
        hostname = "";
      }
      const allowedHosts = [
        ...THIRD_PARTY_PICKER_HOSTS,
        window.location.hostname,
      ].filter(Boolean);
      if (!allowedHosts.some((domain) => hostname.endsWith(domain))) return;
      applyStoreSelection(event.data ?? {});
    };

    window.addEventListener("storage", syncStore);
    window.addEventListener("focus", syncStore);
    window.addEventListener("message", handleMessage);
    syncStore();
    return () => {
      window.removeEventListener("storage", syncStore);
      window.removeEventListener("focus", syncStore);
      window.removeEventListener("message", handleMessage);
    };
  }, [applyStoreSelection]);

  useEffect(() => {
    if (method === "home") setSelectedStore(null);
  }, [method]);

  useEffect(() => {
    return () => {
      storePopupRef.current?.close();
    };
  }, []);

  const openStorePicker = async () => {
    if (method === "home" || pickerLoading) return;
    const logisticsSubType = METHOD_TO_SUBTYPE[method];
    if (!logisticsSubType) return;

    setError("");
    storePopupRef.current?.close();
    const popup = window.open("", PICKER_WINDOW_NAME, PICKER_WINDOW_FEATURES);
    if (!popup) {
      setError("請允許瀏覽器跳出視窗以選擇門市");
      return;
    }
    storePopupRef.current = popup;

    try {
      setPickerLoading(true);
      popup.document.write(
        `<main style="font-family:sans-serif;padding:32px;text-align:center;">門市載入中...</main>`
      );
      popup.document.close();

      const token = await requestStoreMapToken({
        logisticsSubType,
        extraData: selectedStore?.id,
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = token.action;
      form.target = PICKER_WINDOW_NAME;
      Object.entries(token.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      popup.focus();
    } catch (err) {
      popup.close();
      setError(
        err instanceof Error ? err.message : "無法開啟門市選擇，請稍後重試"
      );
    } finally {
      setPickerLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (method === "home") {
      if (!address.city || !address.district || !address.detail) {
        setError("請完整填寫配送地址");
        return;
      }
    } else if (!selectedStore) {
      setError("請先選擇取貨門市");
      return;
    }

    try {
      setError("");
      setSubmitting(true);
      if (paymentMethod === "ecpay") {
        if (method !== "home" && !selectedStore) {
          setError("請先選擇超商門市");
          setSubmitting(false);
          return;
        }

        const tradeNo = `EC${Date.now()}`;
        const totalAmount = String(total);

        const storePayload =
          method === "home" || !selectedStore
            ? null
            : {
                id: selectedStore.id,
                name: selectedStore.name,
                address: selectedStore.address,
                phone: selectedStore.phone ?? "",
                logisticsSubType:
                  selectedStore.logisticsSubType ??
                  METHOD_TO_SUBTYPE[method] ??
                  "",
              };

        const orderPayload = {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.name,
            priceCents: item.priceCents,
            shopifyVariantId: item.shopifyVariantId,
          })),
          shipping: {
            method,
            address:
              method === "home"
                ? {
                    ...address,
                    receiver:
                      (address as any)?.receiver ??
                      items[0]?.name ??
                      "PLG Receiver",
                  }
                : undefined,
            store: storePayload,
          },
          totals: { subtotal, shippingFee, total },
        };

        const { action, fields } = await createEcpayCheckout({
          tradeNo,
          totalAmount,
          description: "PLG order",
          order: orderPayload,
        });

        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
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
        return;
      }

      await createOrder({
        items,
        shipping: {
          method,
          address: method === "home" ? address : undefined,
          store: method === "home" ? null : selectedStore,
        },
      });
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法建立訂單");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.paymentPage}>
        <p className={styles.stateText}>載入中...</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className={styles.paymentPage}>
        <div className={styles.emptyState}>
          <p>購物車目前是空的</p>
          <Link href="/shop" className={styles.linkButton}>
            返回商店
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.paymentPage}>
      <section className={styles.layout}>
        <div className={styles.shippingCard}>
          <h1>選擇配送方式</h1>

          <div className={styles.shippingOptions}>
            {SHIPPING_METHODS.map((option) => (
              <label
                key={option.value}
                className={`${styles.shippingOption} ${
                  method === option.value ? styles.active : ""
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={option.value}
                  checked={method === option.value}
                  onChange={() => {
                    setMethod(option.value as ShippingMethod);
                    setSelectedStore(null);
                  }}
                />
                <div>
                  <p className={styles.optionTitle}>{option.label}</p>
                  <p className={styles.optionDesc}>{option.description}</p>
                </div>
                <span className={styles.optionFee}>
                  +{currency(option.fee)}
                </span>
              </label>
            ))}
          </div>

          <div className={styles.paymentOptions}>
            <p className={styles.sectionTitle}>付款方式</p>
            <div className={styles.shippingOptions}>
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`${styles.shippingOption} ${
                    paymentMethod === option.value ? styles.active : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() =>
                      setPaymentMethod(option.value as PaymentMethod)
                    }
                  />
                  <div>
                    <p className={styles.optionTitle}>{option.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {method === "home" && (
            <div className={styles.formGrid}>
              <label>
                城市
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="例如：台北市"
                />
              </label>
              <label>
                行政區
                <input
                  type="text"
                  value={address.district}
                  onChange={(e) =>
                    setAddress({ ...address, district: e.target.value })
                  }
                  placeholder="例如：大安區"
                />
              </label>
              <label className={styles.fullWidth}>
                詳細地址
                <input
                  type="text"
                  value={address.detail}
                  onChange={(e) =>
                    setAddress({ ...address, detail: e.target.value })
                  }
                  placeholder="道路、巷弄與門牌號"
                />
              </label>
            </div>
          )}

          {method !== "home" && (
            <div className={styles.storeSelector}>
              <label>取貨門市</label>
              {selectedStore ? (
                <div className={styles.storeInfo}>
                  <p>{selectedStore.name}</p>
                  <p className={styles.storeAddress}>{selectedStore.address}</p>
                  <p>門市編號：{selectedStore.id}</p>
                  {selectedStore.phone && <p>電話：{selectedStore.phone}</p>}
                  {selectedStore.logisticsSubType && (
                    <p>物流類型：{selectedStore.logisticsSubType}</p>
                  )}
                </div>
              ) : (
                <p className={styles.placeholder}>尚未選擇門市</p>
              )}
              <button
                type="button"
                onClick={openStorePicker}
                disabled={pickerLoading}
              >
                {pickerLoading ? "門市載入中..." : "選擇取貨門市"}
              </button>
            </div>
          )}
          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <Link href="/cart" className={styles.linkButton}>
              返回購物車
            </Link>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!items.length || submitting}
            >
              {submitting
                ? "建立訂單中…"
                : paymentMethod === "cod"
                ? "建立訂單"
                : "前往付款"}
            </button>
          </div>
        </div>

        <aside className={styles.summaryCard}>
          <h2>訂單摘要</h2>
          <ul className={styles.itemList}>
            {items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.name ?? "PLG 商品"} × {item.quantity}
                </span>
                <strong>
                  {currency((item.priceCents ?? 0) * item.quantity)}
                </strong>
              </li>
            ))}
          </ul>
          {selectedStore && method !== "home" && (
            <p className={styles.summaryNote}>取貨門市：{selectedStore.name}</p>
          )}
          <div className={styles.summaryRow}>
            <span>商品金額</span>
            <strong>{currency(subtotal)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>
              運費（
              {SHIPPING_METHODS.find((opt) => opt.value === method)?.label}）
            </span>
            <strong>{currency(shippingFee)}</strong>
          </div>
          <div className={styles.totalRow}>
            <span>應付總額</span>
            <strong>{currency(total)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}
