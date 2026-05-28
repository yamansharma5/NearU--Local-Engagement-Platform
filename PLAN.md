# Hyperlocal Lens — Full 10-Phase Build Plan

## Project Overview

Hyperlocal Lens is a real-time hyperlocal discovery and engagement platform that connects users with nearby businesses, offers, events, and community updates within a selected radius.

---

## Tech Stack Decisions

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2.6 (App Router), JavaScript, Tailwind CSS v4, shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Maps | React Leaflet |
| Realtime | Socket.IO |
| Backend | Node.js, Express 5.x, JavaScript (CommonJS) |
| ORM | Prisma 7.8.x |
| Database | Neon PostgreSQL (Haversine via raw SQL for location queries) |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend), Neon (DB) |

---

## Current State

- `client/` — Next.js boilerplate only; no features, no routes, no components
- `server/` — Express + Prisma skeleton; only `User` model, only `GET /` endpoint
- No auth, no folder structure, no real APIs

---

## Folder Structure (Target)

```
hyperlocal-lens/
├── client/
│   ├── app/
│   │   ├── (public)/           # Landing, About, Pricing, Contact
│   │   ├── auth/               # Login, Signup, Forgot Password
│   │   │   └── business/       # Business Login, Business Signup
│   │   ├── (app)/              # User app (auth-guarded)
│   │   │   ├── feed/
│   │   │   ├── map/
│   │   │   ├── search/
│   │   │   ├── saved/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── business/[id]/
│   │   │   ├── post/[id]/
│   │   │   ├── offer/[id]/
│   │   │   ├── event/[id]/
│   │   │   ├── chat/
│   │   │   └── notifications/
│   │   ├── (business)/         # Business dashboard (BUSINESS role-guarded)
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── posts/
│   │   │   ├── offers/
│   │   │   ├── events/
│   │   │   ├── enquiries/
│   │   │   ├── chat/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   └── (admin)/            # Admin panel (ADMIN role-guarded)
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── businesses/
│   │       ├── verifications/
│   │       ├── posts/
│   │       ├── reports/
│   │       ├── categories/
│   │       └── analytics/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── common/             # Navbar, Footer, BottomNav, Sidebar, Cards, Skeletons
│   │   └── features/           # auth/, feed/, map/, search/, business/, chat/, admin/
│   ├── hooks/                  # useAuth, useLocation, useSocket, useNearby, useDebounce
│   ├── lib/                    # api.js (Axios), utils.js, constants.js
│   ├── store/                  # authStore, locationStore, feedStore, chatStore (Zustand)
│   └── public/
│
├── server/
│   ├── index.js                # Entry point
│   ├── src/
│   │   ├── config/             # env.js, cloudinary.js
│   │   ├── controllers/        # auth, user, business, post, offer, event, enquiry, chat, admin
│   │   ├── middlewares/        # auth, role, upload, rateLimiter, errorHandler, ownership
│   │   ├── routes/             # auth, user, business, post, offer, event, enquiry, chat, admin
│   │   ├── services/           # auth, user, business, post, offer, event, location, chat, admin, notification
│   │   ├── sockets/            # index.js, chat.socket.js
│   │   ├── utils/              # apiResponse.js, haversine.js, logger.js
│   │   └── validators/         # auth, business, post, offer, event
│   ├── prisma/
│   │   ├── schema.prisma       # 16 models
│   │   ├── seed.js
│   │   └── migrations/
│   └── lib/
│       └── prisma.js
│
└── docs/
    ├── api-documentation.md
    ├── database-schema.md
    └── deployment-guide.md
```

---

## Database Models (16 total)

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password, role (USER/BUSINESS/ADMIN), avatar, phone, isActive |
| `Business` | id, name, description, phone, logo, ownerId, categoryId, verificationStatus (PENDING/VERIFIED/REJECTED) |
| `BusinessLocation` | id, businessId, address, city, state, pincode, lat, lng, openingHours (Json) |
| `Category` | id, name, slug, icon, isActive |
| `Post` | id, content, images[], type (UPDATE/OFFER/EVENT), authorId, businessId?, lat, lng, isActive |
| `Offer` | id, title, description, discount, images[], validFrom, validUntil, businessId, isActive |
| `Event` | id, title, description, date, venue, images[], businessId, lat, lng, isActive |
| `Enquiry` | id, userId, businessId, postId?, offerId?, eventId?, message, status (PENDING/READ/REPLIED) |
| `Chat` | id, userId, businessId, lastMessageAt |
| `Message` | id, chatId, senderId, senderType (USER/BUSINESS), content, isRead |
| `SavedItem` | id, userId, itemType (BUSINESS/POST/OFFER/EVENT), itemId |
| `Follow` | id, userId, businessId — unique per pair |
| `Review` | id, userId, businessId, rating (Int), content |
| `Report` | id, reporterId, itemType, itemId, reason, status (PENDING/RESOLVED/DISMISSED) |
| `Notification` | id, userId, type, title, body, isRead, data (Json?) |
| `AnalyticsEvent` | id, businessId, eventType (VIEW/ENQUIRY/CLICK/SAVE/FOLLOW), metadata (Json?) |

---

## Phase 1: Foundation & Folder Structure

**Goal:** Clean slate — scalable folder structure, all dependencies installed, env templates, Axios setup.

### Backend
- Install: `jsonwebtoken bcryptjs multer cloudinary socket.io express-rate-limit helmet zod`
- Create `server/src/` tree (config, controllers, middlewares, routes, services, sockets, utils, validators)
- Create `src/utils/apiResponse.js` — standard `success()` / `error()` response wrappers
- Create global error handler middleware (catches Prisma, Zod, JWT errors)
- Create `server/.env.example`

### Frontend
- Install: `zustand react-leaflet leaflet react-hook-form zod @hookform/resolvers socket.io-client axios date-fns lucide-react`
- Run `npx shadcn@latest init` (dark mode, CSS variables, slate)
- Create full `client/` folder structure (route groups, components, hooks, lib, store)
- Create `client/lib/api.js` — Axios instance with JWT interceptor and 401 redirect
- Update `client/app/layout.js` — dark mode, Providers wrapper, Toaster, metadata

**Verification:** `npm run dev` starts in both directories without errors.

---

## Phase 2: Database Schema & Authentication

**Goal:** Complete Prisma schema, migrations, JWT auth APIs, RBAC middleware, seed data.

### Database
- Replace `server/prisma/schema.prisma` with all 16 models
- Run: `npx prisma migrate dev --name init`

### Auth APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Hash password (bcryptjs), create User (role=USER), return JWT |
| POST | `/api/auth/login` | Verify credentials, return JWT + user object |
| POST | `/api/auth/logout` | Stateless — client drops token |
| GET | `/api/auth/me` | Return current user from JWT |
| POST | `/api/auth/business/register` | Create User (role=BUSINESS) + Business (status=PENDING) |
| POST | `/api/auth/business/login` | Business login |

### Middleware
- `auth.middleware.js` — `authenticateToken`: verifies Bearer JWT, attaches `req.user`
- `role.middleware.js` — `requireRole(...roles)`: 403 if role mismatch
- Zod validators on all auth request bodies → 400 on invalid input

### Seed Data
- 5 categories: Food, Retail, Services, Events, Health
- 1 admin user (admin@hyperlens.com / Admin@123)
- 2 normal users with profiles
- 2 businesses with locations, posts, offers, events

### Frontend
- `store/authStore.js` — Zustand (user, token, login(), logout(), isAuthenticated)
- Login, Signup, Business Signup pages (React Hook Form + Zod)
- `(app)/layout.js` — client-side auth guard, redirect to /auth/login
- `hooks/useAuth.js` — hydrate store from localStorage on mount

**Verification:** Register → get JWT → call `/api/auth/me` → success. Seed runs cleanly.

---

## Phase 3: User-Facing MVP (Feed, Map, Discovery)

**Goal:** Complete user discovery experience — nearby feed, map, search, business profiles.

### Location Queries
Haversine formula via `prisma.$queryRaw` (parameterized, no SQL injection risk):
```sql
SELECT *, (6371 * acos(
  cos(radians($lat)) * cos(radians(bl.lat)) *
  cos(radians(bl.lng) - radians($lng)) +
  sin(radians($lat)) * sin(radians(bl.lat))
)) AS distance
FROM "Business" b
JOIN "BusinessLocation" bl ON b.id = bl."businessId"
HAVING distance < $radius
ORDER BY distance
```

### APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/businesses/nearby?lat=&lng=&radius=&category=&search=` | Nearby businesses |
| GET | `/api/posts/nearby?lat=&lng=&radius=&type=` | Nearby posts |
| GET | `/api/offers/nearby?lat=&lng=&radius=` | Nearby offers |
| GET | `/api/events/nearby?lat=&lng=&radius=` | Nearby events |
| GET | `/api/businesses/:id` | Full profile + location + reviews + posts |
| GET | `/api/categories` | All active categories |
| POST | `/api/users/save` | Save item (business/post/offer/event) |
| DELETE | `/api/users/save/:type/:id` | Unsave item |
| GET | `/api/users/saved` | Get saved items |
| POST | `/api/businesses/:id/follow` | Follow business |
| DELETE | `/api/businesses/:id/unfollow` | Unfollow business |

### Frontend Screens
- **Location Permission** — GPS prompt or manual entry, saves to `locationStore`
- **Nearby Feed** — tabs (All/Businesses/Offers/Events/Posts), radius selector (1/3/5/10km), `PostCard`, `BusinessCard`, `OfferCard`, `EventCard`
- **Map View** — React Leaflet `MapContainer`, category-colored markers, popups with CTA, side panel — **dynamic import with `ssr: false`**
- **Search** — debounced (300ms) search bar + category filter pills
- **Business Profile** — hero, verification badge, Call/WhatsApp/Directions/Save buttons, Posts/Offers/Events/Reviews tabs, Send Enquiry modal
- **Detail Pages** — post/[id], offer/[id], event/[id]
- **Saved Items** — tabbed list
- **User Profile** — avatar, edit profile, followed businesses
- **Notifications** — paginated list

### Key Components
- `BottomNav.jsx` — 5 items: Home, Map, Search, Saved, Profile
- `RadiusSelector.jsx`, `CategoryFilter.jsx`
- `MapView.jsx` — client component only

**Verification:** User sees nearby feed, switches to map, taps a business, sends an enquiry.

---

## Phase 4: Business Dashboard

**Goal:** Business owner creates/manages content, views enquiries and analytics.

### APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/businesses` | Create/update business profile |
| PUT | `/api/businesses/:id` | Update business |
| GET | `/api/businesses/dashboard` | Stats: views, followers, enquiries, post count |
| POST | `/api/posts` | Create post for business |
| PUT/DELETE | `/api/posts/:id` | Update/delete post |
| POST/PUT/DELETE | `/api/offers/:id` | Offer CRUD |
| POST/PUT/DELETE | `/api/events/:id` | Event CRUD |
| GET | `/api/businesses/:id/enquiries` | Enquiries inbox |
| PUT | `/api/enquiries/:id/status` | Mark read/replied |
| POST | `/api/upload` | Cloudinary image upload |

### Frontend Screens
- **Layout** — sidebar nav, `requireRole('BUSINESS')` guard, PENDING banner
- **Dashboard Home** — stat cards, recent enquiries, quick actions
- **Profile Setup** — multi-section form (info, location with Leaflet pin picker, images, social links), verification request button
- **Create/Manage Posts** — textarea, image upload (max 5), type selector; manage table with edit/delete
- **Create/Manage Offers** — title, discount %, valid dates, images; manage table
- **Create/Manage Events** — title, date/time, venue with map picker, images; manage table
- **Enquiries Inbox** — status filter, mark as read/replied
- **Analytics** — views/enquiries/followers charts (recharts)

### Upload Middleware
- multer + cloudinary-storage; validates MIME type (jpeg/png/webp only), max 5MB

**Verification:** Business creates a post with image → appears in user's nearby feed and on map.

---

## Phase 5: Chat & Realtime

**Goal:** Real-time messaging between user and business via Socket.IO.

### Socket Events
| Event | Direction | Description |
|---|---|---|
| `join_chat` | Client → Server | Join a chat room |
| `send_message` | Client → Server | Send a new message |
| `message_received` | Server → Client | New message broadcast |
| `messages_read` | Client → Server | Mark messages as read |
| `user_typing` | Client → Server | Typing indicator |

### APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chats/start` | Find or create chat between user + business |
| GET | `/api/chats` | List chats with last message + unread count |
| GET | `/api/chats/:id/messages` | Paginated message history |
| POST | `/api/chats/:id/messages` | REST fallback for sending |

### Frontend
- **Chat List** (user + business) — sorted by `lastMessageAt`, unread badge
- **Chat Detail** — message bubbles (right = mine), text input, socket updates
- **Quick Templates** — "Is this offer still available?", "Are you open now?", "What is the price?", "Can I book?"
- `useSocket.js` — connects with JWT, joins user room, updates `chatStore`
- Unread count badge in `BottomNav` and `BusinessSidebar`

### Notification Service
- `createNotification(userId, type, title, body, data)` — creates DB record + emits via socket if user is online

**Verification:** User sends message → business sees it in real-time. Unread badge updates.

---

## Phase 6: Admin Panel

**Goal:** Admin can verify businesses, moderate content, manage users and categories.

### APIs (all behind `requireRole('ADMIN')`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | Paginated user list with search |
| PUT | `/api/admin/users/:id/toggle-active` | Activate/deactivate user |
| GET | `/api/admin/businesses/pending` | Pending verification list |
| PUT | `/api/admin/businesses/:id/verify` | Approve or reject with optional reason |
| DELETE | `/api/admin/posts/:id` | Remove inappropriate post |
| GET | `/api/admin/reports` | Reports list by status |
| PUT | `/api/admin/reports/:id/resolve` | Resolve or dismiss report |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |

### Frontend Screens
- **Layout** — sidebar, ADMIN role guard
- **Admin Login** — checks `role === 'ADMIN'` after auth
- **Dashboard** — stat cards: Users, Businesses, Pending Verifications, Posts, Open Reports
- **Manage Users** — table with activate/deactivate actions
- **Manage Businesses** — table filtered by verification status
- **Verification Requests** — approve/reject with reason → notification sent to business owner
- **Reports** — resolve/dismiss, optionally remove reported content
- **Category Management** — CRUD UI

**Verification:** Admin approves business → owner sees VERIFIED badge. Admin removes post → disappears from feed.

---

## Phase 7: UI Polish & UX Improvements

**Goal:** Production-quality look across all screens.

### Deliverables
- Skeleton loaders via Suspense boundaries
- Empty states with icon + message + CTA
- Error boundary with fallback UI
- Toast notifications (shadcn `Toaster`) on all async actions
- Button loading spinners, full-page loaders
- **Landing Page** — dark hero with gradient accents, features section, "How it works", pricing preview, CTA
- Smooth animations via Tailwind `transition` and `animate-in` on modals/drawers
- Mobile audit at 375px — fix padding, overflow, font sizes
- Dark mode CSS variable consistency
- PWA: `public/manifest.json`, PWA meta tags in `app/layout.js`

**Verification:** Lighthouse mobile ≥ 70. Professional appearance at both 375px and 1440px.

---

## Phase 8: Security, Testing & Error Handling

**Goal:** Harden for production — no security gaps in the OWASP Top 10.

### Security Measures
| Area | Implementation |
|---|---|
| Headers | `helmet()` middleware |
| Rate Limiting | 100 req/15min general; 10 req/15min on auth endpoints |
| CORS | Restricted to `CLIENT_URL` env var (no wildcard) |
| Input Validation | Zod validators on all POST/PUT routes before controller |
| SQL Injection | All raw queries use `Prisma.sql` tagged templates (parameterized) |
| Auth Guards | `authenticateToken` on all protected routes |
| Ownership | `requireOwnership` middleware on business content routes |
| Role Escalation | `requireRole('ADMIN')` on all `/api/admin/*` routes |
| File Uploads | MIME type check (jpeg/png/webp), 5MB max |
| Secrets | No hardcoded keys; complete `.env.example` |

**Verification:** Unauthenticated request → 401. Wrong role → 403. Auth flood → 429. `.exe` upload → 400.

---

## Phase 9: Deployment

**Goal:** Live production URLs.

### Steps
1. **Neon** — create project, copy `DATABASE_URL`, run migrations + seed
2. **Render** (backend)
   - Root directory: `server/`
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start: `node index.js`
   - Env vars: `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`, `PORT`
3. **Vercel** (frontend)
   - Root directory: `client/`
   - Env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`
4. **Cloudinary** — create account, copy API credentials
5. Create `docs/deployment-guide.md` with all steps and env var reference
6. Update root `README.md` with live URLs and local setup

### Environment Variables Reference

**Server `.env`**
```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Client `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Verification:** Register via production URL, create a post, see it on the map.

---

## Phase 10: Post-MVP Business Validation (Do Not Build Before MVP Ships)

- Subscription plans (Free / Starter / Pro) with feature gating
- Promoted/boosted posts (appear first in feed for X days)
- Payment gateway (Razorpay for India / Stripe global)
- Coupon claim tracking (user clicks "Claim Offer" → logged)
- Business lead dashboard (who viewed, saved, enquired)
- Area-wise engagement heatmap

---

## MVP Verification Checklist

- [ ] User can register, login, set location, see nearby feed
- [ ] User can switch to map view and see nearby markers
- [ ] User can search businesses by name and filter by category
- [ ] User can view a business profile, save it, and follow it
- [ ] Business can register, set up profile, and create a post/offer/event
- [ ] Business post appears in nearby user's feed and on the map
- [ ] User can send an enquiry; business receives it in their inbox
- [ ] User and business can chat in real-time via Socket.IO
- [ ] Admin can log in, approve a business verification request
- [ ] Admin can remove a reported post
- [ ] All protected routes reject unauthenticated/wrong-role requests with 401/403
- [ ] App is fully usable on mobile (375px viewport)

---

## Test Credentials (Seeded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@hyperlens.com | Admin@123 |
| User | user1@example.com | User@123 |
| Business | owner1@example.com | Owner@123 |

---

## Core Commands

```bash
# Backend
cd server
npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev                    # nodemon index.js on port 5000

# Frontend
cd client
npm install
npx shadcn@latest init
npm run dev                    # Next.js on port 3000

# Database
npx prisma studio              # Visual DB browser
npx prisma migrate deploy      # Production migrations
```
