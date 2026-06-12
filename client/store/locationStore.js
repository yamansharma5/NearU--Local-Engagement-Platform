"use client";

import { create } from "zustand";

export const useLocationStore = create((set) => ({
  lat: null,
  lng: null,
  radius: 5,
  setLocation: ({ lat, lng }) => set({ lat, lng }),
  setRadius: (radius) => set({ radius }),
}));
