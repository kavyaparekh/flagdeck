# FlagDeck — build progress

Tracking the 4 GitHub issues that break down `PRD.md`. Updated as work lands.

- [ ] **#1** Scaffold + deploy skeleton — Next.js + TS + Tailwind, Vercel KV wired up, deployed placeholder
- [ ] **#2** API routes — GET/POST/PATCH/DELETE `/api/flags`, backed by Vercel KV, seed-data bootstrap
- [ ] **#3** Admin UI — flag list, toggle switches, add-flag form, delete, empty state, relative timestamps
- [ ] **#4** Access gate + README + final deploy check — passcode gate, polish, README, verify live URL

## Notes
- Repo: `kavyaparekh/flagdeck` (public)
- Deploy target: Vercel free tier, no AWS
- Vercel login/KV database creation requires the user (browser-based auth) — flagged inline when reached
