"use client";

import AuthGuard from "@/components/common/AuthGuard";
import AdminShell from "@/components/features/admin/AdminShell";

export default function AdminLayout({ children }) {
  return (
    <AuthGuard role="ADMIN">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
