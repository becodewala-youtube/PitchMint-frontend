# E2E Architecture & Deployment Gating

## Overview
PitchMint consists of two independent repositories (`PitchMint-frontend` and `PitchMint-Backend`). E2E testing validates the critical user journeys across both systems.

## E2E Ownership
E2E tests are owned by and reside in the **PitchMint-frontend** repository under the `e2e/` directory. They are built using **Playwright**.

## Architecture
Browser -> PitchMint frontend -> PitchMint backend -> Dedicated E2E database -> External service boundaries (mocked/controlled).

## Database Isolation
A dedicated MongoDB database (`pitchmint-e2e-test` in CI) is used. It is completely isolated from production and developer environments.

## CI/CD Gating
Both repositories enforce a strict deployment gate:
1. **PR CI**: Code is validated against unit and integration tests (does not deploy).
2. **Master CI**: Code merged to master triggers the `CI` workflow.
3. **Master E2E**: Upon successful completion of `CI`, the `E2E` workflow runs.
   - For the frontend, it checks out the frontend's triggering commit and the backend's latest master.
   - For the backend, it checks out the backend's triggering commit and the frontend's latest master.
4. **Master CD (Deployment)**: Upon successful completion of `E2E`, the `CD` workflow deploys exactly the commit that triggered the pipeline to Vercel.

If CI fails, E2E does not run and deployment does not happen. If E2E fails, deployment does not happen.

## Running Locally
To run E2E locally:
1. Ensure your backend is running locally (`npm run dev` in `PitchMint-Backend`).
2. In `PitchMint-frontend`, run:
   ```bash
   npm run test:e2e
   ```
   This will use Playwright's `webServer` feature to start the frontend dev server, connect to your local backend, and execute the tests.
