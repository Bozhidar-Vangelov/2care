# 2Care — Baby Care Tracker

A full-stack monorepo for tracking baby feeding, sleep, diaper changes, and milestones. Built as a Progressive Web App for mobile-first use with a shared codebase ready for a React Native app.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [PWA](#pwa)
- [Contributing](#contributing)

---

## Overview

2Care lets parents and caregivers collaboratively track a baby's daily activities in real time. Core features:

- **Activity logging** — feeding (breast/bottle/solid), sleep, diaper changes, tummy time, custom activities
- **Baby profiles** — photo, date of birth, growth tracking
- **Family groups** — invite caregivers via shareable link, role-based access
- **Milestones** — mark and review developmental milestones
- **Offline support** — PWA with service worker caching; works without internet
- **Dark mode** — system-aware theming via `next-themes`

---

## Tech Stack

### Web (`apps/web`)

| Concern | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| Runtime | [React 19](https://react.dev) with React Compiler |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config) |
| Components | [shadcn/ui](https://ui.shadcn.com) (new-york style, Radix UI primitives) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Typography | [Nunito](https://fonts.google.com/specimen/Nunito) + [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) via `next/font` |
| PWA | Native service worker + `app/manifest.ts` (no external library) |

### API (`apps/api`)

| Concern | Technology |
|---|---|
| Framework | [NestJS 11](https://nestjs.com) |
| Database ORM | [Prisma 7](https://www.prisma.io) |
| Database | PostgreSQL (via [Supabase](https://supabase.com)) |
| Auth | JWT (access token 15 min + HttpOnly refresh token 7 days) |
| File storage | Supabase Storage (avatars + baby-photos buckets) |
| Logging | [Pino](https://getpino.io) + `nestjs-pino` |
| Validation | `class-validator` + `zod` |
| Docs | Swagger / OpenAPI (`@nestjs/swagger`) |

### Shared Packages

| Package | Contents |
|---|---|
| `@2care/types` | TypeScript interfaces for all domain entities |
| `@2care/schemas` | Zod validation schemas (shared across web + API) |
| `@2care/shared` | Constants, utility functions, date helpers |

### Tooling

| Tool | Purpose |
|---|---|
| [pnpm 10](https://pnpm.io) | Package manager with workspace support |
| [Turborepo](https://turbo.build) | Monorepo task runner with build caching |
| [TypeScript 5](https://www.typescriptlang.org) | Strict mode + `noUncheckedIndexedAccess` |
| [ESLint 9](https://eslint.org) | Flat config across all packages |
| [Prettier](https://prettier.io) | Code formatting |
| [Husky](https://typicode.github.io/husky) + [Commitlint](https://commitlint.js.org) | Conventional commits enforcement |

---

## Monorepo Structure

```
2care/
├── apps/
│   ├── api/                        # NestJS REST API
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/           # JWT auth, refresh tokens
│   │       │   ├── users/          # Profile, avatar upload
│   │       │   ├── babies/         # Baby CRUD, photos
│   │       │   ├── activities/     # Activity log CRUD
│   │       │   ├── families/       # Family groups, invites, members
│   │       │   ├── notifications/  # Push notification stubs
│   │       │   └── health/         # Health check endpoint
│   │       ├── common/             # Guards, decorators, interceptors
│   │       └── config/             # App, DB, JWT, Supabase config
│   ├── web/                        # Next.js PWA
│   │   ├── public/
│   │   │   ├── sw.js               # Service worker
│   │   │   └── icons/              # PWA icon set (add before deploy)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (authenticated)/  # Shell with sidebar + bottom nav
│   │       │   │   ├── dashboard/
│   │       │   │   ├── babies/
│   │       │   │   ├── activities/
│   │       │   │   ├── families/
│   │       │   │   └── settings/
│   │       │   ├── (public)/         # Centered card layout
│   │       │   │   ├── login/
│   │       │   │   └── register/
│   │       │   └── invite/[token]/   # Family invite acceptance
│   │       ├── components/
│   │       │   ├── layout/           # Sidebar, BottomNav, AppHeader
│   │       │   ├── providers/        # ThemeProvider, ServiceWorker
│   │       │   └── ui/               # shadcn/ui components
│   │       └── lib/
│   │           ├── metadata.ts       # createMetadata() SEO factory
│   │           └── utils.ts          # cn() helper
│   └── mobile/                     # React Native (coming soon)
└── packages/
    ├── types/                      # Shared TypeScript interfaces
    ├── schemas/                    # Shared Zod schemas
    └── shared/                     # Constants + utilities
```

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [pnpm 10+](https://pnpm.io/installation) — `npm i -g pnpm`
- [PostgreSQL](https://www.postgresql.org) or a [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/<your-org>/2care.git
cd 2care
pnpm install
```

### 2. Configure environment variables

Copy the example files and fill in the values:

```bash
# API
cp apps/api/.env.example apps/api/.env

# Web
cp apps/web/.env.example apps/web/.env.local
```

See the [Environment Variables](#environment-variables) section for all required values.

### 3. Set up the database

```bash
cd apps/api
pnpm exec prisma migrate dev
```

### 4. Start the development servers

From the repo root — starts both API and web in parallel:

```bash
pnpm dev
```

Or individually:

```bash
# API only — http://localhost:3000
cd apps/api && pnpm start:dev

# Web only — http://localhost:4200
cd apps/web && pnpm dev
```

The web app opens automatically at `http://localhost:4200`.
Swagger API docs are available at `http://localhost:3000/api/docs`.

---

## Environment Variables

### `apps/api/.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (min 32 chars) |
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `CORS_ORIGIN` | ✅ | Web app URL, e.g. `http://localhost:4200` |
| `PORT` | — | API port (default: `3000`) |
| `NODE_ENV` | — | `development` or `production` |

### `apps/web/.env.local`

| Variable | Required | Description |
|---|---|---|
| `API_URL` | ✅ | NestJS API base URL, e.g. `http://localhost:3000` |
| `JWT_SECRET` | ✅ | Must match `apps/api/.env` exactly |
| `JWT_REFRESH_SECRET` | ✅ | Must match `apps/api/.env` exactly |
| `NEXT_PUBLIC_APP_URL` | ✅ | Web app public URL, e.g. `http://localhost:4200` |
| `NEXT_PUBLIC_APP_NAME` | — | Display name (default: `2Care`) |

> **Security note:** `API_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are server-only — never exposed to the browser bundle. Client components call `/api/v1/...` which Next.js proxies to the API at runtime.

---

## Development

### Scripts (run from repo root)

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode (Turbo, parallel) |
| `pnpm build` | Build all apps and packages |
| `pnpm typecheck` | TypeScript check across the entire monorepo |
| `pnpm lint` | ESLint across all packages |
| `pnpm test` | Run all test suites |

### Working on a single app

```bash
# Web
cd apps/web
pnpm dev          # dev server on :4200
pnpm typecheck    # TS check
pnpm build        # production build

# API
cd apps/api
pnpm start:dev    # watch mode on :3000
pnpm typecheck    # TS check
pnpm test:e2e     # end-to-end tests
```

### Database migrations

```bash
cd apps/api

# Create a migration after editing schema.prisma
pnpm exec prisma migrate dev --name <description>

# Apply to production
pnpm exec prisma migrate deploy

# Open Prisma Studio (visual DB browser)
pnpm exec prisma studio
```

### Commit conventions

Commits are linted by [Commitlint](https://commitlint.js.org) with the conventional preset:

```
feat: add activity log form
fix: correct refresh token expiry
chore: update prisma to 7.3
docs: add env variable reference
```

---

## Architecture

### Authentication flow

```
Browser              Next.js (web)          NestJS (api)
  │                       │                      │
  │  POST /api/v1/auth/login                      │
  │──────────────────────▶│  proxy (rewrite)      │
  │                       │─────────────────────▶│
  │                       │   { accessToken }     │
  │                       │◀─────────────────────│
  │                       │  Set-Cookie: refresh  │
  │◀──────────────────────│  (HttpOnly, Secure)   │
  │   { accessToken }     │                       │
```

- **Access token** — short-lived (15 min), kept in memory, sent as `Authorization: Bearer`
- **Refresh token** — long-lived (7 days), stored in an `HttpOnly` cookie, never readable by JavaScript
- **API proxy** — Next.js rewrites `/api/v1/*` → NestJS, so the browser never knows the backend URL and no CORS headers are needed for same-origin requests

### Route groups

| Group | Layout | When to use |
|---|---|---|
| `(authenticated)` | Sidebar (desktop) + bottom nav (mobile) | Logged-in pages |
| `(public)` | Centered card | Login, register |
| `invite/[token]` | Standalone (no shell) | Family invite links |

### Error & loading boundaries

| File | Scope |
|---|---|
| `global-error.tsx` | Crashes in root layout (Providers, ThemeProvider) |
| `(authenticated)/error.tsx` | Auth page errors — sidebar stays visible |
| `(authenticated)/loading.tsx` | Auth page suspense skeleton |
| `(public)/error.tsx` | Login/register errors |
| `(public)/loading.tsx` | Login/register suspense skeleton |

### Service worker caching

| Request | Strategy |
|---|---|
| `/_next/static/*` | Cache-first (immutable hashed assets) |
| `/_next/image` | Cache-first |
| `/api/v1/*` | Network-first with cache fallback |
| Page navigations | Network-first + `/offline` fallback |
| Everything else | Stale-while-revalidate |

---

## API Reference

The full interactive reference is served by Swagger at:

```
http://localhost:3000/api/docs
```

### Endpoints summary

| Module | Endpoints |
|---|---|
| **Auth** | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/logout-all` |
| **Users** | `GET /users/me`, `PATCH /users/me`, `POST /users/me/avatar`, `DELETE /users/me/avatar` |
| **Babies** | `POST /babies`, `GET /babies`, `GET /babies/:id`, `PATCH /babies/:id`, `DELETE /babies/:id`, `POST /babies/:id/photo`, `GET /babies/:id/photos` |
| **Activities** | `POST /activities`, `GET /activities`, `GET /activities/:id`, `PATCH /activities/:id`, `DELETE /activities/:id` |
| **Families** | `POST /families`, `GET /families`, `GET /families/:id`, `PATCH /families/:id`, `DELETE /families/:id`, `GET /families/:id/members`, `GET /families/:id/babies`, `POST /families/:id/invite`, `POST /families/join`, `PATCH /families/:id/members/:memberId`, `DELETE /families/:id/members/:memberId` |
| **Health** | `GET /health` |

---

## PWA

2Care is installable as a Progressive Web App on any device.

### Installing on iOS

1. Open the site in **Safari**
2. Tap the **Share** button → **Add to Home Screen**

### Installing on Android / desktop

Chrome, Edge, and Samsung Internet show an automatic install prompt when served over HTTPS with a valid manifest and registered service worker.

### Required icon files

Place these in `apps/web/public/icons/` before deploying:

| File | Size |
|---|---|
| `icon-72x72.png` | 72×72 |
| `icon-96x96.png` | 96×96 |
| `icon-128x128.png` | 128×128 |
| `icon-144x144.png` | 144×144 |
| `icon-152x152.png` | 152×152 |
| `icon-192x192.png` | 192×192 |
| `icon-384x384.png` | 384×384 |
| `icon-512x512.png` | 512×512 |
| `icon-maskable-512x512.png` | 512×512 (with safe-zone padding) |
| `apple-touch-icon.png` | 180×180 |

Generate all sizes from one SVG at [realfavicongenerator.net](https://realfavicongenerator.net).

---

## Contributing

1. Branch from `main`: `git checkout -b feat/<description>`
2. Make changes following the existing code style
3. Run `pnpm typecheck && pnpm lint` — both must pass
4. Commit using [Conventional Commits](https://www.conventionalcommits.org)
5. Open a pull request against `main`
