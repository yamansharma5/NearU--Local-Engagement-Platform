"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass } from "lucide-react";
import api from "@/lib/api";
import { useLocationStore } from "@/store/locationStore";
import { useCategories } from "@/hooks/useCategories";
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
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-6">
      <header className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">Nearby feed</h1>
      </header>

      <div className="mt-4 flex flex-col gap-3">
        <RadiusSelector value={radius} onChange={setRadius} />
        <TypeFilter value={type} onChange={setType} />
        <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {loading && <p className="text-sm text-muted-foreground">Loading nearby posts...</p>}
        {!loading && error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing nearby yet. Try a bigger radius.
          </div>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} categorySlug={categoryMap[post.categoryId]} />
        ))}
      </div>
    </main>
  );
}
