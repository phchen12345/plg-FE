"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cart.module.scss";
import {
  CartItem,
  addToCart,
  fetchCart,
  removeFromCart,
} from "../../api/cart/cart_api";
import { useCart } from "@/context/CartContext";

const currency = (cents = 0) =>
  `NTD ${cents.toLocaleString("zh-TW", { minimumFractionDigits: 0 })}`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { dispatch } = useCart();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const { cart } = await fetchCart();
        setItems(cart);
      } catch (err) {
        const message = err instanceof Error ? err.message : "無法載入購物車";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.priceCents ?? 0;
        return sum + price * item.quantity;
      }, 0),
    [items]
  );
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

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
        err instanceof Error ? err.message : "刪除商品失敗，請稍後再試";
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
    if (!items.length) {
      return (
        <div className={styles.emptyState}>
          <p>購物車目前沒有商品</p>
          <Link href="/shop" className={styles.linkButton}>
            繼續逛逛
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
                <span className={styles.badge}>已選</span>
                <h3>{item.name ?? "PLG 精品"}</h3>
                <p className={styles.meta}>{item.tag ?? "#球迷必備"}</p>
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
              <span>商品共 {totalQuantity} 件</span>
              <strong>{currency(subtotal)}</strong>
            </div>
            <p className={styles.shippingHint}>
              宅配方式與運費會在付款頁面選擇
            </p>

            <div className={styles.totalRow}>
              <span>應付金額</span>
              <strong>{currency(subtotal)}</strong>
            </div>

            <button
              type="button"
              className={styles.checkoutBtn}
              disabled={!items.length}
              onClick={() => router.push("/payment")}
            >
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
