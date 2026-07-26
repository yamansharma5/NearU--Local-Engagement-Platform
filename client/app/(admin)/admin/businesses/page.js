"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search, Store } from "lucide-react";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminBusinessesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/businesses", { params: { search: debouncedSearch || undefined } })
      .then((response) => {
        if (!cancelled) setBusinesses(response.data.data.businesses);
        if (!cancelled) setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load businesses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const toggleStatus = async (business) => {
    setUpdatingId(business.id);
    setError("");
    try {
      const response = await api.put(`/admin/businesses/${business.id}/status`);
      const updated = response.data.data.business;
      setBusinesses((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update business.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Moderation</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Businesses</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Deactivating a business hides it and its posts from the public feed and map.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by business or owner email..."
          className="pl-10"
        />
      </div>

      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">Loading businesses...</div>
        ) : businesses.length === 0 ? (
          <div className="p-10 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground/80">No businesses found.</p>
          </div>
        ) : (
          businesses.map((business) => (
            <article
              key={business.id}
              className="flex flex-col gap-3 border-b border-border p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold tracking-tight">{business.name}</h2>
                  <Badge variant="secondary">{business.category?.name || "Uncategorized"}</Badge>
                  <Badge variant={business.isActive ? "success" : "destructive"}>
                    {business.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {business.owner?.name} · {business.owner?.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{business._count?.posts ?? 0} posts</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  className="h-9 gap-1 px-3 text-sm"
                  render={<Link href={`/business/${business.id}`} target="_blank" />}
                >
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={business.isActive ? "destructive" : "outline"}
                  onClick={() => toggleStatus(business)}
                  disabled={updatingId === business.id}
                  className="h-9 gap-2 px-3 text-sm"
                >
                  {updatingId === business.id ? "Updating..." : business.isActive ? "Deactivate" : "Reinstate"}
                </Button>
              </div>
            </article>
          ))
        )}
      </Card>
    </div>
  );
}
