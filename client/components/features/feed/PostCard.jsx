"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Building2, CalendarDays, Percent, ShieldCheck } from "lucide-react";
import { getCategoryColor } from "@/lib/categoryColors";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OfferCountdown from "@/components/features/feed/OfferCountdown";

const TYPE_META = {
  UPDATE: { label: "Update", icon: Building2, badge: "bg-secondary text-secondary-foreground" },
  OFFER: { label: "Offer", icon: Percent, badge: "bg-[#f6e9e0] text-[#b0532a]" },
  EVENT: { label: "Event", icon: CalendarDays, badge: "bg-accent text-accent-foreground" },
};

export default function PostCard({ post, categorySlug, linkable = true }) {
  const meta = TYPE_META[post.type] || TYPE_META.UPDATE;
  const Icon = meta.icon;
  const color = getCategoryColor(categorySlug);
  const isVerified = post.businessIsVerified || post.business?.isVerified;
  const mediaSrc = post.image;
  const initials = (post.businessName || "B").slice(0, 1).toUpperCase();

  return (
    <Card
      className={`overflow-hidden rounded-3xl border-border/70 p-3 shadow-sm ${
        linkable ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md" : ""
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[156px_minmax(0,1fr)] lg:items-stretch">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <div className="relative aspect-square bg-linear-to-br from-[#dde2d1] to-[#cfd7c0]">
            {mediaSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaSrc} alt={post.title} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-3xl font-semibold text-foreground shadow-sm">
                  {initials}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/0 to-transparent" />
          </div>
        </div>

        <div className="min-w-0 px-1 py-1 lg:pr-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">{post.businessName}</h3>
                {isVerified && (
                  <Badge variant="default" className="px-2 py-0.5">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge className={meta.badge}>
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </Badge>
              </div>
              <p className="mt-2 text-[1.02rem] leading-7 text-foreground">{post.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.content}</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              {typeof post.distance === "number" ? `${post.distance.toFixed(1)} km` : post.businessAddress}
            </span>
          </div>

          {post.type === "OFFER" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-[#b0532a]">
              <span>{post.discount}</span>
              {post.validUntil && <OfferCountdown validUntil={post.validUntil} />}
            </div>
          )}
          {post.type !== "OFFER" && post.validUntil && (
            <div className="mt-3">
              <OfferCountdown validUntil={post.validUntil} />
            </div>
          )}
          {post.type === "EVENT" && (
            <p className="mt-3 text-sm font-semibold text-primary">
              {post.eventDate && format(new Date(post.eventDate), "d MMM, h:mm a")}
              {post.venue && ` at ${post.venue}`}
            </p>
          )}

          {linkable && (
            <div className="mt-4">
              <Button className="h-9 rounded-full px-4 text-sm" render={<Link href={`/business/${post.businessId}`} />}>
                Enquire
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
