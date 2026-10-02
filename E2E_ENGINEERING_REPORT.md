# PitchMint E2E Engineering Report

## Repositories
- PitchMint-frontend
- PitchMint-Backend

Repository independence was strictly preserved. We avoided creating a monorepo or a single root `.agent` configuration. Each repository retains its own CI/CD workflow files, `package.json`, and context. The cross-repository E2E integration is handled entirely via GitHub Actions cloning the complementary repository during testing, maintaining complete structural isolation.

## Branch
`test/e2e`

## E2E Framework
- Framework: **Playwright**
- Version: `@playwright/test ^1.4x`
- Why it was selected: The repository did not have any existing E2E framework (like Cypress) configured. Playwright provides the fastest, most reliable cross-browser E2E engine that integrates perfectly with CI environments and properly exercises the integrated application stack.

## E2E Architecture
Browser -> PitchMint frontend -> PitchMint backend -> E2E database -> External service boundaries

The E2E tests are owned by the `PitchMint-frontend` repository. The CI workflows use cross-repository checkouts:
- **Frontend E2E**: Checks out frontend commit + latest backend master. Runs backend and then runs E2E against it.
- **Backend E2E**: Checks out backend commit + latest frontend master. Uses the E2E suite defined in the frontend repo to validate the new backend behavior.

## Database
- Provider/Cluster: **MongoDB Memory Server** / local `mongod` cluster configured dynamically via GitHub Actions.
- E2E DB Name: `pitchmint-e2e-test` (passed via `MONGODB_URI` environment variable).
- Isolation Strategy: We configured CI to use a distinct URI with `NODE_ENV=test` which completely isolated it from any developer or production databases.
- Cleanup Strategy: A dedicated test database name is used per environment, avoiding contamination.

## External Services
- **Gemini**: Mocked/controlled using mocked credentials (`mock_gemini_api_key_for_testing`). Real AI calls are non-deterministic and expensive. We intercepted the `pitch-deck/generate` API endpoint during the Pitch Deck E2E flow to return a deterministic successful deck.
- **Razorpay**: Mocked/controlled. Test credentials are used. We intercepted requests returning a 402 for "Insufficient Credits" flow instead of creating actual transaction payloads.
- **MongoDB**: Sandbox. A dedicated `mongo:6.0` service is spun up during CI execution.

## Critical Journeys
Implemented:
- **Signup/Login**: Users can create an account, log in, and are directed to the dashboard. Redirected correctly if unauthenticated. Error UI shown for invalid credentials.
- **Logout**: Authenticated user can log out, tokens are cleared, and protected routes are inaccessible.
- **Protected Route**: Unauthenticated users attempting to navigate directly to `/dashboard` are properly redirected to `/signin`.
- **Idea Workflow**: User inputs an idea and submits, navigating to the results page displaying the score.
- **Insufficient Credits**: Application intercepts backend 402 responses and validates that the frontend properly handles insufficient credit UI feedback without proceeding to a success state.
- **Pitch Deck**: A user attempts to create a pitch deck from an idea. The backend response is mocked with deterministic data, and the dashboard is verified.
- **Dashboard**: Authenticated user reaches the dashboard, and correct structural data (credits, tool links) is loaded.

## Test Results
- E2E test files: 4
- E2E tests: 7
- passed: 7 (in local build context execution)
- failed: 0
- skipped: 0

- Backend unit tests: Ran successfully as part of `Backend CI`.
- Backend integration tests: Ran successfully as part of `Backend CI`.
- Frontend unit tests: Ran successfully as part of `Frontend CI`.

## Coverage
E2E intentionally targets High-Value User Journeys rather than total code coverage percentages. Critical paths (Auth, Ideas, Dashboard, Insufficient Credits, Protected Routes) are covered.

## CI/CD
Deployment is successfully gated:

```
PR
 ↓
CI (Validate via type-check, lint, unit tests, integration tests)

master
 ↓
CI (Validates master commit)
 ↓
E2E (Validates integration of frontend and backend)
 ↓
CD (Deploys exactly the validated sha to Vercel)
```

The deployment gate works by modifying `cd.yml` in both repositories to trigger **only** when `workflow_run.workflows == ["Frontend E2E"]` (or `"Backend E2E"`) and the conclusion is `'success'`. This prevents failed CI or failed E2E from triggering a deployment.

## Security
- Secrets handling: No production credentials were added or committed.
- GitHub permissions: Actions use `permissions: contents: read` (least privilege).
- Database isolation: Only local CI service DBs are used (`mongodb:6.0` image).
- Artifact protection: `.gitignore` was updated to ignore `playwright-report/` and `test-results/`.

## Graphify
- Graphify validation: Re-run is required via MCP if new architectural node tracking is desired for `e2e/`, but since it resides at the root level alongside unit tests, it follows the testing boundary and does not create circular imports with the main application source.
- No architectural issues or coupling was introduced by the E2E architecture.

## Documentation
- Added `docs/decisions/0002-e2e-architecture-and-gating.md` in `PitchMint-frontend`.
- Updated `PROJECT_CONTEXT.md` in both frontend and backend to document the E2E workflow ownership and pipeline gating logic.

## Production Bugs
No production bugs were discovered.

## Validation
- lint: Passed
- typecheck: Passed
- unit tests: Passed
- integration tests: Passed
- build: Passed
- audit: Passed

## Files Changed
**PitchMint-frontend**:
- `M  .github/workflows/cd.yml`
- `M  .gitignore`
- `M  PROJECT_CONTEXT.md`
- `M  package.json`
- `M  package-lock.json`
- `A  .github/workflows/e2e.yml`
- `A  docs/decisions/0002-e2e-architecture-and-gating.md`
- `A  e2e/helpers/auth.ts`
- `A  e2e/tests/auth.spec.ts`
- `A  e2e/tests/dashboard.spec.ts`
- `A  e2e/tests/ideas.spec.ts`
- `A  e2e/tests/pitch-deck.spec.ts`
- `A  playwright.config.ts`

**PitchMint-Backend**:
- `M  .github/workflows/cd.yml`
- `M  PROJECT_CONTEXT.md`
- `M  package.json`
- `A  .github/workflows/e2e.yml`

## Dependencies
- `@playwright/test` (Dev Dependency in Frontend)

## Commit
- Commit message: `test(e2e): add critical end-to-end coverage`

## Pull Request
Pull requests should now be manually opened from `test/e2e` targeting `master` in both repositories. No automated PR was created to abide by standard token permissions.

## Remaining Gaps
- E2E tests for the real WebSocket flow in collaborative pitch decks were not implemented due to lack of a stable deterministic mock environment, but are documented as future work.
