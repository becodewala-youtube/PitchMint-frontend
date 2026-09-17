# PitchMint Frontend Architecture Overview

## Philosophy: Feature-First Architecture

PitchMint uses a **Feature-First Architecture** designed for maintainability, high cohesion, and loose coupling.

```
src/
├── app/          # Core application lifecycle, providers, shell, and routing
├── config/       # Environment and application constants
├── features/     # Business capabilities grouped by domain
├── shared/       # Reusable UI primitives, layout wrappers, utilities, and hooks
├── styles/       # Global CSS and Tailwind stylesheets
└── assets/       # Static media, icons, and fonts
```

### Layer Responsibilities

1. **`app/`**:
   - `App.tsx`: Top-level application shell.
   - `main.tsx`: React DOM root mounting.
   - `providers/`: Context and store providers.
   - `router/`: React Router tree and route definitions.

2. **`features/<feature>/`**:
   - Each feature encapsulates its own domain:
     - `pages/`: Page-level route views.
     - `components/`: Domain-specific components (e.g., modals, skeletons, widgets).
     - `hooks/`: Feature-specific logic.
     - `store/`: Feature Redux Toolkit slices.
     - `types/`: Feature data models and contracts.
     - `__tests__/`: Feature unit and integration test suites.

3. **`shared/`**:
   - `components/ui/`: Base visual primitives.
   - `components/layout/`: Global layout components (`Navbar`, `Footer`, `PageLayout`).
   - `components/feedback/`: Shared feedback elements (`DeleteConfirmationModal`).
   - `components/auth/`: Route authorization wrappers (`ProtectedRoute`, `PublicRoute`).
   - `lib/`: Third-party wrapper instances (e.g., `api.ts` Axios instance).
   - `utils/`: Universal helper functions (e.g., `pdfExport.ts`).
   - `types/`: Global type declarations.
