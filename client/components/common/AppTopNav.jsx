"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, CircleUserRound, MapPin, Plus, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed", label: "Feed" },
  { href: "/map", label: "Map" },
  { href: "/businesses", label: "All Businesses" },
];

export default function AppTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex max-w-400 flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
            alleyo
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-1 justify-center px-4 lg:flex">
            <div className="relative w-full max-w-97.5">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search"
                defaultValue=""
                placeholder="Search offers, shops, events..."
                className="h-11 rounded-full border-border/70 bg-[#f6f0e6] pl-11 text-sm shadow-none placeholder:text-muted-foreground/80"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden h-11 items-center gap-2 rounded-full border border-border/70 bg-[#f5efe4] px-4 text-sm font-medium text-foreground shadow-sm lg:inline-flex"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Nearby
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            <Button className="h-11 rounded-full px-5 text-sm shadow-sm" onClick={() => router.push("/businesses")}>
              <Plus className="h-4 w-4" />
              Post
            </Button>

            <button
              type="button"
              aria-label={user?.name ? `Open profile for ${user.name}` : "Open profile"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-[#efe7d7] text-foreground shadow-sm"
              onClick={() => router.push("/profile")}
            >
              {user?.name ? (
                <span className="text-sm font-semibold">{user.name.slice(0, 1).toUpperCase()}</span>
              ) : (
                <CircleUserRound className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto sm:hidden">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-foreground text-background" : "border border-border bg-card text-muted-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/businesses"
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            Nearby businesses
          </Link>
        </div>
      </div>
    </header>
  );
}