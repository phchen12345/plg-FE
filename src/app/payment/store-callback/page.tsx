// src/app/payment/store-callback/page.tsx
"use client";

import { useEffect } from "react";

const STORAGE_KEY = "plg-selected-store";

export default function StoreCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const getParam = (...keys: string[]) => {
      for (const key of keys) {
        const value = params.get(key);
        if (value && value.trim().length > 0) {
          return value;
        }
      }
      return null;
    };

    const payload = {
      storeid: getParam(
        "storeid",
        "storeId",
        "CVSStoreID",
        "ReceiverStoreID",
        "StoreID"
      ),
      storename: getParam(
        "storename",
        "storeName",
        "CVSStoreName",
        "ReceiverStoreName"
      ),
      storeaddress: getParam(
        "storeaddress",
        "storeAddress",
        "CVSAddress",
        "ReceiverAddress"
      ),
      phone: getParam(
        "phone",
        "CVSTelephone",
        "ReceiverPhone",
        "ReceiverCellPhone"
      ),
      logisticsSubType:
        params.get("LogisticsSubType") ?? params.get("LogisticsSubtype"),
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
