"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FileText, Search } from "lucide-react";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import TypeFilter from "@/components/features/feed/TypeFilter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPostsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [type, setType] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/posts", { params: { search: debouncedSearch || undefined, type: type || undefined } })
      .then((response) => {
        if (cancelled) return;
        setPosts(response.data.data.posts);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load posts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, type]);

  const toggleStatus = async (post) => {
    setUpdatingId(post.id);
    setError("");
    try {
      const response = await api.put(`/admin/posts/${post.id}/status`);
      const updated = response.data.data.post;
      setPosts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update post.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Moderation</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Posts</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hide posts that violate guidelines — hidden posts drop out of the nearby feed and map.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or business..."
            className="pl-10"
          />
        </div>
        <TypeFilter value={type} onChange={setType} />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground/80">No posts found.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-3 border-b border-border p-5 last:border-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{post.type}</Badge>
                  <Badge variant={post.isActive ? "success" : "destructive"}>
                    {post.isActive ? "Active" : "Hidden"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(post.createdAt), "d MMM yyyy")}
                  </span>
                </div>
                <h2 className="mt-2 font-semibold tracking-tight">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{post.business?.name}</p>
                <p className="mt-1 max-w-2xl line-clamp-2 text-sm leading-6 text-foreground/80">{post.content}</p>
              </div>

              <Button
                type="button"
                variant={post.isActive ? "destructive" : "outline"}
                onClick={() => toggleStatus(post)}
                disabled={updatingId === post.id}
                className="h-9 shrink-0 gap-2 px-3 text-sm"
              >
                {updatingId === post.id ? "Updating..." : post.isActive ? "Hide" : "Restore"}
              </Button>
            </article>
          ))
        )}
      </Card>
    </div>
  );
}
