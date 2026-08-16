# LAST DANCE - Streetwear E-Commerce Platform

LAST DANCE is an unapologetic, brutalist high-fashion streetwear e-commerce application engineered with Next.js 16 (App Router), React 19, Prisma 7 and PostgreSQL, Stripe Checkout, NextAuth.js (v5), Redis Rate Limiting, and Generative Model Studio (OpenRouter).

---

## 1. System Architecture

### Technology Stack
- Framework: Next.js 16 (App Router) + React 19 + Server Components / Server Actions
- Database & ORM: PostgreSQL via Prisma 7 & @prisma/adapter-pg
- Authentication: NextAuth.js v5 (JWT Strategy, Credentials Provider, role-based authorization with DB fallback)
- Payments & Concurrency: Stripe Checkout + Two-Phase Atomic Inventory Reservation with Automatic Expiry & Idempotent Webhook Handler
- Cache & Rate Limiting: Redis (ioredis / Upstash REST) for brute-force protection, checkout DoS limits, and session management
- Fashion Studio: OpenRouter API (google/gemini-2.5-flash-image / Nano Banana) generating multi-view editorial lookbooks
- Styling: Tailwind CSS v4 + M3 Color Tokens + Anton & Geist Typography

---

## 2. Directory Structure

```
src/
├── app/                  # Next.js 16 App Router pages & API routes
│   ├── (account)/        # Customer account & order history
│   ├── (auth)/           # Authentication (login & registration)
│   ├── (storefront)/     # Catalog, collections, search, product detail, cart, wishlist
│   ├── admin/            # Brutalist Admin Dashboard (KPIs, products, orders, studio)
│   └── api/              # Secure REST endpoints & webhook receivers
├── components/           # UI Components, Layout, Providers, Icons
│   ├── admin/            # Admin forms, editors & managers
│   ├── cart/             # Cart synchronization & slide-over
│   ├── layout/           # Header, Footer, navigation
│   ├── reviews/          # Verified review submissions & ratings
│   └── ui/               # Brutalist design system components
├── infrastructure/       # External service adapters
│   ├── prisma/           # Database client & connection pool
│   ├── redis/            # Rate limiting & caching client
│   ├── storage/          # Secure file & image upload handler
│   └── stripe/           # Payment gateway initialization
├── lib/                  # Shared utilities, configuration, money formatting, logger
└── modules/              # Domain-Driven Core Business Modules
    ├── admin/            # Admin dashboard analytics & data queries
    ├── ai-fashion/       # Generative lookbook generation pipeline
    ├── auth/             # Authentication guards & password hashing
    ├── cart/             # Cart Zustand store & client-server synchronization
    ├── catalog/          # Catalog queries, filters, search & recommendations
    ├── checkout/         # Atomic stock reservation & Stripe session creation
    ├── orders/           # Order management & status state machine
    ├── reviews/          # Review submission & moderation
    └── wishlist/         # Wishlist Zustand store
```

---

## 3. Security and Concurrency Design

- Atomic Stock Reservation: Inventory is reserved before redirecting to Stripe. If the session expires or is abandoned, reservations are released lazily or via Vercel cron (/api/cron/release-expired).
- Timing Side-Channel Protection: Login attempts against non-existent users invoke a dummy bcrypt hash computation to prevent username enumeration via response latency.
- Strict Content Security Policy (CSP): Nonce-safe, frame-ancestors denied, strict origin policies.
- Multi-tiered Rate Limiting: Redis-backed limits for login (per IP & per IP+email), registration, checkout attempts, and generation requests.

---

## 4. Development and Commands

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database with sample products & categories
npx prisma db seed

# Run development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run automated smoke tests
npm test
```
