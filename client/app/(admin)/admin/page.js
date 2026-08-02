"use client";

import { useEffect, useState } from "react";
import { FileText, Inbox, ShieldAlert, Store, Tags, Users } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
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
      <Card className="border-white/10 bg-linear-to-br from-card via-card to-accent/30 p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-destructive">
            <ShieldAlert className="h-3.5 w-3.5" />
            Admin overview
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Keep the platform clean and trustworthy.</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Moderate users, businesses, posts, and categories across Alleyo from a single control surface.
          </p>
        </div>
      </Card>

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
          <StatCard label="Users" value={stats.totalUsers} icon={Users} note="Regular and business accounts" />
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
