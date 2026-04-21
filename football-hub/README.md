## Football Hub

Modern full-stack football app built with Next.js App Router, Tailwind, Zustand, and API routes.

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then set:

- `RAPIDAPI_KEY`
- optionally custom endpoints if your Rapid plan uses different paths

3) Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live Data Integration (RapidAPI)

- Live list endpoint is read through `app/api/live/route.ts`
- Match details endpoint is read through `app/api/match/[id]/route.ts`
- Additional Rapid proxy routes:
  - `/api/players/search?search=m`
  - `/api/players/[id]`
  - `/api/events/[id]/stats`
  - `/api/events/[id]/lineup`
  - `/api/news` (trending news proxy with fallback)
- Both use `lib/rapidFootball.ts` with:
  - server-side key usage only
  - 30-second in-memory cache for live matches
  - automatic fallback to mock data when API fails or quota is exceeded

## Important

- Do not put API keys inside client code.
- If a key has been exposed in chat/screenshots, regenerate it in RapidAPI dashboard.
- Free plans with low quota should keep polling interval >= 30s (already configured).

## Scripts

- `npm run dev` - start dev
- `npm run lint` - lint
- `npm run build` - production build
