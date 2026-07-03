"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children, role }) {
  const router = useRouter();
  const { initialized, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    if (role && user?.role !== role) {
      router.replace("/");
    }
  }, [initialized, isAuthenticated, role, router, user?.role]);

  if (!initialized) {
    return <div className="min-h-screen bg-background text-foreground" />;
  }

  if (!isAuthenticated || (role && user?.role !== role)) {
    return null;
  }

  return children;
}
