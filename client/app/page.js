"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock,
  Compass,
  EyeOff,
  MapPin,
  MessageCircle,
  Navigation,
  Radar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1];

/* Soft, layered shadows — a hairline contact shadow plus a wide diffuse one. */
const SHADOW_SOFT =
  "shadow-[0_1px_2px_rgb(23_21_15/0.04),0_12px_28px_-18px_rgb(23_21_15/0.18)]";

const NAV_LINKS = [
  { href: "#problem", label: "Why Alleyo" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

const PROBLEMS = [
  {
    title: "Good places stay invisible",
    detail:
      "A bakery opens two streets away and you hear about it months later. Businesses have no simple way to reach the people already nearby.",
    icon: EyeOff,
  },
  {
    title: "Feeds ignore distance",
    detail:
      "Social platforms optimise for reach, not proximity. You scroll past an event in another city while missing the one down the road.",
    icon: Navigation,
  },
  {
    title: "Listings go stale",
    detail:
      "Directories still show last year's hours. Tonight's event, today's offer, this week's change — none of it makes it online in time.",
    icon: Clock,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Set your radius",
    detail: "Share your area once and choose how far you want to see — a few blocks or a few kilometres.",
  },
  {
    step: "02",
    title: "Browse feed or map",
    detail: "Read a feed of what's live nearby, ordered by distance, or switch to the map to see it laid out.",
  },
  {
    step: "03",
    title: "Send an enquiry",
    detail: "Found something worth asking about? Message the business directly, straight from the post.",
  },
];

const FEATURES = [
  {
    title: "Radius-first feed",
    detail:
      "Choose how far you want to see. Every post comes from inside that circle, ordered by how close it is to you.",
    icon: Radar,
  },
  {
    title: "Live map view",
    detail:
      "Switch from feed to map to see exactly which businesses are around you, and how far each one really is.",
    icon: Compass,
  },
  {
    title: "Offers and events",
    detail:
      "Businesses publish the moment something goes live, so what you see is what's actually happening today.",
    icon: Sparkles,
  },
  {
    title: "Direct enquiries",
    detail:
      "Message a business straight from a post. No follows, no threads to manage, no extra app to install.",
    icon: MessageCircle,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Audiences />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- primitives */

/** Fades a section in as it enters the viewport, once, honouring reduced motion. */
function Reveal({ children, delay = 0, className }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg leading-8 text-muted-foreground text-pretty">{description}</p>
      )}
    </div>
  );
}

function BrandMark({ withTagline = false }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
        <Image src="/logo-mark.png" alt="" fill sizes="36px" className="object-contain" priority />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-tight">Alleyo</span>
        {withTagline && (
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Local discovery
          </span>
        )}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------- navbar */

function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-[width] after:duration-300 hover:text-foreground hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" className="hidden h-10 px-4 sm:inline-flex" render={<Link href="/auth/login" />}>
            Log in
          </Button>
          <Button className="h-10 px-4" render={<Link href="/auth/signup" />}>
            Get started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

/* ---------------------------------------------------------------------- hero */

function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-64 lg:px-8">
        {/* Desktop decorative layer: lives in the same 6xl container as the copy,
            so it settles into the space the text leaves open on the right. */}
        <RadiusCluster
          reduce={reduce}
          wrapperClassName="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 sm:block lg:right-6"
          sizeClassName="h-80 w-80 lg:h-[26rem] lg:w-[26rem]"
        />
        <FloatingChip
          className="top-8 right-3 hidden sm:block lg:right-12"
          title="Fresh bakes — 20% off"
          meta="400 m · until 6pm"
          delay={1.0}
          reduce={reduce}
        />
        <FloatingChip
          className="right-6 bottom-16 hidden sm:block lg:right-16"
          title="Open mic tonight"
          meta="1.2 km · starts 8pm"
          delay={1.2}
          reduce={reduce}
        />
        <Pin className="hidden sm:block" style={{ left: "47%", top: "8%" }} delay={0.85} pulse reduce={reduce} />

        <div className="max-w-xl">
          <motion.div {...rise(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399]/70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d399]" />
              </span>
              Hyperlocal discovery, for people and businesses
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="mt-7 text-[2.6rem] leading-[1.06] font-semibold tracking-tight text-balance text-white sm:text-6xl"
          >
            See what&rsquo;s happening around you, right now.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-xl text-lg leading-8 text-white/80 text-pretty sm:text-xl"
          >
            Alleyo surfaces live offers, events, and updates from the businesses inside your chosen
            radius — in one simple feed and a clear map.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 px-6 text-sm shadow-lg shadow-black/30 transition-transform duration-200 hover:-translate-y-0.5"
              render={<Link href="/auth/signup" />}
            >
              Explore nearby
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-white/10 px-6 text-sm text-white backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 hover:text-white"
              render={<Link href="/auth/business/signup" />}
            >
              Register your business
            </Button>
          </motion.div>

          <motion.ul
            {...rise(0.32)}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75"
          >
            {["Verified businesses", "Free to join", "Works in your browser"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-[#34d399]" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Mobile: the same radius visual in normal document flow, so it still
            sits on the photo without absolute-position math against the
            variable height of the stacked text above it. */}
        <div className="relative mt-12 sm:hidden">
          <RadiusCluster reduce={reduce} wrapperClassName="relative mx-auto" sizeClassName="h-60 w-60" />
          <FloatingChip
            className="bottom-0 left-1/2 -translate-x-1/2"
            title="Fresh bakes — 20% off"
            meta="400 m · until 6pm"
            delay={0.5}
            reduce={reduce}
          />
        </div>
      </div>
    </section>
  );
}

/** Full-bleed hero photo, duotoned into the brand palette and deepened where copy sits. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src="/pexels-lara-jameson-8828418.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-[0.85] saturate-[0.3] contrast-[0.95]"
      />
      {/* Duotone: pull the photo's colour toward brand green without overpowering the copy. */}
      <div className="absolute inset-0 bg-primary/35 mix-blend-color" />
      {/* Directional scrims: darker overlay showing image underneath. */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-black/15" />
      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
      {/* Soft hand-off into the page background at the very bottom edge. */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-background sm:h-28" />
    </div>
  );
}

/**
 * A self-contained "radius" visual: concentric rings, a slow sweep, a pulsing
 * centre marker, and a few nearby pins. Always square, so it scales cleanly
 * at any size instead of distorting into an ellipse.
 */
const CLUSTER_PINS = [
  { top: "20%", left: "68%", delay: 0.55 },
  { top: "62%", left: "16%", delay: 0.68 },
  { top: "78%", left: "58%", delay: 0.81 },
  { top: "30%", left: "22%", delay: 0.94 },
];

function RadiusCluster({ reduce, wrapperClassName = "", sizeClassName = "h-72 w-72" }) {
  return (
    <div className={wrapperClassName}>
      <div className={`relative ${sizeClassName}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.32), transparent 70%)" }}
        />

        {[0.3, 0.55, 0.8, 1].map((scale, i) => (
          <motion.div
            key={scale}
            initial={reduce ? false : { scale: 0.7, opacity: 0 }}
            animate={reduce ? false : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              borderStyle: i === 3 ? "dashed" : "solid",
              opacity: 0.55 - i * 0.11,
            }}
          />
        ))}

        {!reduce && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "conic-gradient(from 0deg, rgba(255,255,255,0.22), transparent 22%)" }}
            />
          </motion.div>
        )}

        {CLUSTER_PINS.map(({ top, left, delay }) => (
          <Pin key={`${top}-${left}`} style={{ top, left }} delay={delay} reduce={reduce} />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {!reduce && (
            <motion.span
              className="absolute inset-0 m-auto h-7 w-7 rounded-full bg-[#34d399]"
              initial={{ scale: 0.7, opacity: 0.5 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 2.6, ease: "easeOut", repeat: Infinity }}
            />
          )}
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-[#34d399] ring-4 ring-white/80" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** A small map-style marker dot, optionally with a pulsing "live" halo. */
function Pin({ className = "", style, delay = 0, pulse = false, reduce, size = "h-3.5 w-3.5" }) {
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, scale: 0.4, y: -6 }}
      animate={reduce ? false : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={style}
    >
      {pulse && !reduce && (
        <motion.span
          className={`absolute inset-0 m-auto rounded-full bg-[#34d399] ${size}`}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity, delay }}
        />
      )}
      <span className={`relative block rounded-full border-2 border-white bg-[#34d399] shadow-[0_2px_6px_rgba(0,0,0,0.4)] ${size}`} />
    </motion.span>
  );
}

function FloatingChip({ className, title, meta, delay, reduce }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={`absolute max-w-42 rounded-2xl border border-white/40 bg-card/95 px-3.5 py-2.5 backdrop-blur ${SHADOW_SOFT} ${className}`}
    >
      <p className="text-[0.8rem] leading-5 font-semibold tracking-tight">{title}</p>
      <p className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
        <MapPin className="h-3 w-3 text-primary" />
        {meta}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------- problem */

function Problem() {
  return (
    <section id="problem" className="border-t border-border/60 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="Local news travels slower than it should."
            description="The things worth knowing about are often the closest ones — and they're the hardest to find out about."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map(({ title, detail, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <div className={`h-full rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/25 ${SHADOW_SOFT}`}>
                <Icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-7 text-muted-foreground text-pretty">{detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- how it works */

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The solution"
            title="One radius. One feed. One map."
            description="Alleyo replaces city-wide noise with a circle you draw yourself. Everything inside it is close enough to act on."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, title, detail }, index) => (
            <Reveal key={step} delay={index * 0.1}>
              <div className="group relative h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_2px_rgb(23_21_15/0.04),0_20px_44px_-24px_rgb(23_21_15/0.24)]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {step}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-7 text-muted-foreground text-pretty">{detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ features */

function Features() {
  return (
    <section id="features" className="border-t border-border/60 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything nearby, nothing that isn't."
            description="A deliberately small set of tools — built around distance, freshness, and a direct line to the business."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ title, detail, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.07}>
              <div className={`group flex h-full gap-5 rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_2px_rgb(23_21_15/0.04),0_20px_44px_-24px_rgb(23_21_15/0.24)] ${SHADOW_SOFT}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-muted-foreground text-pretty">{detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- audiences */

function Audiences() {
  const cards = [
    {
      icon: MapPin,
      title: "For people",
      detail:
        "Set your location once, then see what's actually happening nearby — offers, events, and updates from real businesses around you.",
      href: "/auth/signup",
      cta: "Create a free account",
      variant: "default",
    },
    {
      icon: Building2,
      title: "For businesses",
      detail:
        "Register once, publish an update in seconds, and reach the people closest to you — with enquiries landing straight in your inbox.",
      href: "/auth/business/signup",
      cta: "Register your business",
      variant: "outline",
    },
  ];

  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map(({ icon: Icon, title, detail, href, cta, variant }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <div className={`flex h-full flex-col justify-between rounded-[1.75rem] border border-border bg-card p-9 ${SHADOW_SOFT}`}>
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground text-pretty">{detail}</p>
                </div>
                <Button
                  variant={variant}
                  className="group mt-9 h-11 w-fit px-5 text-sm transition-transform duration-200 hover:-translate-y-0.5"
                  render={<Link href={href} />}
                >
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- final cta */

function FinalCta() {
  return (
    <section className="px-6 pb-20 sm:pb-28 lg:px-8">
      <Reveal className="mx-auto max-w-5xl">
        <div
          className={`relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-b from-accent to-card px-8 py-16 text-center sm:px-16 ${SHADOW_SOFT}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(50%_60%_at_50%_0%,rgb(31_122_82/0.12),transparent_75%)]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              See what&rsquo;s nearby, right now.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground text-pretty">
              Join Alleyo to start discovering what&rsquo;s happening around you — or register your business
              and reach the people closest to it.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className={`group h-12 px-6 text-sm transition-transform duration-200 hover:-translate-y-0.5 ${SHADOW_SOFT}`}
                render={<Link href="/auth/signup" />}
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 bg-card px-6 text-sm transition-transform duration-200 hover:-translate-y-0.5"
                render={<Link href="/auth/business/signup" />}
              >
                Register your business
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------- footer */

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { href: "#problem", label: "Why Alleyo" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#features", label: "Features" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/auth/login", label: "Log in" },
      { href: "/auth/signup", label: "Create account" },
      { href: "/auth/business/signup", label: "Register business" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#111111] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-4">
            <BrandMark withTagline />
            <p className="text-sm leading-6 text-white/75 text-pretty">
              Hyperlocal discovery for people and businesses — one feed, one map, and a direct line to
              the places around you.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {FOOTER_LINKS.map(({ heading, links }) => (
              <div key={heading} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {heading}
                </p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Alleyo. All rights reserved.</p>
          <p>Made by Yaman Sharma</p>
        </div>
      </div>
    </footer>
  );
}
