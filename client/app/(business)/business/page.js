"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Inbox, PlusCircle, Store } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/common/StatCard";

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState(null);
  const [posts, setPosts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.get("/businesses/me"), api.get("/posts/me"), api.get("/enquiries/me")])
      .then(([businessResponse, postsResponse, enquiriesResponse]) => {
        if (cancelled) return;
        setBusiness(businessResponse.data.data.business);
        setPosts(postsResponse.data.data.posts);
        setEnquiries(enquiriesResponse.data.data.enquiries);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load business dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = useMemo(
    () => enquiries.filter((enquiry) => enquiry.status === "PENDING").length,
    [enquiries]
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <p className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Business dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{business?.name || "Your business"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage local posts, keep your profile accurate, and reply to people nearby.
          </p>
        </div>
        <Button className="h-11 gap-2 px-4 text-sm" render={<Link href="/business/posts" />}>
          <PlusCircle className="h-4 w-4" />
          New post
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active posts" value={posts.length} icon={PlusCircle} note="Shown in nearby feed and map" />
        <StatCard label="Pending enquiries" value={pendingCount} icon={Inbox} note="Waiting for your reply" />
        <StatCard label="Category" value={business?.category?.name || "Not set"} icon={Store} note="Used in filters" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="Recent posts" href="/business/posts">
          {posts.length === 0 ? (
            <EmptyState text="No active posts yet." action="Create your first post" href="/business/posts" />
          ) : (
            posts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{post.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{post.type}</p>
                </div>
                <Badge variant="secondary">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </Badge>
              </div>
            ))
          )}
        </Panel>

        <Panel title="Latest enquiries" href="/business/enquiries">
          {enquiries.length === 0 ? (
            <EmptyState text="No enquiries yet." action="View inbox" href="/business/enquiries" />
          ) : (
            enquiries.slice(0, 4).map((enquiry) => (
              <div key={enquiry.id} className="border-b border-border py-3 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{enquiry.user?.name || "Nearby user"}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{enquiry.message}</p>
              </div>
            ))
          )}
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, href, children }) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </Card>
  );
}

function EmptyState({ text, action, href }) {
  return (
    <div className="rounded-md border border-dashed border-input p-5 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href={href} className="mt-3 inline-flex text-sm font-semibold text-primary">
        {action}
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-lg bg-card" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-36 animate-pulse rounded-lg bg-card" />
        ))}
      </div>
    </div>
  );
}
