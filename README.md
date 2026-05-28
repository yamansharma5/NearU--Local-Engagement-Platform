# NearU
Imagine you step outside and want to know what's happening nearby — is there a sale at the shop around the corner? A community event this weekend? A new restaurant worth trying? Right now, you'd have to scroll through Instagram, Google Maps, WhatsApp groups, and still miss half of it.

NearU fixes that.

---

## What it is

It's an app that shows you everything happening within your chosen distance — businesses, offers, events, and community posts — all on a map or a simple feed. You set your radius (say, 3 km), and the app surfaces only what's near you, right now.

Think of it like a local notice board, but smarter and on your phone.

---

## Who it's for

**Regular people** who want to discover what's around them — deals, events, local shops — without drowning in irrelevant content from across the city.

**Local business owners** who want to reach people who are actually nearby, not just random internet users. They can post offers, announce events, and chat directly with interested customers.

---

## What you can do with it

- Browse a feed of nearby businesses, deals, and events filtered by distance
- Switch to a map view and see everything pinned around you
- Follow local businesses and get notified when they post something new
- Chat directly with a business to ask questions or make enquiries
- Save things you're interested in for later
- Report anything that seems off

If you own a business, you get a separate dashboard to manage your profile, post offers and events, respond to enquiries, and see basic analytics like how many people viewed your page.

---

## The basic idea in one sentence

> It's a hyperlocal discovery platform — connect people with what's happening around them, and connect businesses with the people right outside their door.

---

## How it's built

The app is split into two parts — a frontend the user sees, and a backend that handles all the data.

**Frontend** — built with Next.js (React framework). Uses Tailwind CSS for styling and Leaflet for the interactive map. Zustand manages state, and Socket.IO keeps the chat and notifications live without needing to refresh the page.

**Backend** — a Node.js + Express server. All data lives in a PostgreSQL database (hosted on Neon). Prisma is used as the ORM to talk to the database cleanly. Location-based queries use the Haversine formula to calculate real distances between coordinates.

**Auth** — JWT-based. Three roles: regular user, business owner, and admin. Each role sees a different part of the app.

**Images** — uploaded to Cloudinary and stored as URLs in the database.

**Real-time** — Socket.IO handles live chat between users and businesses, typing indicators, and instant notifications.

**Stack at a glance:**

| Layer | Tech |
|---|---|
| Frontend | Next.js, Tailwind CSS v4, shadcn/ui |
| Maps | React Leaflet |
| State | Zustand |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) via Prisma |
| Real-time | Socket.IO |
| Images | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

---

## Current status

Still being built. The database and server skeleton are in place; the full app is being built phase by phase — auth, feed, map, business dashboard, real-time chat, and an admin panel for moderation.
