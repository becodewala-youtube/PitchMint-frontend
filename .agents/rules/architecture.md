# Frontend Architecture Rules

- **Feature-Based Boundaries**: Code is split by feature in `src/features/` (auth, pitch-deck, ideas, etc.).
- **Dependency Direction**: Features can use `src/shared/`, but should not circularly depend on each other.
- **Module Responsibilities**: 
  - `pages`: Top-level route components.
  - `components`: Reusable UI pieces within a feature.
  - `api`: API slice/client specific to the feature.
- **State Management**: Redux slices should be scoped to their respective features.
- **API Boundaries**: Axios API clients handle communication.
- **Shared Code**: `src/shared/` contains reusable UI components, hooks, and utilities. Do not place feature-specific code in shared.
