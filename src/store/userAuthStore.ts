"use client";
import { create } from "zustand";
import { fetchCurrentUser } from "@/api/auth/api_auth";

type User = { id: number; email: string; isAdmin: boolean };

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
      const me = await fetchCurrentUser(); // { userId, email, isAdmin }
      set({
        user: {
          id: me.userId,
          email: me.email,
          isAdmin: me.isAdmin,
        },
      });
    } catch {
      set({ user: null });
    }
  },
}));
