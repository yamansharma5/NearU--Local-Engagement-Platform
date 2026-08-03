# Alleyo <sub>(formerly NearU)</sub>

**See what's happening around you.**

Alleyo is a hyperlocal discovery platform that surfaces nearby businesses, offers, events, and local updates in a single location-aware feed and map — instead of scattering them across city-wide marketplaces, chat groups, and social feeds where "nearby" gets lost in the noise.

---

## Overview

Most "discovery" apps are built around a city, a category, or a search box — none of them start with the question that actually matters when you're standing outside: *what's around me, right now, within walking or driving distance?*

Alleyo answers that question directly. A user shares their location once, picks a radius (1 km, 3 km, 5 km, etc.), and gets a live feed of posts — updates, offers, and events — from businesses physically near them. Businesses, in turn, get a dashboard to publish that content, manage their profile, and respond to enquiries from people who are actually close enough to visit.

The project is a full-stack application with a Next.js frontend and an Express/PostgreSQL backend, built around three roles — **User**, **Business**, and **Admin** — each with its own authenticated experience.

## Problem Statement

- **Local businesses are invisible online.** A neighborhood café, tailor, or salon rarely shows up in generic search or social feeds unless it pays for ads that target an entire city, most of which is irrelevant to a walk-in customer.
- **Users have no single "nearby" feed.** Finding out about a sale, a pop-up event, or a new store nearby means checking Instagram, WhatsApp groups, Google search, and word of mouth — separately, and inconsistently.
- **Distance is treated as an afterthought.** Most platforms filter by city or pincode, not by an actual radius from the user's real-time position, so "nearby" results can still be many kilometers away.
- **Offers and events are time-sensitive but poorly communicated.** A discount that ends today or an event happening this weekend gets buried in a general listing with no urgency or expiry signal.

Alleyo is built to close this gap: a feed and map that are inherently local, ranked by real distance, and built around content types (updates, offers, events) that reflect how local businesses actually communicate.


The guiding principle: **connect people with what is happening around them, and connect local businesses with the customers already nearby.**

## Key Features

| Feature | Description |
|---|---|
| **Location-based nearby feed** | Users set their coordinates and a radius (up to 50 km); the feed shows only active posts from businesses within that distance, sorted nearest-first. |
| **Interactive map view** | A Leaflet-based map plots nearby businesses so users can browse spatially instead of as a list. ||
| **Image uploads** | Business logos and post images are uploaded through the backend and stored on Cloudinary (JPEG/PNG/WebP, up to 5 MB). |
| **Manual location fallback** | If browser geolocation is denied or unsupported, users can enter latitude/longitude manually to continue using the app. |
| **API hardening** | Helmet security headers, a CORS allow-list, general and auth-specific rate limiting, and Zod-based request validation on every write endpoint. |

## User Roles

Alleyo has three distinct roles, enforced by backend middleware (`authenticateToken` + `requireRole`) and reflected in the frontend's route groups.

| Role | Who they are | What they can do |
|---|---|---|
| **User** | Anyone discovering local activity | Set/update location and radius, browse the nearby feed and map, filter by category/type, view business profiles, send enquiries, manage their own account details |
| **Business** | A shop, service, or organizer with a registered business profile | Everything a user's core auth allows, plus: manage their business profile (name, description, address, location, category, logo), create/update/delete posts, view and respond to enquiries sent to them |
| **Admin** | Platform operators | View platform-wide stats, list and suspend/reactivate users, list and suspend/reactivate/verify businesses, list and deactivate posts, manage categories (create/update/delete) |


**Request flow at a glance:**

1. The browser requests geolocation (or the user enters coordinates manually); this is stored client-side and sent with every discovery request.
2. Axios attaches the JWT (if logged in) to the `Authorization` header; a response interceptor logs the user out on `401`/`403`.
3. Express applies Helmet, CORS, and rate limiting, then routes the request through `authenticateToken` and `requireRole` where applicable.
4. Controllers stay thin — they call service functions that hold the actual Prisma/SQL logic, then return a consistent `{ success, data, message }` envelope.
5. A background `node-cron` job sweeps expired offers every 10 minutes, independent of any incoming request.

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4, shadcn/ui, tw-animate-css |
| Forms & validation | React Hook Form, Zod,|
| Maps | React Leaflet, Leaflet |
| HTTP client | Axios |
| Notifications (UI) | 

### Backend

| Category | Technology |
|---|---|
| Runtime & framework | Node.js, Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7  |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | Zod |
| File uploads | Multer (memory storage) → Cloudinary |
| Security | Helmet, CORS allow-list, express-rate-limit |

### Infrastructure / Deployment target

| Component | Provider |
|---|---|
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Database | Supabase (managed PostgreSQL) |
| Image storage | Cloudinary |

## Project Structure

```
HyperLocal Lens 2/
├── client/                       # Next.js frontend
│   ├── app/
│   │   ├── (app)/                # User-facing routes: feed, map, businesses, profile
│   │   ├── (business)/           # Business dashboard: profile, posts, enquiries
│   │   ├── (admin)/               # Admin dashboard: users, businesses, posts, categories
│   │   ├── auth/                 # User + business login/signup
│   │   └── layout.js
│   ├── components/
│   │   ├── common/                # AppTopNav, BottomNav, AuthGuard, LocationGate, etc.
│   │   ├── features/               # Feed, map, business, admin, auth feature components
│   │   └── ui/                     # shadcn/ui primitives (button, card, input, badge, ...)
│   ├── hooks/                     # useAuth, useLocation, useCategories, useCountdown, useDebounce
│   ├── lib/                        # api client, role-based redirects, color maps, utils
│   └── store/                      # authStore, locationStore (Zustand)
│
├── server/                       # Express backend
│   ├── src/
│   │   ├── config/                 # env, cloudinary config
│   │   ├── controllers/            # Thin HTTP handlers per resource
│   │   ├── services/                # Business logic + Prisma/SQL queries
│   │   ├── middlewares/             # auth, role, upload, error handler
│   │   ├── validators/              # Zod schemas per resource
│   │   ├── routes/                  # Express routers per resource
│   │   └── jobs/                    # Offer expiry cron job
│   ├── prisma/
│   │   ├── schema.prisma            # User, Business, Category, Post, Enquiry models
│   │   └── seed.js                  # Demo data + admin account seeding
│   ├── lib/prisma.js                # Prisma client singleton
│   └── index.js                     # App bootstrap, middleware, route mounting
│
├── ARCHITECTURE.md                # Deep-dive scaling/production notes
├── LICENSE                        # MIT
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)
- A [Cloudinary](https://cloudinary.com) account for image uploads

### 1. Clone the repository

```bash
git clone <repository-url>
cd "HyperLocal Lens 2"
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env   # then fill in the values (see Environment Variables below)

npx prisma migrate dev   # applies the schema to your database
node prisma/seed.js       # optional: loads demo categories, users, businesses, posts

npm run dev               # starts the API on http://localhost:5000 (nodemon)
```

### 3. Frontend setup

```bash
cd client
npm install

# create client/.env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev               # starts the app on http://localhost:3000
```

### 4. Log in

If you ran the seed script, it creates demo user and business accounts (see `server/prisma/seed.js`) plus an admin account using `ADMIN_EMAIL`/`ADMIN_PASSWORD` from your `.env` (falling back to `admin@example.com` / `Admin@123` if unset).

### Useful backend scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart) |
| `npm start` | Start the API with plain Node |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Run Prisma migrations in dev mode |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default `5000`) | Port the Express server listens on |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret used to sign/verify JWTs |
| `JWT_EXPIRES_IN` | No (default `7d`) | JWT expiry duration |
| `CLIENT_URL` | No | Primary frontend origin for CORS |
| `CLIENT_URLS` | No | Comma-separated list of additional allowed frontend origins |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret |
| `ADMIN_EMAIL` | No | Email used for the seeded admin account |
| `ADMIN_PASSWORD` | No | Password used for the seeded admin account |



## Location Search Logic

Alleyo's "nearby" concept is implemented with the **Haversine formula**, computed directly in PostgreSQL through Prisma's raw SQL (`$queryRaw`), rather than relying on a client-side or in-memory distance calculation:

```sql
6371 * acos(
  LEAST(1.0,
    cos(radians(:lat)) * cos(radians(row.lat)) *
    cos(radians(row.lng) - radians(:lng)) +
    sin(radians(:lat)) * sin(radians(row.lat))
  )
) AS distance
```

This approach is simple, requires no PostgreSQL extensions, and is accurate enough for city-scale radius search. Its main limitation — and the reason a PostGIS migration is on the roadmap — is that it can't use a spatial index, so every nearby query still scans all active rows before filtering by distance.


## Scalability Plan

| Area | Current state | Planned improvement |
|---|---|---|
| **Location queries** | Haversine formula over `(lat, lng)` B-tree index | Migrate to PostGIS (`geography` columns + GiST index, `ST_DWithin`) for indexed radius search, polygons, and city zones |
| **Database** | Single Neon PostgreSQL instance, composite indexes on hot columns | Add read replicas for feed/map traffic, keep writes on the primary, add pagination/cursor-based loading for large result sets |
| **Backend compute** | Single stateless Express instance | Horizontal scaling behind a load balancer (Render supports multiple instances); move heavy work (notifications, analytics, payments) to background workers/queues |
| **Caching** | None — every request hits PostgreSQL directly | Introduce Redis for hot data: category lists, popular nearby-feed results, business profiles, rate-limit counters |
| **Scheduled jobs** | In-process `node-cron`, tied to server uptime | Move to an external scheduler or a dedicated worker process so expiry doesn't depend on API uptime |
| **Images/static assets** | Cloudinary direct serving | CDN-backed delivery (Cloudinary already fronts a CDN) plus responsive transformations at request time |


## Business Scope

Alleyo sits at the intersection of **local discovery** and **small business marketing**, a space typically served by a patchwork of tools: city-wide classifieds, social media pages, and generic map listings — none of which are built specifically around real-time proximity.

**Target segments:**

- **Independent local businesses** (cafés, retail stores, salons, gyms, repair services, tutoring centers) that want visibility to nearby foot traffic without the cost or complexity of city-wide digital ads.
- **Residents and commuters** in dense urban or suburban areas who want a fast way to check what's relevant within their immediate radius, rather than filtering through city-scale platforms.
- **Event organizers** (pop-ups, local markets, community events) that need short-lived, location-specific visibility rather than a permanent listing.

**Why proximity as the core filter matters:** a discount or event loses almost all of its value to someone 15 km away who cannot realistically visit before it expires. By anchoring every query to a real distance from the user, Alleyo keeps the signal-to-noise ratio high for both sides — businesses reach people who can act, and users only see things they can actually reach.

## Monetization Opportunities

No monetization is implemented today; the following are potential directions, not shipped features:

- **Promoted posts and featured placement** — businesses pay to boost a post's visibility within a chosen radius, time window, or category, clearly marked as promoted.
- **Business subscription tiers** — a paid tier could unlock things like more active posts at once, priority support, or richer profile customization.
- **Featured map pins / premium profile placement** — a paid way to stand out visually on the map view or in category listings.
- **Verification-as-a-service** — a faster or premium path to the admin-verified badge for businesses that want to establish trust quickly.
- **Local ad slots** — a lightweight ad unit scoped to a geographic area, sold directly to nearby businesses rather than through a generic ad network.
- **Payment gateway integration (e.g. Razorpay)** — would be required infrastructure for any of the above, including webhook-based confirmation of payments, renewals, refunds, and failed transactions, with dedicated payment/subscription/invoice records for auditability.

## Future Roadmap

- **PostGIS-based geospatial search** — replace the Haversine raw-SQL approach with indexed spatial queries for faster, more scalable radius search.
- **Real-time chat** — direct messaging between users and businesses, with history and read state, layered on top of the existing enquiry system.
- **Reviews and ratings** — user-submitted ratings and reviews, with admin moderation tools.
- **Saved businesses / follows** — letting users bookmark businesses and get updates from the ones they care about.
- **Business analytics** — profile views, post views, click-throughs, and enquiry conversion, visible on the business dashboard.
- **Payments and promoted content** — the monetization directions above, once there is a validated need for them.
- **Advanced admin tooling** — audit logs, a flagged-content review queue, and platform health metrics.
- **Automated test coverage** — unit and integration tests for the API's core flows (auth, nearby search, post lifecycle, enquiries).

## Conclusion

Alleyo takes a simple, often-overlooked idea — that "nearby" should be measured in real distance, not a city name or a pincode — and builds a focused product around it. The current MVP already covers the full core loop end to end: users can find what's happening around them; businesses can publish and manage that content and respond to interest; and admins can keep the platform trustworthy. The architecture is deliberately simple where simplicity is enough (a raw-SQL Haversine query, an in-process cron job, stateless JWT auth) and the roadmap above is where that simplicity gets traded for scale — PostGIS when radius search needs to be fast at volume, caching and workers when traffic demands it, and payments when the business model calls for it. The result is a project that is honest about what it is today: a working, well-structured local discovery MVP, with a clear and deliberate path to becoming a complete hyperlocal business platform.
