"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Inbox, LogOut, MapPin, PlusCircle, Store } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import NavPillHighlight from "@/components/common/NavPillHighlight";

const NAV_ITEMS = [
  { href: "/business", label: "Dashboard", icon: BarChart3 },
  { href: "/business/posts", label: "Posts", icon: PlusCircle },
  { href: "/business/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/business/profile", label: "Profile", icon: Store },
];

export default function BusinessShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground lg:block">
        <Link href="/business" className="flex items-center gap-2 px-2 py-2 text-lg font-semibold tracking-tight">
          <MapPin className="h-5 w-5 text-sidebar-primary" />
          Alleyo <span className="text-xs font-medium text-sidebar-foreground/45">business</span>
        </Link>

        <nav className="mt-8 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground",
                  active && "text-sidebar"
                )}
              >
                {active && (
                  <NavPillHighlight
                    layoutId="business-nav-desktop"
                    className="absolute inset-0 rounded-md bg-sidebar-foreground"
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-4 left-4 right-4 flex h-10 items-center justify-center gap-2 rounded-md border border-sidebar-border text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/business" className="flex items-center gap-2 font-semibold tracking-tight">
            <MapPin className="h-5 w-5 text-primary" />
            Alleyo
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors",
                  active && "border-transparent text-primary-foreground"
                )}
              >
                {active && (
                  <NavPillHighlight
                    layoutId="business-nav-mobile"
                    className="absolute inset-0 rounded-md bg-foreground"
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
