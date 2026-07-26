"use client";

import { create } from "zustand";

const STORAGE_KEY = "nearu_location";

export const useLocationStore = create((set, get) => ({
  lat: null,
  lng: null,
  radius: 5,
  initialized: false,

  hydrate: () => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      set({ initialized: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      set({
        lat: parsed.lat ?? null,
        lng: parsed.lng ?? null,
        radius: parsed.radius ?? 5,
        initialized: true,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      set({ initialized: true });
    }
  },

  setLocation: ({ lat, lng }) => {
    const { radius } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, radius }));
    set({ lat, lng });
  },

  setRadius: (radius) => {
    const { lat, lng } = get();
    if (lat != null && lng != null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, radius }));
    }
    set({ radius });
  },

  clearLocation: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ lat: null, lng: null });
  },
}));
