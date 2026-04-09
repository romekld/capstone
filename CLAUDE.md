# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Full project context, architecture, tech stack, UX guidelines, and compliance rules are in [`AGENTS.md`](./AGENTS.md). Read that first.

---

## Development Commands

### Monorepo (from root)

```bash
pnpm turbo dev      # run all apps in dev mode
pnpm turbo build    # build all apps
pnpm turbo lint     # lint all apps
pnpm test           # run unit tests across all apps
pnpm test:e2e       # run Playwright e2e tests (requires app running or CI)
```

### `apps/web` (Next.js)

```bash
cd apps/web
pnpm dev            # http://localhost:3000
pnpm build
pnpm lint
pnpm test           # vitest watch mode
pnpm test:run       # vitest single run
```

> **Warning:** Next.js 16.x has breaking changes. Before writing any Next.js code, read `apps/web/node_modules/next/dist/docs/` for current API and file conventions.

### `apps/api` (FastAPI)

```bash
cd apps/api
.venv/Scripts/Activate.ps1   # Windows
source .venv/bin/activate     # Unix
fastapi dev app/main.py       # http://127.0.0.1:8000 — docs at /docs
```

### Supabase (from root)

```bash
pnpm exec supabase start                        # requires Docker
pnpm exec supabase migration new <name>
pnpm exec supabase db push
pnpm exec supabase link --project-ref <ref>
```

### shadcn/ui (from `apps/web`)

```bash
npx shadcn@latest info --json          # confirm config + installed components
npx shadcn@latest search <term>
npx shadcn@latest docs <component>     # read before implementing
npx shadcn@latest add <component>
```
