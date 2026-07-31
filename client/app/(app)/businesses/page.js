"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import api from "@/lib/api";
import { useCategories } from "@/hooks/useCategories";
import { useLocationStore } from "@/store/locationStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RadiusSelector from "@/components/features/feed/RadiusSelector";
import NearbyBusinessCard from "@/components/features/business/NearbyBusinessCard";

export default function NearbyBusinessesPage() {
  const lat = useLocationStore((state) => state.lat);
  const lng = useLocationStore((state) => state.lng);
  const radius = useLocationStore((state) => state.radius);
  const setRadius = useLocationStore((state) => state.setRadius);
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (lat == null || lng == null) return;

    let cancelled = false;

    api
      .get("/businesses/nearby", {
        params: {
          lat,
          lng,
          radius,
          search: debouncedSearch || undefined,
          category: categoryId || undefined,
        },
      })
      .then((response) => {
        if (cancelled) return;
        setBusinesses(response.data.data.businesses);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load nearby businesses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, radius, debouncedSearch, categoryId]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Card className="p-5">
          <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Radius</p>
              <RadiusSelector value={radius} onChange={setRadius} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search businesses or addresses..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</p>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeCategory && (
            <p className="mt-4 text-sm text-muted-foreground">
              Filtered to <span className="font-medium text-foreground">{activeCategory.name}</span>
            </p>
          )}
        </Card>

        {loading && <p className="text-sm text-muted-foreground">Loading nearby businesses...</p>}
        {!loading && error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && businesses.length === 0 && (
          <div className="rounded-3xl border border-dashed border-input bg-card p-10 text-center text-sm text-muted-foreground">
            No nearby businesses matched your current filters.
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {businesses.map((business) => (
            <NearbyBusinessCard key={business.id} business={business} />
          ))}
        </section>
      </div>
    </main>
  );
}