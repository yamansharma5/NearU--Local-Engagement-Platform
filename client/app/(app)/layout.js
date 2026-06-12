"use client";

import AuthGuard from "@/components/common/AuthGuard";

export default function AppLayout({ children }) {
  return <AuthGuard role="USER">{children}</AuthGuard>;
}
