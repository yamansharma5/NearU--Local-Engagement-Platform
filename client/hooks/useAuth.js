"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) hydrate();
  }, [hydrate, initialized]);

  return useAuthStore();
}
