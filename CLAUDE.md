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

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
