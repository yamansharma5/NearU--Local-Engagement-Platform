"use client";

import { useEffect } from "react";
import { useLocationStore } from "@/store/locationStore";

export function useLocation() {
  const hydrate = useLocationStore((state) => state.hydrate);
  const initialized = useLocationStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) hydrate();
  }, [hydrate, initialized]);

  return useLocationStore();
}
