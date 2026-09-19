# Frontend Project Rules

## Purpose

PitchMint frontend is a React SPA for startup idea validation. Provides: idea submission, AI-generated pitch decks, business canvas, competitor analysis, pitch simulation, market research, investor matching, credit-based billing with Razorpay checkout.

## General Rules

- **Understand before modifying**: Inspect relevant code in `src/features/*` and `src/shared/*` first.
- **Preserve existing architecture**: Feature-based structure (`src/features/*`). Don't flatten or restructure.
- **Reuse existing components**: Use `src/shared/*` UI components, hooks, and utilities.
- **Avoid unnecessary refactoring**: Keep changes scoped to the feature being modified. Don't rewrite working code.
- **Check dependencies**: Check `package.json` before installing new packages.
- **Protect secrets**: Never commit `.env` or hardcode API keys.
- **New env vars**: Must use `VITE_` prefix and be added to `.env.example`.
- **Documentation**: Update `docs/` when making significant architecture changes.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type-check | `npx tsc -b` |
| Tests | `npm test -- --run` |
| Watch tests | `npm run test:watch` |

## Verification Before Done

1. `npx tsc -b` passes with no type errors
2. `npm run build` produces clean output
3. `npm run lint` has no new errors
4. `npm test -- --run` passes; new behavior has tests
5. Dark mode renders correctly; design system is followed
6. No changes to files outside the task scope
