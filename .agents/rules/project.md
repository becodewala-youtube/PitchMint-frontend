# Frontend Project Rules

- **Understand before modifying**: Inspect relevant code, specifically `src/features/*` first.
- **Preserve existing architecture**: Feature-based architecture (`src/features/*`).
- **Reuse existing components**: Use `src/shared/*` UI components and utilities.
- **Avoid unnecessary refactoring**: Keep changes scoped to the feature being modified.
- **Check dependencies**: Check `package.json` before installing new packages.
- **Verify changes**: Run `npm run lint` and `npm run test` after modifications.
- **Documentation**: Update `docs/architecture` when significant changes occur.
