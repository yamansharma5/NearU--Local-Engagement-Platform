import Link from "next/link";
import { MapPin } from "lucide-react";

export default function AuthBrandMark() {
  return (
    <Link
      href="/"
      className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight text-foreground"
    >
      <MapPin className="h-5 w-5 text-primary" />
      nearU
    </Link>
  );
}
