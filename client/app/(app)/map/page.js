"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { getPostTypeEntries } from "@/lib/postTypeColors";
import { Card } from "@/components/ui/card";

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
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-4 pt-6 sm:px-6 lg:px-8">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              <MapIcon className="h-3.5 w-3.5" />
              Nearby map
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">See nearby businesses on the map.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Use the map to scan local posts by type and focus on the businesses closest to you.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {getPostTypeEntries().map(({ type, label, dot }) => (
              <span key={type} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <NearbyMap />
      </div>
    </main>
  );
}
