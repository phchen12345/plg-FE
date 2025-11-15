"use client";
import { create } from "zustand";
import { fetchCurrentUser } from "@/api/auth/api_auth";

type User = { id: number; email: string };

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  init: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  init: async () => {
    try {
      const user = await fetchCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));
