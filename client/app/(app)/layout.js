"use client";

import AuthGuard from "@/components/common/AuthGuard";
import BottomNav from "@/components/common/BottomNav";
import LocationGate from "@/components/common/LocationGate";

export default function AppLayout({ children }) {
  return (
    <AuthGuard role="USER">
      <LocationGate>
        <div className="min-h-screen bg-background pb-24 text-foreground">
          {children}
          <BottomNav />
        </div>
      </LocationGate>
    </AuthGuard>
  );
}
