# Alleyo Earlier NearU

It is a hyperlocal discovery platform that helps people find businesses, offers, events, and local updates around them.

Imagine stepping outside and wanting to know what is happening nearby: a sale at the shop around the corner, a food offer from a restaurant, a weekend event, or a new local store worth visiting. Instead of checking multiple apps and groups, NearU brings nearby activity into one feed and one map.

---

## What it is

Alleyo shows users what is happening within a selected distance, such as 1 km, 3 km, or 5 km. Users can browse nearby posts in a feed, view businesses on a map, filter by category, and send enquiries to businesses.

For local businesses, NearU provides a dashboard to manage their profile, publish offers or events, upload images, track enquiries, and stay visible to people nearby.

---

## Who it is for

**Users** who want to discover nearby shops, offers, events, and local updates without scrolling through irrelevant city-wide content.

**Business owners** who want to reach people who are physically close to their store and are more likely to visit, call, or send an enquiry.

**Admins** who manage categories, verify businesses, moderate users, and keep the platform trustworthy.

---

## Current features

- User, business, and admin authentication with role-based access
- Location-based nearby feed with radius filtering
- Interactive map view for nearby businesses and posts
- Business profile pages with contact and enquiry options
- Business dashboard for posts, offers, events, profile editing, and enquiries
- Image upload support for business logos and post images
- Offer expiry and post extension flow
- Nearby business listing with search and category filters
- Admin dashboard for users, businesses, posts, categories, and verification controls
- JWT authentication, request validation, rate limiting, and protected routes

---

## Core idea

> Connect people with what is happening around them, and connect local businesses with the customers already nearby.

---

## How it is built

The app is split into a frontend client and a backend API.

**Frontend**: Next.js, React, Tailwind CSS, shadcn/ui, Zustand, React Hook Form, Zod, and React Leaflet.

**Backend**: Node.js, Express, Prisma, PostgreSQL, JWT authentication, Zod validation, Cloudinary uploads, and scheduled jobs for offer expiry.

**Location logic**: nearby results currently use latitude/longitude distance calculations. A future version can move this to PostGIS for better geospatial performance.

**Images**: uploaded through the backend and stored in Cloudinary.

**Database**: PostgreSQL with Prisma models for users, businesses, categories, posts, enquiries, and notifications.

**Stack at a glance:**

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, Tailwind CSS v4, shadcn/ui |
| Maps | React Leaflet, Leaflet |
| State and Forms | Zustand, React Hook Form, Zod |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma |
| Images | Cloudinary |
| Auth | JWT, role-based middleware |
| Deployment Target | Vercel frontend, Render backend, Neon PostgreSQL |

---

## Current status

NearU is in MVP stage. The main user, business, and admin flows are implemented, including auth, feed, map, business dashboard, enquiries, image uploads, post expiry, and admin moderation. The next major step is improving production readiness, adding monetization, upgrading geospatial search, and building a richer communication layer.

---

## Render cold start prevention

The backend exposes `GET /api/health` for uptime checks. It verifies the API process and database connection, and returns a small JSON response with `status`, `database`, `uptime`, and `timestamp`.

For the free Render tier, create a free cron-job.org job that pings:

```text
https://YOUR_RENDER_SERVICE.onrender.com/api/health
```

Set the schedule to every 10 minutes. This keeps the Render web service warm during demo windows and avoids the first visitor waiting through a cold start.

---

## Future scope

Alleyo can grow from a discovery MVP into a complete hyperlocal business platform.

- **Razorpay payments for business promotion**: businesses can pay for promoted posts, featured map pins, boosted offers, premium profile placement, and subscription plans. Razorpay webhooks can confirm payments, renewals, refunds, and failed transactions.
- **Promoted posts and local ads**: businesses can boost posts for a selected radius, time window, category, or local area. Promoted content should be clearly marked while still staying relevant to the user's location.
- **PostGIS-based location search**: replace manual distance calculations with PostgreSQL + PostGIS for faster radius search, geospatial indexes, polygon-based areas, city zones, and scalable map queries.
- **Real-time chat**: add direct chat between users and businesses with message history, read receipts, typing indicators, attachments, and moderation tools.
- **Business analytics**: show profile views, post views, call clicks, direction clicks, saved offers, enquiry conversion, and promotion performance.
- **Notifications**: add in-app, push, email, or SMS notifications for new offers, enquiry replies, followed businesses, expiring deals, and admin updates.
- **Reviews and trust signals**: add ratings, reviews, verified business badges, report handling, and admin approval workflows.
- **Saved businesses and follows**: users can save posts, follow businesses, and receive updates from places they care about.
- **Advanced admin controls**: add audit logs, verification queues, flagged content review, account suspension history, and platform health metrics.


---

## How it can be scaled

The platform can scale gradually as users, businesses, posts, and location queries increase.

1. **Database scaling**

   Add indexes for users, businesses, categories, posts, status fields, and location fields. Move geospatial queries to PostGIS with GiST indexes for fast nearby search. Use pagination and cursor-based loading for feed, map, and listing pages.

2. **Backend scaling**

   Keep the API stateless so multiple Node.js instances can run behind a load balancer. Move heavy work such as notification delivery, payment handling, analytics aggregation, and expiry jobs into background workers.

3. **Location scaling**

   Use PostGIS for radius filters, distance sorting, bounding boxes, polygons, and city zones. This allows the app to handle dense local data without scanning every business or post manually.

4. **Caching**

   Use Redis for hot data such as categories, nearby feed results, business profiles, rate limits, and session-related lookups. CDN caching can serve static assets and uploaded images efficiently.


5. **Payments and subscriptions**

   Razorpay payment events should be processed through verified webhooks. Payment, subscription, promotion, refund, and invoice records should be stored separately so business billing stays reliable and auditable.
