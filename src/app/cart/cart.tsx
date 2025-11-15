"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./cart.module.scss";
import {
  CartItem,
  addToCart,
  fetchCart,
  removeFromCart,
} from "../../api/cart/cart_api";

import { useCart } from "@/context/CartContext";

const SHIPPING_OPTIONS = [
  { value: "", label: "請先選擇送貨方式", fee: 0 },
  { value: "home", label: "宅配到府 (+NTD 120)", fee: 120 },
  { value: "store", label: "超商取貨 (+NTD 80)", fee: 80 },
  { value: "pickup", label: "現場自取 (免費)", fee: 0 },
];

const currency = (cents = 0) =>
  `NTD ${cents.toLocaleString("zh-TW", { minimumFractionDigits: 0 })}`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { dispatch } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const { cart } = await fetchCart();
        setItems(cart);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "無法取得購物車資料";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const shippingFee = useMemo(() => {
    const option = SHIPPING_OPTIONS.find((opt) => opt.value === shipping);
    return option?.fee ?? 0;
  }, [shipping]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.priceCents ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const total = subtotal + shippingFee;

  const adjustQuantity = async (productId: number, delta: number) => {
    const target = items.find((item) => item.productId === productId);
    if (!target) return;

    const nextQuantity = Math.max(1, target.quantity + delta);
    if (nextQuantity === target.quantity) return;

    setUpdatingId(productId);
    try {
      await addToCart({ productId, quantity: nextQuantity });
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: nextQuantity }
            : item
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "更新購物車失敗，請稍後再試";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId: number) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
      dispatch({ type: "DECREMENT", payload: 1 });
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "移除商品失敗，請稍後再試";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderBody = () => {
    if (loading) {
      return <p className={styles.stateText}>載入中...</p>;
    }
    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }
    if (items.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>購物車目前沒有商品</p>
          <Link href="/shop" className={styles.linkButton}>
            前往選購
          </Link>
        </div>
      );
    }
    return (
      <ul className={styles.itemList}>
        {items.map((item) => {
          const price = item.priceCents ?? 0;
          const imageSrc = item.imageUrl ?? "/cap.jpg";
          const disabled = updatingId === item.productId;
          return (
            <li key={item.productId} className={styles.itemRow}>
              <div className={styles.itemImage}>
                <Image
                  src={imageSrc}
                  alt={item.name ?? "商品"}
                  width={96}
                  height={96}
                  unoptimized
                />
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.badge}>預購</span>
                <h3>{item.name ?? "PLG 官方商品"}</h3>
                <p className={styles.meta}>{item.tag ?? "#黑色"} ｜ 單一尺寸</p>
                <p className={styles.price}>{currency(price)}</p>
              </div>
              <div className={styles.quantityControl}>
                <button
                  type="button"
                  onClick={() => adjustQuantity(item.productId, -1)}
                  disabled={disabled}
                >
                  <i className="bi bi-dash" />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => adjustQuantity(item.productId, 1)}
                  disabled={disabled}
                >
                  <i className="bi bi-plus" />
                </button>
              </div>
              <button
                type="button"
                className={`${styles.removeBtn} absolute top-2 right-2`}
                onClick={() => removeItem(item.productId)}
                disabled={disabled}
              >
                <i className="bi bi-x-lg" />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <main className={styles.cartPage}>
      <section className={styles.hero}>
        <h1>MY CART</h1>
      </section>

      <section className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.cartCard}>
            <header>
              <h2>我的購物車</h2>
              {items.length > 0 && (
                <span className={styles.itemCount}>{totalQuantity} 件商品</span>
              )}
            </header>
            {renderBody()}
          </div>

          <aside className={styles.summaryCard}>
            <h3>TOTAL</h3>
            <div className={styles.summaryRow}>
              <span>商品（{totalQuantity} 件）</span>
              <strong>{currency(subtotal)}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>運費</span>
              <strong>{currency(shippingFee)}</strong>
            </div>
            <select
              className="form-select mt-3"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            >
              {SHIPPING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className={styles.totalRow}>
              <span>應付總額</span>
              <strong>{currency(total)}</strong>
            </div>

            <button type="button" className={styles.checkoutBtn}>
              去付款
            </button>

            <Link href="/shop" className={styles.linkButton}>
              繼續購物
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
