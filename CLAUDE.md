# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Full project context, architecture, tech stack, UX guidelines, and compliance rules are in [`AGENTS.md`](./AGENTS.md). Read that first.

---

## Monorepo Layout

The actual monorepo lives inside `project-link/` at the repo root. Run all commands from there unless noted otherwise.

```text
project-link/
  apps/
    web/          Next.js 16 App Router — internal dashboard + BHW PWA
    api/          FastAPI scaffold — health-domain logic, reporting, analytics
  packages/
    supabase/     Supabase CLI config and migrations
    eslint-config/
    typescript-config/
  turbo.json
  pnpm-workspace.yaml
  package.json
```

---

## Development Commands

### Monorepo (from `project-link/`)

```bash
pnpm turbo dev      # run all apps in dev mode
pnpm turbo build    # build all apps
pnpm turbo lint     # lint all apps
pnpm turbo check-types
```

### `apps/web` (Next.js 16 + React 19)

```bash
cd project-link/apps/web
pnpm dev            # http://localhost:3000
pnpm build
pnpm lint
```

> **Warning:** Next.js 16.x has breaking changes. Before writing any Next.js code, read `project-link/apps/web/node_modules/next/dist/docs/` for current API and file conventions.

### `apps/api` (FastAPI)

```bash
cd project-link/apps/api
.venv/Scripts/Activate.ps1   # Windows
source .venv/bin/activate     # Unix
fastapi dev app/main.py       # http://127.0.0.1:8000 — docs at /docs
```

### Supabase (from `project-link/packages/supabase/`)

```bash
cd project-link/packages/supabase
pnpm exec supabase start                        # requires Docker
pnpm exec supabase migration new <name>
pnpm exec supabase db push
pnpm exec supabase link --project-ref <ref>
```

### shadcn/ui (from `project-link/apps/web/`)

```bash
npx shadcn@latest info --json          # confirm config + installed components
npx shadcn@latest search <term>
npx shadcn@latest docs <component>     # read before implementing
npx shadcn@latest add <component>
```
