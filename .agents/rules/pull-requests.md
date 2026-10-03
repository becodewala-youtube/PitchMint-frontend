---
trigger: when asked to create, prepare, or draft a pull request, or when writing PR titles/descriptions.
description: Strict guidelines for writing Pull Request titles and descriptions.
---

# Pull Request Rules

When generating Pull Request titles and descriptions, follow these strict guidelines. Do NOT use marketing language, filler words, or unnecessary hype.

## 1. PR Title Rules
- **Format**: Must use Conventional Commits format: `<type>(<scope>): <imperative summary>`
- **Type**: Must be one of `feat`, `fix`, `chore`, `test`, `refactor`, `style`, `docs`, `security`.
- **Scope**: Must reflect the specific module, feature, or architectural layer being changed (e.g., `auth`, `e2e`, `ci`, `canvas`, `credits`).
- **Length**: Keep under 70 characters.
- **Tone**: Imperative mood (e.g., "add", not "adds" or "added"). No capitalization at the start of the summary, no period at the end.

**Good Examples**:
- `feat(credits): add Razorpay checkout integration`
- `fix(canvas): resolve infinite render loop on state update`
- `test(e2e): add critical user journey coverage`
- `chore(deps): bump vite to 6.x`

**Bad Examples**:
- `Implemented new payment flow` (No conventional format)
- `feat(Auth): Adds login` (Capitalized scope, capitalized summary, wrong verb tense)

## 2. PR Description Rules
The description must be highly structured, factual, and strictly technical.

### Required Sections:
1. **What Changed**: A concise bulleted list of the exact technical changes made. (e.g., "Added `auth.middleware.ts`", "Updated `cd.yml` to gate on E2E").
2. **Why It Changed**: The business or technical reason for the change. Reference specific requirements, bug reports, or tech debt.
3. **Testing Performed**: 
   - State exactly which test commands were run (e.g., `npm run test:unit`, `npx playwright test`).
   - List the pass/fail results.
   - Mention any coverage changes if relevant.
4. **Screenshots / Visuals** (Frontend only): Explicitly state if screenshots are attached or if visual changes were made.
5. **Limitations / Future Work**: List any technical debt introduced, known edge cases, or follow-up tasks required.

### Tone & Style Restrictions:
- **BANNED**: Phrases like "Get ready to experience", "We're thrilled to introduce", "This amazing new feature", "Supercharged".
- **REQUIRED**: Factual, concise, and direct communication.

## Example Good Description:
```md
### What Changed
- Added `tests/e2e/auth.spec.ts` to cover signup and login flows.
- Modified `.github/workflows/cd.yml` to require successful E2E completion before deploying to Vercel.

### Why It Changed
- Production deployment was previously gated only by unit tests. We needed true E2E coverage to prevent integration regressions from reaching production.

### Testing Performed
- `npx playwright test` - 7/7 tests passed locally.
- `npm run lint` - 0 errors.

### Limitations
- WebSocket flows are not yet covered in E2E due to lack of a stable mock environment. This is deferred to a future PR.
```
