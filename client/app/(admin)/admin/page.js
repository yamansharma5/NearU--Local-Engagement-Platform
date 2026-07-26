"use client";

import { useEffect, useState } from "react";
import { FileText, Inbox, Store, Tags, Users } from "lucide-react";
import api from "@/lib/api";
import StatCard from "@/components/common/StatCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/admin/stats")
      .then((response) => {
        if (!cancelled) setStats(response.data.data);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load stats.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Moderate users, businesses, posts, and categories across nearU.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-lg bg-card" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && stats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Users" value={stats.totalUsers} icon={Users} note="Regular + business accounts" />
          <StatCard label="Businesses" value={stats.totalBusinesses} icon={Store} note="Registered businesses" />
          <StatCard label="Active posts" value={stats.activePosts} icon={FileText} note="Visible in feed and map" />
          <StatCard
            label="Pending enquiries"
            value={stats.pendingEnquiries}
            icon={Inbox}
            note="Awaiting a business reply"
          />
          <StatCard label="Categories" value={stats.totalCategories} icon={Tags} note="Used across filters" />
        </section>
      )}
    </div>
  );
}
