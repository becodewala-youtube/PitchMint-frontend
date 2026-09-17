# ADR 001: Adoption of Feature-First Frontend Architecture

## Status
Accepted

## Context
The legacy frontend was organized into flat `pages/` (32 individual files) and general `components/` folders with deep relative import chains (`../../store`, `../../components/layout/Navbar`). This caused:
- Difficult codebase navigation
- Increased likelihood of merge conflicts
- Inability to quickly locate feature-specific state and UI

## Decision
Migrate to a Feature-First modular architecture:
1. Divide codebase into cohesive business features (`auth`, `ideas`, `pitch-deck`, `pitch-simulator`, `competitors`, `investors`, `canvas`, `credits`, `market-research`, `dashboard`, `landing`, `legal`).
2. Implement `@/` path alias for clear, robust import paths across Vite and TypeScript.
3. Centralize app-level boot, providers, and routing in `src/app/`.
4. Relocate generic layout and primitives into `src/shared/`.

## Consequences
- Clean separation of business logic and domain UI.
- Fast onboarding and simplified code reviews.
- Clean isolation of unit and feature tests.
