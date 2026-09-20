# FlagDeck — build progress

Tracking the 4 GitHub issues that break down `PRD.md`. Updated as work lands.

- [x] **#1** Scaffold + deploy skeleton — Next.js + TS + Tailwind, Vercel KV wired up, deployed placeholder
      — live: https://flagdeck-eta.vercel.app (storage: Upstash for Redis via Vercel Marketplace, populates KV_REST_API_URL/TOKEN for @vercel/kv compat)
- [x] **#2** API routes — GET/POST/PATCH/DELETE `/api/flags`, backed by Vercel KV, seed-data bootstrap
      — verified against real Redis: seed on empty GET, POST (+409 dup), PATCH (+404 missing), DELETE (+404 missing), 400 on bad key
- [ ] **#3** Admin UI — flag list, toggle switches, add-flag form, delete, empty state, relative timestamps
- [ ] **#4** Access gate + README + final deploy check — passcode gate, polish, README, verify live URL

## Notes
- Repo: `kavyaparekh/flagdeck` (public)
- Deploy target: Vercel free tier, no AWS
- Vercel login/KV database creation requires the user (browser-based auth) — flagged inline when reached
