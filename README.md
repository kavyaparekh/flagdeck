# FlagDeck

A mini feature-flag admin panel: view, create, toggle, and delete flags from a
single page, backed by Redis.

**Live:** https://flagdeck-eta.vercel.app

## Stack

- **Next.js (App Router) + TypeScript** — frontend and API routes in one deploy
- **Redis** (Vercel Marketplace "Upstash for Redis" integration, via `@vercel/kv`) — flag storage
- **Tailwind CSS** — styling
- **Zod** — request validation
- **Vercel** (free tier) — hosting

## Features

- `GET/POST /api/flags`, `PATCH/DELETE /api/flags/[key]` — full CRUD for flags
- Flags seed automatically on first read (`new-onboarding-flow`, `ai-recommendations-beta`,
  `experiment-checkout-v2`, `dark-mode-rollout`) so the demo is never empty
- Single shared passcode gate on the UI and on write requests — not real auth,
  just enough to keep this off the open internet as a write-anything page

## Running locally

```bash
npm install
vercel link          # connect to your own Vercel project
vercel env pull .env.local
npm run dev
```

`.env.example` lists the required variables: `KV_REST_API_URL` / `KV_REST_API_TOKEN`
(from a Redis integration in the Vercel Storage tab) and `NEXT_PUBLIC_ACCESS_PASSCODE`.

## This is a prototype

Built in an afternoon on Vercel + Redis because that's the fast, free way to prove
the concept. It intentionally skips real auth, environment targeting, rollout
percentages, and audit logs — none of that is needed to demonstrate the core
idea. To actually run this in production at scale, the natural next step is
Lambda + DynamoDB (or an equivalent managed backend) behind a real auth provider,
with the same admin UI in front of it.
