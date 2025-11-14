# 2Care Monorepo

A Turborepo-powered monorepo for **2Care** — a co-parenting baby care app across **API (NestJS)**, **Web (Next.js 16)**, and **Mobile (Expo/React Native)** with shared TypeScript packages.

---

## 🧱 Monorepo Layout

```
.
├─ apps/
│  ├─ api/           # NestJS backend (PostgreSQL + Prisma + Redis + Socket.io + Bull)
│  ├─ web/           # Next.js 16 web app (App Router, Tailwind, shadcn/ui)
│  └─ mobile/        # Expo/React Native app (Expo Router, NativeWind)
├─ packages/
│  ├─ shared/        # Shared utilities
│  ├─ schemas/       # Zod schemas shared across apps
│  └─ types/         # Shared TypeScript types
├─ .github/          # CI workflows, issue/PR templates, etc.
├─ turbo.json        # Turborepo pipeline config
├─ tsconfig.base.json
└─ package.json      # Root workspace + scripts
```

---

## ⚙️ Requirements

- **Node.js**: 20.x
- **pnpm**: 10.20.0 (via Corepack)
- **Git**: latest recommended version

Enable and pin pnpm:

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
```

---

## 🚀 Getting Started

Install dependencies (workspace-aware):

```bash
pnpm install
```

Run all dev servers:

```bash
pnpm dev
```

Build everything (with Turborepo caching):

```bash
pnpm build
```

Typecheck, lint, and test:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

> The root scripts use **Turborepo** to run tasks across all apps and packages.

---

## 🧩 Workspaces

Root `package.json` defines:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Each app or package has its own `package.json`.  
Cross-workspace imports use workspace references:

```json
"@2care/shared": "workspace:*",
"@2care/schemas": "workspace:*",
"@2care/types": "workspace:*"
```

This allows TypeScript and bundlers to resolve shared code locally.

---

## 🧠 TypeScript Path Aliases

Defined in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@2care/shared/*": ["packages/shared/src/*"],
      "@2care/schemas/*": ["packages/schemas/src/*"],
      "@2care/types/*": ["packages/types/src/*"]
    }
  }
}
```

Each app should **extend** this base config.

---

## ⚡ Turborepo Pipelines

Excerpt from `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] },
    "test": { "outputs": ["coverage/**"] },
    "typecheck": { "outputs": [] }
  }
}
```

- **Caching**: speeds up builds
- **Topological builds**: builds dependencies first

---

## 🪄 Conventions

### Commit Messages (Conventional Commits)

Format:

```
type(scope): message
```

Examples:

- `feat(api): add vaccination reminders`
- `fix(mobile): debounce feeding log submit`
- `chore(repo): add turbo cache to CI`

Common types:

- `feat` — new feature
- `fix` — bug fix
- `chore` — infra/tooling
- `docs` — documentation
- `refactor` — code cleanup
- `test` — tests only

**Enforced via**:

- `commitlint` (checks messages)
- `husky` (`commit-msg` hook)

### PR Rules

- Reference issues: `Closes #123`
- Keep PRs focused and small
- All checks must pass (`lint`, `typecheck`, `build`, `test`)
- Request review before merging
- Prefer **Squash & Merge**

### Pre-commit Hooks

Husky hooks:

```
.husky/pre-commit  → pnpm lint -w
.husky/commit-msg  → commitlint --edit
```

---

## 🧪 CI (GitHub Actions)

Runs on each PR and push to `main`:

1. Checkout + install deps with pnpm
2. Restore Turbo cache
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`

Make these checks **required** in branch protection.

Workflow file:  
`.github/workflows/ci.yml`

---

## 🗂️ Project Management

- **Milestones** = Epics
- **GitHub Project Board** = Roadmap / Sprints
  - Fields: Status, Priority, Target, Area
  - Automation: new issues & PRs auto-added
- **Labels**:
  - Type: `type:feature`, `type:bug`, `type:chore`, `type:docs`
  - Area: `area:api`, `area:web`, `area:mobile`, `area:shared`, etc.
  - Priority: `P0`, `P1`, `P2`

---

## 🧰 Root Scripts

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "prepare": "husky"
  }
}
```

---

## 🩺 Troubleshooting

**pnpm not found**

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
```

**Path aliases not resolving**
Ensure each app’s `tsconfig.json` extends `../../tsconfig.base.json`.

**Turbo cache not working**
Check cache step in CI and ensure outputs match `turbo.json`.

---

## 📜 License

Proprietary — © 2Care. All rights reserved.
