"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    label: "Business registers",
    detail: "Owners set up a profile with location, category, and contact details.",
    icon: Building2,
  },
  {
    label: "Creates a local post, offer, or event",
    detail: "Updates go out instantly to everyone nearby.",
    icon: Search,
  },
  {
    label: "Nearby user discovers and sends an enquiry",
    detail: "People browse the feed and map, then reach out directly.",
    icon: MapPin,
  },
];

export default function Home() {
  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <MapPin className="h-5 w-5 text-primary" />
            nearU
          </div>
          <Button variant="ghost" render={<Link href="/auth/login" />}>
            Log in
          </Button>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="grid flex-1 items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Hyperlocal discovery MVP
            </p>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Find what nearby businesses are doing right now.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              nearU connects people with local updates, offers, and events from businesses around
              them.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-sm" render={<Link href="/auth/signup" />}>
                Create user account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-sm"
                render={<Link href="/auth/business/signup" />}
              >
                Register business
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {STEPS.map(({ label, detail, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.08 }}
              >
                <Card className="p-5 transition-colors hover:border-primary/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-4 font-medium tracking-tight text-foreground">{label}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{detail}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
