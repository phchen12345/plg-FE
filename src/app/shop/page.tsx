"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./shop.module.scss";
import { addToCart } from "../../api/cart/cart_api";
import { useCart } from "@/context/CartContext";

const categories = [
  "所有商品",
  "PLG24-25新款",
  "官方聯名商品",
  "PLG冠軍賽商品",
  "PLG經典款式",
  "PLG季後賽商品",
  "配件類別",
  "PLG23-24新款",
  "Oh my PLG主題款",
];

const products = [
  {
    id: 1,
    title: "PLG 第五季限定 團隊聯名球衣",
    tag: "#黑色",
    url: "/sport_short.jpg",
    price: "NTD 2,280",
  },
  {
    id: 2,
    title: "Mitchell&NessxPLGxTAOYUAN PILOTS 2025冠軍紀念帽",
    tag: "#黑色",
    url: "/cap.jpg",
    price: "NTD 1,080",
  },
  {
    id: 3,
    title: "Mitchell&NessxPLGxTAOYUAN PILOTS 2025冠軍紀念T",
    tag: "#黑色",
    url: "/t-shirt.jpg",
    price: "NTD 1,280",
  },
  {
    id: 4,
    title: "PLG經典款束口運動PRO SOCKS",
    tag: "#白色",
    url: "/socks.jpg",
    price: "NTD 280",
  },
];

export default function ShopPage() {
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [addedQuantityMap, setAddedQuantityMap] = useState<
    Record<number, number>
  >({});
  const [quantityMap, setQuantityMap] = useState<Record<number, number | "">>(
    {}
  );
  const [modalMessage, setModalMessage] = useState("商品已加入購物車");
  const [modalSuccess, setModalSuccess] = useState(true);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstanceRef = useRef<any>(null);

  //購物車數量
  const { dispatch } = useCart();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { default: Modal } = await import("bootstrap/js/dist/modal");
      if (!isMounted || !modalRef.current) return;
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: true,
        focus: true,
      });
    })();
    return () => {
      isMounted = false;
      modalInstanceRef.current?.dispose();
    };
  }, []);

  const showModal = (message: string, success = true) => {
    setModalMessage(message);
    setModalSuccess(success);
    modalInstanceRef.current?.show();
  };

  const handleQuantityChange = (id: number, value: string) => {
    setQuantityMap((prev) => ({
      ...prev,
      [id]: value === "" ? "" : Number(value),
    }));
  };

  const handleAddToCart = async (id: number) => {
    const quantity = quantityMap[id];
    if (!quantity) {
      showModal("請先選擇數量", false);
      return;
    }

    const wasAdded = likedMap[id] ?? false;

    const prevAdded = addedQuantityMap[id] ?? 0;
    const nextTotal = prevAdded + Number(quantity);
    try {
      await addToCart({ productId: id, quantity: nextTotal });
      setLikedMap((prev) => ({ ...prev, [id]: true }));
      setAddedQuantityMap((prev) => ({ ...prev, [id]: nextTotal }));
      if (!wasAdded) {
        dispatch({ type: "INCREMENT", payload: 1 });
      }
      showModal("商品已加入購物車", true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "加入購物車失敗，請稍後再試";
      const isAuthError =
        err instanceof Error &&
        /401|未登入|尚未登入|login/i.test(err.message ?? "");
      showModal(isAuthError ? "請先登入才能加入購物車" : message, !isAuthError);
    }
  };

  return (
    <main className={styles.shop}>
      <section className={styles.hero}>
        <h1>P.LEAGUE+ SHOP</h1>
        <p>官方授權周邊．穿出你的主場風格</p>
      </section>

      <section className={styles.categories}>
        <div className={styles.categoryScroller}>
          {categories.map((category, index) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${
                index === 0 ? styles.active : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.productSection}>
        <h2>所有商品</h2>
        <div className={styles.productGrid}>
          {products.map((product) => {
            const liked = !!likedMap[product.id];
            const quantity = quantityMap[product.id] ?? "";
            const addedCount = addedQuantityMap[product.id] ?? 0;
            return (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.imagePlaceholder}>
                  <Image
                    src={product.url}
                    alt={product.tag}
                    width={300}
                    height={280}
                  />
                </div>
                <div className="mx-5">
                  <select
                    className="form-select mt-2"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    aria-label="選擇數量"
                  >
                    <option value="">選擇數量</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  aria-label="加入購物車"
                  className={styles.likeButton}
                >
                  <i className={`bi  bi-heart `} />
                  <span>加入購物車</span>
                </button>

                <p className={styles.tag}>{product.tag}</p>
                <h3>{product.title}</h3>
                <p className={styles.price}>{product.price}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div
        className="modal fade"
        tabIndex={-1}
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${styles.modalContent}`}>
            <div className="modal-body text-center">
              <div
                className={`${styles.modalCheck} ${
                  modalSuccess ? styles.success : styles.error
                }`}
              >
                <i
                  className={`bi ${modalSuccess ? "bi-check-lg" : "bi-x-lg"}`}
                />
              </div>
              <p className={styles.modalMessage}>{modalMessage}</p>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <button
                type="button"
                className="btn btn-dark px-4"
                data-bs-dismiss="modal"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
