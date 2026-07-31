"use client";

import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";

export default function OfferCountdown({ validUntil, className }) {
  const countdown = useCountdown(validUntil);

  if (!validUntil) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        countdown.expired || countdown.underHour ? "text-destructive" : "text-muted-foreground",
        className
      )}
    >
      <Clock3 className="h-3 w-3" />
      {countdown.label}
    </span>
  );
}
