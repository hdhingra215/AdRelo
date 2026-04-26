# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AdRelo – The Agency Engine. A SaaS product built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase. Deployed on Vercel.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm start` — Serve production build

## Architecture

**Next.js 14 App Router** with `src/` directory. Uses route groups for layout separation:

- `src/app/(auth)/` — Public auth pages (login, signup)
- `src/app/(dashboard)/` — Authenticated pages with shared dashboard layout
- `src/app/auth/callback/` — Supabase OAuth callback route handler

**Supabase SSR integration** uses `@supabase/ssr` (not the deprecated `@supabase/auth-helpers-nextjs`). Three client factories in `src/lib/supabase/`:

- `client.ts` — Browser client (`createBrowserClient`) for Client Components
- `server.ts` — Server client (`createServerClient` with cookies) for Server Components, Server Actions, Route Handlers
- `middleware.ts` — Middleware client for session refresh; used by `src/middleware.ts`

**Server Actions:** Auth actions (login, signup, logout) are in `src/app/(auth)/actions.ts`. These use the server Supabase client and `redirect()` for navigation.

**Auth flow:** Middleware refreshes the session token on every request (except static assets, images, favicon). Protected pages (e.g., dashboard) check `supabase.auth.getUser()` server-side and redirect to `/login` if unauthenticated. OAuth/magic-link callbacks are handled by `src/app/auth/callback/route.ts`.

**Path alias:** `@/*` maps to `./src/*`.

**No test framework configured.** There are no tests or test runners set up yet.

**Database types:** `src/types/database.ts` — regenerate from Supabase schema with `npx supabase gen types typescript --project-id <id>`.

## Key Constraints

- **Next.js 14 only.** Do not use Next.js 15+ or 16 APIs (e.g., `async` request APIs, `use cache`). The `cookies()` call in server.ts is synchronous.
- **Supabase SSR pattern.** Always use the appropriate client factory — never instantiate `createClient` from `@supabase/supabase-js` directly in app code. Use `server.ts` in Server Components/Actions and `client.ts` in Client Components.
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be set. See `.env.local.example`.
