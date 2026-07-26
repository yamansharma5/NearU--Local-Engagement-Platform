"use client";

import AuthGuard from "@/components/common/AuthGuard";
import BusinessShell from "@/components/features/business/BusinessShell";

export default function BusinessLayout({ children }) {
  return (
    <AuthGuard role="BUSINESS">
      <BusinessShell>{children}</BusinessShell>
    </AuthGuard>
  );
}
