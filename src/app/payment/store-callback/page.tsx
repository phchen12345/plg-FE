// src/app/payment/store-callback/page.tsx
"use client";

import { useEffect } from "react";

const STORAGE_KEY = "plg-selected-store";

export default function StoreCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = {
      storeid:
        params.get("storeid") ??
        params.get("storeId") ??
        params.get("CVSStoreID"),
      storename:
        params.get("storename") ??
        params.get("storeName") ??
        params.get("CVSStoreName"),
      storeaddress:
        params.get("storeaddress") ??
        params.get("storeAddress") ??
        params.get("CVSAddress"),
      phone: params.get("phone") ?? params.get("CVSTelephone"),
      logisticsSubType: params.get("LogisticsSubType"),
    };

    if (payload.storeid) {
      const data = {
        id: payload.storeid,
        name: payload.storename ?? payload.storeid,
        address: payload.storeaddress ?? "",
        phone: payload.phone ?? "",
        logisticsSubType: payload.logisticsSubType ?? "",
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.opener?.postMessage(data, "*");
    }

    const timer = setTimeout(() => window.close(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <p>門市資料帶回中，請稍候…YA</p>
    </main>
  );
}
