"use client";

import AuthGuard from "@/components/common/AuthGuard";
import AppTopNav from "@/components/common/AppTopNav";
import BottomNav from "@/components/common/BottomNav";
import LocationGate from "@/components/common/LocationGate";

export default function AppLayout({ children }) {
  return (
    <AuthGuard role="USER">
      <LocationGate>
        <div className="min-h-screen bg-background text-foreground">
          <AppTopNav />
          {children}
          <BottomNav />
        </div>
      </LocationGate>
    </AuthGuard>
  );
}
