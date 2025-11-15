"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/userAuthStore";

export default function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);
  return null;
}
