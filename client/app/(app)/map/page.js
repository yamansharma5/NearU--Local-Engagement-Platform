"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { getPostTypeEntries } from "@/lib/postTypeColors";

const NearbyMap = dynamic(() => import("@/components/features/map/NearbyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col px-4 pb-4 pt-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Nearby map</h1>
        </div>
        <div className="flex items-center gap-3">
          {getPostTypeEntries().map(({ type, label, dot }) => (
            <span key={type} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </header>
      <NearbyMap />
    </main>
  );
}
