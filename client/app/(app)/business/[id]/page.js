"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Navigation, Phone, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import PostCard from "@/components/features/feed/PostCard";
import EnquiryForm from "@/components/features/business/EnquiryForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BusinessProfilePage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/businesses/${id}`)
      .then((response) => {
        if (!cancelled) setBusiness(response.data.data.business);
      })
      .catch(() => {
        if (!cancelled) setError("Business not found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <main className="px-4 py-6 text-sm text-muted-foreground">Loading...</main>;
  }

  if (error || !business) {
    return <main className="px-4 py-6 text-sm text-destructive">{error || "Business not found."}</main>;
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-6">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-lg font-semibold text-accent-foreground">
            {business.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logo} alt={business.name} className="h-full w-full object-cover" />
            ) : (
              business.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">{business.name}</h1>
              {business.isVerified && (
                <Badge>
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{business.category?.name || "Local business"}</p>
          </div>
        </div>

        {business.description && (
          <p className="mt-4 text-sm leading-6 text-foreground/80">{business.description}</p>
        )}

        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          {business.address}
        </p>

        <div className="mt-4 flex gap-2">
          {business.phone && (
            <Button variant="outline" className="h-10 flex-1 text-sm" render={<a href={`tel:${business.phone}`} />}>
              <Phone className="h-4 w-4" /> Call
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 flex-1 text-sm"
            render={<a href={mapsUrl} target="_blank" rel="noreferrer" />}
          >
            <Navigation className="h-4 w-4" /> Directions
          </Button>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active posts</h2>
        <div className="mt-3 flex flex-col gap-3">
          {business.posts.length === 0 && (
            <div className="rounded-lg border border-dashed border-input bg-card p-6 text-center text-sm text-muted-foreground">
              No active posts right now.
            </div>
          )}
          {business.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                businessName: business.name,
                businessAddress: business.address,
                businessIsVerified: business.isVerified,
              }}
              categorySlug={business.category?.slug}
              linkable={false}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Send an enquiry</h2>
        <EnquiryForm businessId={business.id} />
      </section>
    </main>
  );
}
