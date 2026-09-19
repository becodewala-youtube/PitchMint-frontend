# Frontend Architecture Rules

## Feature Structure (`src/features/`)

Each domain is a self-contained feature. Current features: `auth`, `ideas`, `credits`, `dashboard`, `pitch-deck`, `canvas`, `competitors`, `pitch-simulator`, `market-research`, `investors`, `landing`, `legal`.

```
src/features/<feature>/
  ├── pages/          # Route-level page components
  ├── components/     # Feature-specific UI components
  ├── store/          # Redux slice (thunks + reducers)
  ├── hooks/          # Feature-specific hooks (optional)
  ├── types/          # TypeScript interfaces (optional)
  └── __tests__/      # Co-located tests (optional)
```

## Shared Layer (`src/shared/`)

- `components/` — Reusable UI: `layout/` (PageLayout), `ui/` (buttons, modals), `feedback/` (toasts, errors)
- `hooks/` — Shared custom hooks
- `lib/api.ts` — Centralized Axios instance with JWT auth interceptor and 401 → auto-logout
- `types/` — Shared TypeScript types
- `utils/` — Utility functions

Do not place feature-specific code in shared.

## App Shell (`src/app/`)

- `App.tsx` — Root component (dark mode init, auth hydration on mount)
- `store/` — Redux store configuration (`index.ts`) and typed hooks (`hooks.ts`)
- `router/` — Route definitions (`routes.config.ts`), `AppRouter.tsx`, guards (`ProtectedRoute`, `PublicRoute`, `PremiumRoute`)
- `providers/` — Context providers

## Config (`src/config/`)

- `constants.ts` — `API_URL` (from `VITE_API_URL`) and app config

## Path Alias

`@/` maps to `src/` — configured in `vite.config.ts`, `tsconfig.app.json`, and `vitest.config.ts`.

## Dependency Direction

- Features can use `src/shared/`, but must not circularly depend on each other.
- Redux slices are scoped to their feature in `src/features/<feature>/store/`.
- Register new slices in `src/app/store/index.ts`.

## Critical Constraints

- **API calls**: Always go through `src/shared/lib/api.ts`. Never create separate Axios instances. The interceptor auto-attaches JWT and handles 401 logout.
- **Route config**: All routes are defined in `src/app/router/routes.config.ts`. Use route constants, not inline strings.
- **State management**: Redux Toolkit for global state (per-feature slices). React hooks for local component state.
- **Don't introduce new styling paradigms**: Use Tailwind CSS + the existing design system (see `design-system.md`).
