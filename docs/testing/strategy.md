# PitchMint Testing Strategy

## Test Levels

### 1. Feature Unit & Integration Tests (`src/features/<feature>/__tests__/`)
- Co-located with the feature code.
- Test isolated feature components, custom hooks, and Redux slice reducers.
- Executed via `npm test` using Vitest + React Testing Library.

### 2. Shared Component Tests (`src/shared/components/**/__tests__/`)
- Tests for reusable layout, navigation, and UI primitives.
- Ensures core shared infrastructure remains stable.

### 3. End-to-End (E2E) Tests (`tests/e2e/`)
- High-level browser and workflow scenarios.
- Organized by critical user paths:
  - `tests/e2e/auth/`: Signin, signup, password reset journeys.
  - `tests/e2e/ideas/`: Idea submission and validation flow.
  - `tests/e2e/payments/`: Razorpay credit checkout and verification.
  - `tests/e2e/user-journeys/`: Full startup lifecycle journeys.
