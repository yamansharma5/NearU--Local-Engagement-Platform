"use client";

import { create } from "zustand";
import api, { setAuthToken } from "@/lib/api";

const STORAGE_KEY = "nearu_auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  initialized: false,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      set({ initialized: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setAuthToken(parsed.token);
      set({
        user: parsed.user || null,
        token: parsed.token || null,
        isAuthenticated: Boolean(parsed.token),
        initialized: true,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      set({ initialized: true });
    }
  },

  login: ({ token, user }) => {
    setAuthToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user, isAuthenticated: true, initialized: true });
  },

  logout: () => {
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false, initialized: true });
  },

  refreshMe: async () => {
    const token = get().token;
    if (!token) return null;
    setAuthToken(token);
    const response = await api.get("/auth/me");
    const user = response.data.data.user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ user, isAuthenticated: true });
    return user;
  },
}));
