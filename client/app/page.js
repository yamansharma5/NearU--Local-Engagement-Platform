import Link from "next/link";
import { Building2, MapPin, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-emerald-400" />
            nearU
          </div>
          <Link className="text-sm text-zinc-300 hover:text-white" href="/auth/login">
            Log in
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
              Hyperlocal discovery MVP
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Find what nearby businesses are doing right now.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              nearU connects people with local updates, offers, and events from businesses around
              them.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-400 px-5 font-medium text-zinc-950 hover:bg-emerald-300"
                href="/auth/signup"
              >
                Create user account
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 px-5 font-medium text-white hover:bg-zinc-900"
                href="/auth/business/signup"
              >
                Register business
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ["Business registers", Building2],
              ["Creates a local post, offer, or event", Search],
              ["Nearby user discovers and sends an enquiry", MapPin],
            ].map(([label, Icon]) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
                <Icon className="mb-4 h-6 w-6 text-emerald-300" />
                <p className="font-medium text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
