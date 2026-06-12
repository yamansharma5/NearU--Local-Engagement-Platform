"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Providers({ children }) {
  useAuth();
  return children;
}
