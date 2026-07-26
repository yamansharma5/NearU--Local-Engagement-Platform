"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Compass, Map } from "lucide-react";
import NavPillHighlight from "@/components/common/NavPillHighlight";

const ITEMS = [
  { href: "/feed", label: "Feed", icon: Compass },
  { href: "/map", label: "Map", icon: Map },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-lg shadow-black/10 backdrop-blur">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <NavPillHighlight
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className={`relative z-10 ${active ? "inline" : "hidden sm:inline"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
