"use client";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import styles from "../login/login.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { register as registerApi, sendEmailCode } from "@/api/login/login_api";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const validateEmail = () => {
    if (!emailRegex.test(email)) {
      setMessage("請輸入正確的 Email");
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    setMessage("");
    if (!validateEmail()) return;
    try {
      await sendEmailCode(email);
      setCountdown(60);
      setMessage("驗證碼已寄出");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "驗證碼寄送失敗");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!validateEmail()) return;
    if (password !== confirmPassword) {
      setMessage("兩次密碼不一致");
      return;
    }
    if (!verifyCode) {
      setMessage("請輸入驗證碼");
      return;
    }
    try {
      await registerApi({ email, password, verificationCode: verifyCode });
      setMessage("註冊成功，請前往信箱完成驗證或直接登入");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "註冊失敗");
    }
  };

  return (
    <main className={styles.loginWrapper}>
      <div>
        <Image src="/title-login.png" alt="register" width={77} height={20} />
        <p className="text-muted mb-4">會員註冊</p>

        <p className="text-muted mb-4">
          因Render禁止使用SMTP，請使用者直接用email或訪客登入
        </p>

        <form className="w-100" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 border-end-0"
                placeholder="設定密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-white border-start-0">
                <i className="bi bi-eye"></i>
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 border-end-0"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-white border-start-0">
                <i className="bi bi-eye"></i>
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Email 驗證碼</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope-check"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="輸入 6 位數驗證碼"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                maxLength={6}
                required
              />
              <button
                type="button"
                className={`input-group-text bg-dark text-white border-start-0 ${
                  countdown ? "disabled" : ""
                }`}
                onClick={handleSendCode}
                disabled={!!countdown}
                style={{ cursor: countdown ? "not-allowed" : "pointer" }}
              >
                {countdown ? `重新寄送(${countdown}s)` : "取得驗證碼"}
              </button>
            </div>
          </div>

          {message && (
            <div className="text-center text-danger mb-3">{message}</div>
          )}

          <button type="submit" className={`${styles.submitBtn} `}>
            立即註冊
          </button>
        </form>
      </div>
    </main>
  );
}
