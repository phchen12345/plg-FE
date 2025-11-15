"use client";
import { FormEvent, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./login.module.scss";
import Image from "next/image";
import { fetchCartItemCount } from "@/api/cart/cart_api";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/userAuthStore";
import { startGoogleLogin } from "@/api/login/login_api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const { dispatch } = useCart();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("請輸入 Email");
      return;
    }
    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
      const response = await fetch(`${baseUrl}/api/auth/login-email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.message ?? "登入失敗");
      }
      const data = await response.json();
      const count = await fetchCartItemCount();
      dispatch({ type: "SET_COUNT", payload: count });
      loginStore({ id: data.userId, email });
      router.push("/");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginWrapper}>
      <div>
        <Image src="/title-login.png" alt="login" width={77} height={20} />
        <p className="text-muted mb-4">會員登入</p>

        <form className="w-100" onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="輸入 Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 border-end-0"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-white border-start-0">
                <i className="bi bi-eye"></i>
              </span>
            </div>
          </div>

          <div className="mb-4 text-end">
            {/* <a href="#" className={styles.link}>
              忘記密碼
            </a> */}
            <a href="/register" className={styles.link}>
              註冊帳號
            </a>
          </div>

          <button
            type="button"
            className={`${styles.submitBtn} mb-4`}
            onClick={startGoogleLogin}
          >
            使用 Google 信箱登入
          </button>

          <button
            type="submit"
            className={`${styles.submitBtn} `}
            disabled={loading}
          >
            {loading ? "登入中..." : "登入"}
          </button>

          {message && (
            <div className="mt-3 text-center text-danger">{message}</div>
          )}
        </form>
      </div>
    </main>
  );
}
