# Frontend Coding Conventions

- **TypeScript**: Strict mode enabled. Use proper types; avoid `any`.
- **Module system**: ESM (`"type": "module"` in package.json). Standard `import`/`export`.
- **Naming**:
  - Functions/variables: `camelCase`
  - React components: `PascalCase` (files: `PascalCase.tsx`)
  - Utilities/hooks: `kebab-case.ts` or `camelCase.ts`
- **Components**: Functional components with React hooks. No class components.
- **State management**: Redux Toolkit for global state (per-feature slices + async thunks). React hooks for local state.
- **Styling**: Tailwind CSS 3 (dark mode via `class` strategy). Custom utilities in `src/styles/index.css`. See `design-system.md` for visual conventions.
- **Animations**: Framer Motion for page transitions and entrance effects.
- **Async patterns**: `async`/`await` for API calls via the shared Axios client (`src/shared/lib/api.ts`).
- **Logging**: Guard `console.error` with `if (import.meta.env.DEV)` for dev-only logging. Never use bare `console.log` in production code.
- **Error handling**: Use the global `getErrorMessage(error, fallbackMessage)` helper for extracting error messages in thunks and catch blocks. Cast Axios errors as `ApiError` when accessing `.response`.
- **Auth tokens**: Store only the JWT token in `localStorage` (key: `'token'`). Never store user objects in localStorage.
- **Testing**: Vitest (globals enabled, jsdom environment). Uses `@testing-library/react` and `@testing-library/jest-dom`. Setup in `tests/setup/setup.ts`.
- **Comments**: Document complex UI state logic and non-obvious component interactions. Preserve existing comments.

