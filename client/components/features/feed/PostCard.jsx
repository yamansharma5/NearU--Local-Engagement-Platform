import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Building2, CalendarDays, Percent } from "lucide-react";
import { getCategoryColor } from "@/lib/categoryColors";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TYPE_META = {
  UPDATE: { label: "Update", icon: Building2, badge: "bg-secondary text-secondary-foreground" },
  OFFER: { label: "Offer", icon: Percent, badge: "bg-[#f6e9e0] text-[#b0532a]" },
  EVENT: { label: "Event", icon: CalendarDays, badge: "bg-accent text-accent-foreground" },
};

export default function PostCard({ post, categorySlug, linkable = true }) {
  const meta = TYPE_META[post.type] || TYPE_META.UPDATE;
  const Icon = meta.icon;
  const color = getCategoryColor(categorySlug);
  const Wrapper = linkable ? Link : "div";
  const wrapperProps = linkable ? { href: `/business/${post.businessId}` } : {};

  return (
    <Wrapper {...wrapperProps} className="group block">
      <Card
        className={`p-4 ${
          linkable ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${color.dot}`} />
            <span className="text-xs font-semibold text-muted-foreground">{post.businessName}</span>
          </div>
          <Badge className={meta.badge}>
            <Icon className="h-3 w-3" />
            {meta.label}
          </Badge>
        </div>

        <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">{post.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.content}</p>

        {post.type === "OFFER" && (
          <p className="mt-3 text-sm font-semibold text-[#b0532a]">
            {post.discount}
            {post.validUntil && ` valid until ${format(new Date(post.validUntil), "d MMM")}`}
          </p>
        )}
        {post.type === "EVENT" && (
          <p className="mt-3 text-sm font-semibold text-primary">
            {post.eventDate && format(new Date(post.eventDate), "d MMM, h:mm a")}
            {post.venue && ` at ${post.venue}`}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {typeof post.distance === "number" ? `${post.distance.toFixed(1)} km away` : post.businessAddress}
          </span>
          {linkable && (
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              View business{" "}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          )}
        </div>
      </Card>
    </Wrapper>
  );
}
