"use client";

import AuthGuard from "@/components/common/AuthGuard";

export default function BusinessLayout({ children }) {
  return <AuthGuard role="BUSINESS">{children}</AuthGuard>;
}
