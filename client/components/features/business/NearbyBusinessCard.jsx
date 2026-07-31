"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategoryColor } from "@/lib/categoryColors";

export default function NearbyBusinessCard({ business }) {
  const color = getCategoryColor(business.categorySlug);
  const initials = business.name?.slice(0, 1)?.toUpperCase() || "B";

  return (
    <Card className="group h-full overflow-hidden rounded-[22px] border-border/70 bg-card p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="overflow-hidden rounded-[18px] border border-border bg-muted">
        <div className="relative aspect-[16/10] bg-linear-to-br from-slate-950 via-slate-800 to-slate-700">
          {business.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logo} alt={business.name} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-semibold text-white shadow-xl">
                {initials}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />

          <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
            <Badge className="bg-black/35 text-white backdrop-blur">{business.categoryName || "Local business"}</Badge>
            {business.isVerified && (
              <Badge className="bg-white/90 text-slate-900">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
              {typeof business.distance === "number" ? `${business.distance.toFixed(1)} km away` : "Nearby"}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">{business.name}</h3>
            <p className="mt-1.5 line-clamp-2 max-w-xl text-sm leading-5 text-white/78">
              {business.description || business.address}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-2.5 pb-2.5 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
          <span className="text-sm font-medium text-muted-foreground">{business.address}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{business.categoryName || "Uncategorized"}</Badge>
          <Badge variant="secondary">
            <MapPin className="h-3 w-3" />
            Nearby
          </Badge>
        </div>

        <div className="flex gap-2">
          {business.phone && (
            <Button variant="outline" className="h-10 flex-1 text-sm" render={<a href={`tel:${business.phone}`} />}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
          )}
          <Button className="h-10 flex-1 gap-2 text-sm" render={<Link href={`/business/${business.id}`} />}>
            View business
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
