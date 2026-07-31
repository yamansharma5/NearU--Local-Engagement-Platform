"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VALUE_POINTS = [
  {
    label: "Nearby discovery",
    detail: "Show people what is happening within a chosen radius, not across the whole city.",
    icon: Building2,
  },
  {
    label: "Instant local updates",
    detail: "Businesses publish offers, events, and announcements that surface immediately.",
    icon: Search,
  },
  {
    label: "Direct enquiries",
    detail: "Interested users can contact a business without extra steps or noise.",
    icon: MapPin,
  },
];

const METRICS = [
  { value: "3 km", label: "Typical discovery radius" },
  { value: "2 flows", label: "Feed and map views" },
  { value: "1 inbox", label: "Direct user enquiries" },
];

export default function Home() {
  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
        >
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MapPin className="h-4 w-4" />
            </span>
            <span>nearU</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/auth/login" />}>
              Log in
            </Button>
            <Button className="h-10 px-4 text-sm" render={<Link href="/auth/signup" />}>
              Get started
            </Button>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Hyperlocal discovery for people and businesses
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
              Local updates, near you
            </p>
            <h1 className="max-w-xl text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Find what nearby businesses are doing right now.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/70 sm:text-xl">
              nearU connects people with local updates, offers, and events from businesses around
              them in a simple feed and a clear map.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-sm" render={<Link href="/auth/signup" />}>
                Explore nearby
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-sm"
                render={<Link href="/auth/business/signup" />}
              >
                Register your business
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {METRICS.map((item) => (
                <Card key={item.label} className="border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold tracking-tight text-white">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">{item.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                    Live preview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Discover. Post. Enquire.
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {VALUE_POINTS.map(({ label, detail, icon: Icon }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium tracking-tight text-white">{label}</p>
                        <p className="mt-1 text-sm leading-6 text-white/60">{detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Core flow
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
                  <span className="rounded-full border border-white/10 px-3 py-1">Set location</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Browse feed</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Switch map</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Send enquiry</span>
                </div>
              </div>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">For people</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Quickly see nearby offers, events, and posts without scrolling through irrelevant content.
                </p>
              </Card>
              <Card className="border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">For businesses</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Reach the people closest to you with posts that are simple to publish and easy to manage.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
