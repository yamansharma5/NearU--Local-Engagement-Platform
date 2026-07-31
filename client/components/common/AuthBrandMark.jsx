import Link from "next/link";
import { MapPin } from "lucide-react";

export default function AuthBrandMark() {
  return (
    <Link
      href="/"
      className="mb-8 flex items-center justify-center gap-3 text-lg font-semibold tracking-tight text-foreground"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <MapPin className="h-4 w-4" />
      </span>
      <span className="flex flex-col leading-tight">
        <span>nearU</span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Local discovery
        </span>
      </span>
    </Link>
  );
}
