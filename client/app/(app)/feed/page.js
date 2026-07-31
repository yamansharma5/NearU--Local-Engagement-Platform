"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Building2, ChevronRight, Compass, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { useLocationStore } from "@/store/locationStore";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RadiusSelector from "@/components/features/feed/RadiusSelector";
import TypeFilter from "@/components/features/feed/TypeFilter";
import CategoryFilter from "@/components/features/feed/CategoryFilter";
import PostCard from "@/components/features/feed/PostCard";

export default function FeedPage() {
  const lat = useLocationStore((state) => state.lat);
  const lng = useLocationStore((state) => state.lng);
  const radius = useLocationStore((state) => state.radius);
  const setRadius = useLocationStore((state) => state.setRadius);
  const { categories } = useCategories();

  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.slug])),
    [categories]
  );

  const endingSoon = useMemo(() => {
    return posts
      .filter((post) => post.validUntil)
      .slice()
      .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil))
      .slice(0, 2);
  }, [posts]);

  useEffect(() => {
    if (lat == null || lng == null) return;
    let cancelled = false;

    api
      .get("/posts/nearby", {
        params: { lat, lng, radius, type: type || undefined, category: categoryId || undefined },
      })
      .then((response) => {
        if (cancelled) return;
        setPosts(response.data.data.posts);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load nearby posts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, radius, type, categoryId]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <RadiusSelector value={radius} onChange={setRadius} />
            <TypeFilter value={type} onChange={setType} />
            <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Nearby · within {radius} km</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {loading ? "Loading posts..." : `${posts.length} posts sorted by distance`}
              </p>
            </div>
            <Button variant="ghost" className="hidden h-10 rounded-full px-0 text-sm text-muted-foreground lg:inline-flex" render={<Link href="/businesses" />}>
              All businesses
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Loading nearby posts...</p>}
            {!loading && error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <div className="rounded-3xl border border-dashed border-input bg-card p-10 text-center text-sm text-muted-foreground">
                Nothing nearby yet. Try a bigger radius or clear a filter.
              </div>
            )}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} categorySlug={categoryMap[post.categoryId]} />
            ))}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="relative min-h-61.5 bg-[#ece7db]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[52px_52px] opacity-60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(31,122,82,0.18),transparent_28%),radial-gradient(circle_at_68%_20%,rgba(176,83,42,0.2),transparent_22%),radial-gradient(circle_at_48%_58%,rgba(31,122,82,0.18),transparent_20%)]" />
              <MapPinCluster />
              <Button
                variant="outline"
                className="absolute left-4 bottom-4 h-11 rounded-full bg-white/95 px-4 text-sm shadow-md"
                render={<Link href="/map" />}
              >
                Open map →
              </Button>
            </div>
          </Card>

          <Card className="p-5 shadow-sm">
            <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <TrendingUp className="h-4.5 w-4.5 text-[#c25d26]" />
              Ending soon
            </div>

            <div className="mt-4 space-y-3">
              {endingSoon.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expiring offers right now.</p>
              ) : (
                endingSoon.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-[#f2ddcf] px-2.5 py-1 text-xs font-medium text-[#c25d26]">
                      {formatDistanceToNow(new Date(post.validUntil), { addSuffix: false })} left
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground">
                        {post.discount || post.title} · <span className="text-muted-foreground">{post.businessName}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function MapPinCluster() {
  const pins = [
    { className: "left-[25%] top-[27%] bg-[#2f8657]" },
    { className: "left-[58%] top-[15%] bg-[#c25d26]" },
    { className: "left-[48%] top-[48%] bg-[#2f8657]" },
  ];

  return (
    <div className="absolute inset-0">
      {pins.map((pin, index) => (
        <span
          key={index}
          className={`absolute h-5 w-5 rounded-full border-[3px] border-white shadow-[0_10px_18px_rgba(0,0,0,0.18)] ${pin.className}`}
        />
      ))}
    </div>
  );
}
