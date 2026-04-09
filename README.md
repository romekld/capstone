# Project LINK

**Local Information Network for Kalusugan** — an integrated health station management system for City Health Office II (CHO II), Dasmariñas City.

Project LINK digitizes paper-based health records across 32 Barangay Health Stations (BHS) and consolidates them into a city-wide analytics and reporting platform — replacing a fully manual, error-prone system that serves 164,691 people.

---

## The Problem

All 32 health stations operate entirely on paper. Existing computers are used only as printers. This means:

- A single encoder manually processes 192+ reports per month — one point of failure for the entire city's FHSIS compliance
- Outbreaks are discovered 30 days late, making RA 11332 (24-hour disease reporting) structurally impossible
- BHWs track visits on personal phone notes and transcribe them to paper — undetectable data loss
- Patient history is siloed to each station; no city-wide search or continuity of care

## The Solution

Project LINK introduces a **Zero-Tally architecture**: `TCL → ST → MCT` is fully automated. What takes 5 days of manual tallying now takes seconds. Key innovations:

| Domain | Before | After |
| --- | --- | --- |
| Reporting | 5 days of manual tallying per month | Instant automated ST/MCT generation |
| Patient identity | 32 separate paper files across 32 stations | One unified ITR accessible city-wide |
| Disease response | Outbreaks found 30 days later | Real-time WebSocket alerts for Category I cases |
| Planning | Decisions based on gut feel or stale data | GIS mapping and ML-based outbreak forecasting |

---

## Architecture

### Two-Tier Data Model

**BHS Tier** — 32 barangay health stations. BHWs capture visits offline; Midwives validate and manage TCL records; Midwives generate end-of-month Summary Tables (ST).

**CHO Tier** — city-wide. Public Health Nurses consolidate 32 STs into a Monthly Consolidation Table (MCT); PHIS Coordinator runs DQC and exports M1/M2 reports; CHO monitors real-time disease alerts.

### Offline-First PWA

BHWs work in remote puroks without connectivity. The PWA uses **Dexie.js** (IndexedDB) for local storage. A Workbox service worker background-sync job flushes `PENDING_SYNC` records when connectivity returns. The sync endpoint is idempotent (upsert by client-generated ID).

### Service Boundaries

| App | Responsibility |
| --- | --- |
| `apps/web` | Next.js App Router — internal dashboard, role-facing UI, forms, PWA behavior |
| `apps/api` | FastAPI — health-domain validation, reporting (PDF/XLSX), analytics, future ML |
| `supabase/` | Postgres, Auth, RLS, Storage, future Realtime |
| `packages/` | Shared code only when reuse across apps is justified |

---

## User Roles

| Role | Code | Primary Surface | Scope |
| --- | --- | --- | --- |
| System Admin | `system_admin` | Web only | System-wide |
| City Health Officer | `cho` | Web + Mobile | All 32 BHS — read-only |
| PHIS Coordinator | `phis` | Web only | All 32 BHS — DQC and exports |
| Public Health Nurse | `rhm` | Web only | All 32 BHS — MCT consolidation |
| Rural Health Midwife | `phn` | Web + Mobile | Own BHS — ITR/TCL stewardship |
| Barangay Health Worker | `bhw` | Mobile-first | Assigned purok — field data capture |

---

## Tech Stack

### Frontend (`apps/web`)

| Area | Tool |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI components | shadcn/ui (`style: radix-nova`, base: `mist`, icons: `lucide`) |
| Styling | Tailwind v4 CSS-first (no `tailwind.config.js`; tokens in `app/globals.css`) |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query (React Query) |
| Offline store | Dexie.js (IndexedDB) |
| Service worker | Workbox |
| Maps | MapLibre GL JS |
| Localization | next-intl (English/Filipino toggle — BHW/PWA surfaces only in Phase 1) |

### Backend (`apps/api`)

| Area | Tool |
| --- | --- |
| Framework | FastAPI (Python) |
| Validation | Pydantic |
| PDF export | reportlab |
| Excel export | openpyxl |

### Data Platform

| Area | Tool |
| --- | --- |
| Database | Supabase (Postgres + PostGIS) |
| Auth | Supabase Auth + `@supabase/ssr` — admin invite-only, no self-registration |
| Realtime | Supabase Realtime — WebSocket disease alerts |
| RLS | Supabase RLS — enforced at DB layer, never rely on API-layer checks alone |

### Deployment

| Service | Platform |
| --- | --- |
| `apps/web` | Vercel |
| `apps/api` | Digital Ocean App Platform |
| Database / Auth | Supabase hosted |

### Testing

| Area | Tool |
| --- | --- |
| Unit / integration | Vitest |
| End-to-end | Playwright (includes mobile viewport for BHW PWA) |
| CI | GitHub Actions — lint + unit tests on push; e2e on PRs to `main` |

---

## Monorepo Structure

The monorepo lives inside `project-link/` at the repo root.

```
project-link/
  apps/
    web/          Next.js 16 App Router — internal dashboard + BHW PWA
    api/          FastAPI — health-domain logic, reporting, analytics
  packages/
    supabase/     Supabase CLI config and migrations
    eslint-config/
    typescript-config/
  turbo.json
  pnpm-workspace.yaml
  package.json
docs/
  project_spec.md           Locked product + technical spec
  brainstorm.md             Original problem analysis
  architecture.md           System design and data flow
  PLANS/                    Implementation plans and milestone tracking
  references/research/      FHSIS Manual of Operations (DOH DM 2024-0007)
  diagrams/                 Process flowcharts
  gis/                      Barangay boundary GeoJSON data
```

---

## Development

### Prerequisites

- Node.js 20+
- pnpm
- Python 3.11+
- Docker (for local Supabase)

### Setup

```bash
# Install dependencies (from project-link/)
cd project-link
pnpm install

# Run all apps in dev mode
pnpm turbo dev
```

### `apps/web` (Next.js — http://localhost:3000)

```bash
cd project-link/apps/web
pnpm dev
pnpm build
pnpm lint
```

### `apps/api` (FastAPI — http://127.0.0.1:8000)

```bash
cd project-link/apps/api
source .venv/bin/activate          # Unix
# .venv/Scripts/Activate.ps1       # Windows
fastapi dev app/main.py
```

API docs available at `/docs`.

### Supabase (from `project-link/packages/supabase/`)

```bash
pnpm exec supabase start                        # requires Docker
pnpm exec supabase migration new <name>
pnpm exec supabase db push
pnpm exec supabase link --project-ref <ref>
```

### shadcn/ui (from `project-link/apps/web/`)

```bash
npx shadcn@latest info --json          # confirm config + installed components
npx shadcn@latest search <term>
npx shadcn@latest docs <component>
npx shadcn@latest add <component>
```

---

## System Modules

| Module | Purpose |
| --- | --- |
| EHR & ITR Manager | Unified patient identity — replaces paper filing cabinets across 32 BHS |
| Digital FHSIS Pipeline | Automated TCL → ST → MCT with one-click DOH-compliant M1/M2 exports |
| PIDSR & Alert System | WebSocket real-time alerts to DSO for Category I cases (RA 11332 compliance) |
| GIS Mapping | PostGIS heatmaps and cluster detection for disease hotspots across Dasmariñas |
| Predictive Analytics | Prophet-based outbreak forecasting; scikit-learn risk stratification |
| Inventory Lite | BHS-level vaccine and medicine stock tracking with low-stock alerts |

---

## Compliance

| Standard | Requirement |
| --- | --- |
| RA 10173 (Data Privacy Act) | No hard deletes on clinical tables; no PII in logs; `audit_logs` is append-only |
| RA 11332 | Category I disease case triggers `disease_alerts` insert + WebSocket broadcast **before** API returns 201 |
| DOH DM 2024-0007 | FHSIS 2024 indicator codes, field names, and M1/M2 formulas must match exactly |
| PhilPEN Protocol | NCD risk stratification (HTN/DM) — low/medium/high classification |
| WHO Z-score Standards | WAZ/HAZ/WHZ classification for nutrition module |
| RFC 7946 | GeoJSON format for all spatial API responses |
| RLS | Data isolation enforced at the DB layer for all BHS-scoped data |

---

## Implementation Phases

### Phase 1 — Frontend Foundation (Current)

- Internal dashboard route structure in `apps/web`
- Role-based workflow shells for all 6 user roles
- Client-side forms with local state and Zod validation
- PWA/offline-aware frontend scaffolding
- Mock data isolated for clean replacement in later phases

### Future Phases

- Full Supabase schema, RLS policies, and auth rollout
- FastAPI domain validation and reporting engine
- GIS implementation with PostGIS heatmaps
- ML/forecasting with Prophet and scikit-learn
- Realtime WebSocket disease alert system

---

## Documentation

- [`AGENTS.md`](./AGENTS.md) — architecture, tech stack, UX guidelines, and compliance rules for all agents
- [`project-link/docs/project_spec.md`](./project-link/docs/project_spec.md) — locked product requirements and phased roadmap
- [`project-link/docs/brainstorm.md`](./project-link/docs/brainstorm.md) — original problem analysis and working context
- [`project-link/docs/architecture.md`](./project-link/docs/architecture.md) — system design and data flow decisions
- [`project-link/docs/PLANS/project-status.md`](./project-link/docs/PLANS/project-status.md) — current phase progress

---

*Capstone project — City Health Office II, Dasmariñas City*
