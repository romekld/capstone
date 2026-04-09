# Project LINK Infrastructure Setup

## Purpose

This document provides the step-by-step infrastructure setup for the locked Project LINK repository structure:

```text
apps/
  web/
  api/
packages/
supabase/
docs/
```

It covers:

- monorepo root setup
- Next.js setup in `apps/web`
- shadcn/ui setup in `apps/web`
- FastAPI setup in `apps/api`
- Supabase CLI setup in `supabase/`
- environment variable setup

## Recommended Setup Order

1. Initialize the monorepo root
2. Scaffold `apps/web` with Next.js
3. Initialize `shadcn/ui` in `apps/web`
4. Scaffold `apps/api` with FastAPI
5. Initialize Supabase in the repo root
6. Add environment variables
7. Verify local development setup

## 1. Initialize the Monorepo Root

Recommended package manager: `pnpm`

From the project root:

```powershell
cd D:\project-link
pnpm init
pnpm add -D turbo
```

Create `pnpm-workspace.yaml` at the root:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Create `turbo.json` at the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint": { "dependsOn": ["^lint"] }
  }
}
```

Ensure the repo folders exist:

```powershell
New-Item -ItemType Directory -Force apps\web, apps\api, packages, supabase | Out-Null
```

## 2. Scaffold `apps/web` with Next.js

From the root:

```powershell
cd D:\project-link
pnpm create next-app@latest apps/web --yes
```

This uses the current Next.js defaults, which include:

- App Router
- TypeScript
- Tailwind CSS
- ESLint
- Turbopack
- import alias `@/*`

Recommended project choices for Project LINK:

- TypeScript: yes
- Tailwind: yes
- App Router: yes
- `src/` directory: yes
- import alias: `@/*`

Run the app locally:

```powershell
cd D:\project-link\apps\web
pnpm dev
```

Expected local URL:

- `http://localhost:3000`

## 3. Initialize `shadcn/ui` in `apps/web`

From inside `apps/web`:

```powershell
cd D:\project-link\apps\web
pnpm dlx shadcn@latest init --defaults
```

Then add the first batch of UI components:

```powershell
pnpm dlx shadcn@latest add button card input textarea form label select dialog sheet table tabs badge separator skeleton sonner
```

Recommended next components for Phase 1:

```powershell
pnpm dlx shadcn@latest add sidebar dropdown-menu command calendar checkbox radio-group switch
```

Suggested initial use:

- `sidebar` for role-based application navigation
- `card`, `table`, `badge`, `tabs` for dashboards
- `form`, `input`, `select`, `textarea`, `checkbox`, `radio-group`, `switch` for health forms
- `dialog` and `sheet` for review and detail views
- `skeleton` and `sonner` for loading and feedback states

## 4. Scaffold `apps/api` with FastAPI

From `apps/api`:

```powershell
cd D:\project-link\apps\api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install "fastapi[standard]"
```

Recommended minimal file structure:

```text
apps/api/
  app/
    __init__.py
    main.py
```

Minimal `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="Project LINK API")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

Run FastAPI in development mode:

```powershell
fastapi dev app/main.py
```

Run FastAPI in production-style mode:

```powershell
fastapi run app/main.py
```

Recommended Phase 1 scope for `apps/api`:

- minimal scaffold only
- health endpoint
- empty module placeholders for:
  - validation
  - reporting
  - gis
  - analytics

## 5. Initialize Supabase in the Repo Root

From the root:

```powershell
cd D:\project-link
pnpm add -D supabase
pnpm exec supabase init
```

This creates the root `supabase/` configuration structure.

### Option A: Greenfield Hosted Project

Create your Supabase project in the dashboard, then link it locally:

```powershell
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
```

Create your first migration when ready:

```powershell
pnpm exec supabase migration new init_schema
```

### Option B: Existing Hosted Project

If the hosted project already exists and you want to capture its current schema:

```powershell
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
pnpm exec supabase db pull baseline
```

### Optional: Local Supabase Stack

If Docker is installed and running:

```powershell
pnpm exec supabase start
```

Notes:

- `supabase init` creates local project configuration
- `supabase link` connects the repo to a hosted Supabase project
- `supabase migration new <name>` creates migration files in `supabase/migrations`
- `supabase db pull <name>` pulls a hosted schema into a migration file

## 6. Add Environment Variables

### `apps/web/.env.local`

```ini
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### `apps/api/.env`

```ini
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Important rules:

- `NEXT_PUBLIC_SUPABASE_URL` is safe in the frontend
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe in the frontend when RLS is enforced
- never expose `SUPABASE_SERVICE_ROLE_KEY` in `apps/web`
- plan for Row Level Security from the beginning

## 7. Verify the Local Setup

### Verify `apps/web`

```powershell
cd D:\project-link\apps\web
pnpm dev
```

Expected:

- Next.js app runs at `http://localhost:3000`

### Verify `apps/api`

```powershell
cd D:\project-link\apps\api
.venv\Scripts\Activate.ps1
fastapi dev app/main.py
```

Expected:

- FastAPI app runs at `http://127.0.0.1:8000`
- docs available at `http://127.0.0.1:8000/docs`

### Verify Supabase CLI Link

```powershell
cd D:\project-link
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
```

Expected:

- local repo links successfully to the hosted Supabase project

## 8. Recommended Immediate Next Step

After setup is complete, move into Phase 1 work:

1. scaffold the route structure in `apps/web`
2. build the shared app shell and navigation
3. add role switching or mocked auth for UI development
4. create the page inventory for each user role
5. keep `apps/api` and `supabase/` minimal until frontend structure stabilizes

## References

- Next.js docs: https://nextjs.org/docs/app/getting-started/installation
- FastAPI docs: https://fastapi.tiangolo.com/
- Supabase CLI docs: https://supabase.com/docs/reference/cli/introduction
- shadcn/ui docs: https://ui.shadcn.com/docs/installation/next

