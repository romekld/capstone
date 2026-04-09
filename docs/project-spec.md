# Project LINK Project Spec

## Document Status

- Status: Locked baseline
- Last updated: 2026-04-09
- Scope of this document: product contract and phase planning baseline
- Companion document: `docs/architecture.md`

## 1. Product Summary

Project LINK (Local Information Network for Kalusugan) is a web-based health station management platform for CHO II and its 32 barangay health stations. It is designed to replace fragmented paper workflows with a connected digital system for patient records, public health program tracking, reporting, surveillance, and future analytics.

The product is a:

- pure web application
- PWA-enabled experience
- offline-capable field workflow system

## 2. Product Vision

Project LINK should become the shared operational platform for:

- field data capture at the barangay level
- review and validation at the BHS level
- consolidation and reporting at the CHO level
- future GIS intelligence and predictive support

The long-term goal is a production-grade platform, not a throwaway prototype.

## 3. Current Planning Principle

The project must distinguish between:

- target architecture: the full intended production system
- Phase 1 implementation: frontend-first delivery with future-ready boundaries

This is important because the first phase does not build the entire system. It builds the user-facing foundation that later phases will connect to real data, backend services, and reporting logic.

## 4. Primary Users

| Role | Code | Primary Surface | Core Responsibility |
|---|---|---|---|
| System Admin | `system_admin` | Web | Platform administration, access management, policy controls |
| City Health Officer | `cho` | Web | Oversight, city-wide monitoring, sign-off visibility |
| PHIS Coordinator | `phis` | Web | Data quality review, auditing, report export oversight |
| Public Health Nurse | `rhm` | Web | Consolidation review and city-level operational workflows |
| Rural Health Midwife | `phn` | Web + mobile web | BHS-level record stewardship and validation workflows |
| Barangay Health Worker | `bhw` | Mobile-first web | Field capture, follow-up logging, community-level workflows |

## 5. Confirmed Decisions

These are locked for this version of the project spec.

### Product and Delivery

- The product is a pure web application
- The web application includes PWA features
- Offline capability is part of the intended product design
- The project should follow the cleanest production path, not the fastest short-term shortcut
- Phase 1 is frontend-first
- Phase 1 should be future-ready for backend and database wiring

### Architecture Direction

- The system uses a hybrid architecture with Next.js, FastAPI, and Supabase
- Next.js can use its full-stack capabilities for basic CRUD and frontend-adjacent routes
- FastAPI is reserved for heavier domain logic such as health data validation, reporting pipelines, and future ML/analytics
- Supabase remains the primary managed data and auth platform
- GIS is a planned subsystem and will be elaborated in a future focused session

### Repository Structure

The project structure is finalized as:

```text
apps/
  web/
  api/
packages/
supabase/
docs/
```

## 6. Tentative Decisions

These are the current recommended defaults, but they may be refined in later sessions.

- Supabase Realtime is the first-choice realtime approach
- Celery and Redis are deferred until clearly needed
- Forecasting is not a Phase 1 dependency
- Shared packages under `packages/*` will be introduced only when there is a clear reuse need
- GIS internals are deferred, but GIS integration boundaries should still appear in architecture docs

## 7. Deferred Decisions

These are intentionally postponed.

- exact direct-write boundary between Next.js and Supabase
- exact cases where writes must go through FastAPI instead of Next.js routes
- detailed validation-gate data model
- GIS internal architecture
- exact report engine implementation details
- final analytics and forecasting strategy
- production auth rollout timing versus mock role access during Phase 1

## 8. Finalized Technical Direction

### Frontend

| Area | Final Direction | Notes |
|---|---|---|
| Main app | Next.js App Router in `apps/web` | Main product surface |
| UX model | Desktop admin + mobile-first field workflows | Single web platform |
| UI stack | React, TypeScript, Tailwind, shadcn/ui | Role-specific interfaces |
| PWA | Required | Installability and improved field usage |
| Offline | Required at the product level | Phase 1 scaffolds this, not full sync conflict handling |

### Backend and Platform

| Area | Final Direction | Notes |
|---|---|---|
| Domain backend | FastAPI in `apps/api` | Heavy business logic, validations, reporting, analytics |
| Data platform | Supabase | Postgres, Auth, RLS, Storage, migrations |
| Shared packages | `packages/*` | Optional and introduced as needed |

## 9. Product Scope

### Full Product Scope

- unified patient registry
- longitudinal ITR records
- TCL-driven program capture
- BHS validation workflows
- ST generation
- MCT consolidation
- M1 and M2 reporting
- disease alerting
- GIS views
- future risk scoring and forecasting

### Phase 1 Scope

Phase 1 is not the full MVP in backend terms. It is the frontend foundation phase.

Phase 1 includes:

- all key user-role interfaces
- role-aware dashboards and workflow shells
- clickable end-to-end UI flows per role
- real form state and client-side validation
- mocked or placeholder data sources where backend wiring is not yet built
- frontend architecture that is ready for future Supabase and FastAPI integration
- offline architecture scaffolding in the web app
- clear placeholders for future GIS, reporting, and approval workflows

Phase 1 does not require:

- full production auth
- full backend implementation
- final reporting engine
- full offline sync conflict handling
- final GIS implementation
- final analytics or ML implementation

## 10. Recommended Phase 1 Definition

### Phase 1 Title

Frontend Foundation and Role Workflow Visualization

### Phase 1 Goal

Deliver a production-oriented frontend foundation in `apps/web` that visualizes and validates the end-to-end experience for all major user roles while preserving clean integration paths to Supabase and FastAPI for later phases.

### Phase 1 Success Criteria

- Each user role has a coherent dashboard or workflow entry point
- Major flows are navigable and demonstrable in the browser
- Core forms use real local state and validation
- Shared layout, navigation, and UI conventions are established
- The codebase is structured for later backend and database wiring without major rewrites
- PWA and offline-related architecture are represented in the app structure
- Backend-heavy features are represented through stubs, placeholders, or mock data contracts rather than premature implementation

### Phase 1 Key Deliverables

- application shell
- route map for all primary roles
- dashboard screens for `system_admin`, `cho`, `phis`, `rhm`, `phn`, and `bhw`
- patient registry UI
- core clinical and program form flows
- approval and validation UI placeholders
- reporting and GIS placeholders with planned integration points
- reusable UI primitives and page patterns

### Phase 1 Technical Boundaries

- `apps/web` is the active implementation focus
- `apps/api` may exist as scaffold or placeholder, but is not the main build focus yet
- `supabase/` may be initialized for future migrations and config, but full schema work is not required in this phase
- `packages/*` should remain minimal unless reuse clearly justifies it

## 11. Non-Functional Requirements

- maintainable architecture over short-term convenience
- strong separation between UI concerns and domain logic
- mobile-first usability for field workers
- desktop-grade usability for administrative users
- clear route to backend integration without frontend rewrites
- compliance-sensitive design for future health data handling

## 12. Architecture Rules

- `apps/web` owns UI, navigation, local interaction logic, and future frontend-adjacent CRUD routes
- `apps/api` owns heavy domain logic, validation, reporting, and future analytics
- `supabase/` owns schema, migration, auth, and policy configuration
- Phase 1 must not overbuild backend concerns
- Phase 1 should visualize future workflows honestly rather than pretending unfinished backend logic already exists

## 13. Immediate Next Build Step

The next implementation milestone after locking this spec is:

- scaffold the monorepo around `apps/web`, `apps/api`, `packages/*`, and `supabase/`
- establish the design system and route structure in `apps/web`
- begin Phase 1 user-role interface implementation

