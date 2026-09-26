# Agent Workflow Rules

This document defines the standard PitchMint **frontend** agent workflow for all current and future development.

---

## Standard Workflow

1. **Inspect current state**: Review the task requirements, open issues, existing tests, and error logs before writing a single line of code.
2. **Check git status**: Always run `git status` to confirm the active branch and detect any uncommitted changes.
3. **Create a dedicated branch BEFORE implementation**: Never implement directly on `main` or `develop`. Branch off the up-to-date base branch.
4. **Understand existing architecture**: Read `src/features/<feature>/`, `src/shared/`, and `src/app/` before touching any file. Do not guess structure — inspect it.
5. **Read existing rules**: Review `.agents/rules/architecture.md`, `.agents/rules/coding.md`, and `.agents/rules/design-system.md` before implementing a feature.
6. **Make the smallest safe change**: Keep edits tightly scoped to the task. Avoid unrelated refactors, component restructuring, or design-system changes in the same branch.
7. **Run targeted tests**: Run focused tests for the modified feature during active development:
   ```bash
   npx vitest run src/features/<feature>/
   ```
8. **Run full verification**: Execute the full pipeline — type-check, lint, build, and test suite — before pushing.
9. **Review git diff**: Inspect `git diff` and `git diff --stat` to confirm only intended files were changed.
10. **Clean temporary files**: Remove scratch scripts, debug `console.log` statements, unused imports, and any test-only data files.
11. **Review changed/deleted/added files**: Use `git status` and `git diff --name-status` for a final scan.
12. **Verify secrets and .gitignore**: Ensure `.env`, `VITE_*` secrets, and `coverage/` are never committed. Check `.gitignore` is correct.
13. **Prepare commit**: Follow conventional commit standards (see below).
14. **Push branch**: Push only the dedicated branch. Never force-push shared branches.
15. **Prepare PR title**: Short, specific, conventional format.
16. **Prepare PR description**: Explain what changed, why, how it was tested, coverage achieved, and known limitations.
17. **Wait for human approval**: Await review before merging unless explicitly instructed otherwise.

---

## Branch Naming Conventions

Use descriptive prefixes for all branches:

- `feature/<name>` — New user-facing page, component, or capability
- `fix/<name>` — Bug fix (UI, logic, state, or routing)
- `refactor/<name>` — Code restructuring with no behavioral change
- `test/<name>` — Test suite improvements, coverage, or test infrastructure
- `chore/<name>` — Dependency updates, config, or tooling
- `style/<name>` — Visual/CSS-only changes with no logic impact
- `docs/<name>` — Documentation and rule updates

Examples:
- `feature/investor-matchmaking-v2`
- `fix/canvas-infinite-loop`
- `test/frontend-unit-tests`
- `chore/upgrade-vite-6`

---

## Commit Message Format

Use clear conventional-style commits scoped to the feature or layer:

- `feat(<scope>):` — New user-facing feature
- `fix(<scope>):` — Bug fix
- `refactor(<scope>):` — Code restructuring
- `test(<scope>):` — Adding or updating tests
- `chore(<scope>):` — Build system, dependency, or config updates
- `style(<scope>):` — CSS/Tailwind-only visual changes
- `docs(<scope>):` — Documentation updates

Valid scopes: `auth`, `canvas`, `competitors`, `credits`, `dashboard`, `ideas`, `investors`, `landing`, `legal`, `market-research`, `pitch-deck`, `pitch-simulator`, `shared`, `router`, `store`, `ci`

Examples:
- `feat(market-research): add TAM/SAM/SOM visualisation cards`
- `fix(canvas): prevent infinite useEffect loop on missing canvasContent`
- `test(frontend): add comprehensive unit test suite — 244 tests across 58 files`
- `chore(deps): upgrade Vitest to 4.x and React Testing Library to 16.x`

---

## Testing Standards

### Test File Location
Co-locate tests with source files under `__tests__/`:
```
src/features/<feature>/
  ├── pages/
  ├── components/
  └── __tests__/
        └── MyComponent.test.tsx
```

### Test Stack
- **Runner**: Vitest (globals enabled)
- **Renderer**: React Testing Library (`@testing-library/react`)
- **Matchers**: `@testing-library/jest-dom`
- **Environment**: jsdom
- **Utilities**: `tests/setup/test-utils.tsx` — always use `renderWithProviders` for components that access the Redux store

### Core Rules
- **Mock network boundaries only**: `vi.mock('@/shared/lib/api')` — never mock internal Redux reducers or the store itself.
- **Mock thunks as no-op functions**: When spying on `createAsyncThunk` actions used in `useEffect`, always return a thunk function (not a plain object) to prevent infinite re-render loops:
  ```ts
  const makeNoopThunk = () => (_dispatch: unknown) => Promise.resolve({ type: 'noop' });
  vi.spyOn(mySlice, 'myThunk').mockReturnValue(makeNoopThunk() as any);
  ```
- **Mock heavy lazy-loaded pages** in router-level tests to avoid `Suspense` timeout:
  ```ts
  vi.mock('@/features/landing/pages/Landing', () => ({
    default: () => <div data-testid="landing-page">Landing Page</div>,
  }));
  ```
- **Test what the user sees**, not implementation details. Prefer `getByRole`, `getByText`, `getByLabelText` over `getByTestId`.
- **Cover error paths**: Test 402 (Insufficient Credits) and 500 (Server Error) for every API-integrated component.
- **Do not test skeleton components** with no props or logic — they are covered implicitly by parent component tests.

### Running Tests
```bash
# Run focused (single feature)
npx vitest run src/features/<feature>/

# Run full suite
npx vitest run

# Run with coverage
npx vitest run --coverage
```

---

## Pull Request Guidelines

### PR Title Rule
Short, specific, conventional. Format: `<type>(<scope>): <imperative summary>`

Examples:
- `test(frontend): add comprehensive unit test suite — 244 tests, 58 files`
- `feat(pitch-simulator): add real-time feedback scoring UI`
- `fix(canvas): prevent Suspense infinite loop on thunk dispatch`

### PR Description Rule
The PR description must explain:
- **What** changed (files, components, logic)
- **Why** it changed (bug, feature request, tech debt)
- **How** it was tested (test commands run, coverage achieved)
- **Test results** (pass/fail counts)
- **Known limitations** or follow-up tasks
- **Screenshots** for any UI changes

Do NOT use marketing language. Be factual and concise.

---

## Pre-Push Verification Checklist

Before any push, execute and verify **all** of the following:

1. `git status` — confirm clean working tree on the dedicated branch
2. `git diff --stat` — review modified line counts
3. `git diff --name-status` — inspect all added/modified/deleted files
4. Inspect all changed files for unintended edits or leftover debug code
5. Check for secrets: `VITE_*` env vars, API keys, tokens must never be committed
6. Verify `.gitignore` covers: `coverage/`, `.env`, `*.local`, `dist/`, `node_modules/`
7. `npx tsc -b` — TypeScript type-check (zero errors required)
8. `npm run lint` — ESLint (zero errors required)
9. `npx vitest run` — full unit test suite (all tests must pass)
10. `npm run build` — production bundle must build without errors
11. `npm audit --audit-level=high` — no unresolved high or critical vulnerabilities
12. Verify no bare `console.log` statements in production source files
13. Verify `coverage/` directory is not staged for commit
14. Confirm no `.env` or secret files are staged

**Never claim "push ready" unless all relevant checks actually passed.**

---

## Critical Constraints (Frontend-Specific)

- **Never introduce new styling paradigms**: All styling uses Tailwind CSS 3 + the existing design system (`design-system.md`). Do not add inline styles, CSS Modules, or styled-components.
- **Never create separate Axios instances**: All HTTP calls go through `src/shared/lib/api.ts`. The interceptor handles JWT attachment and 401 auto-logout.
- **Never store user objects in localStorage**: Only the JWT token is stored (`localStorage.getItem('token')`).
- **Never hardcode API base URLs**: Use `import.meta.env.VITE_API_URL` via `src/config/constants.ts`.
- **Never define routes as inline strings**: All route paths are defined in `src/app/router/routes.config.ts`.
- **Never add feature-specific code to `src/shared/`**: Shared components must be truly reusable across features.
- **Never skip `renderWithProviders`**: Any component that accesses Redux state must be rendered with `renderWithProviders` from `tests/setup/test-utils.tsx`.
