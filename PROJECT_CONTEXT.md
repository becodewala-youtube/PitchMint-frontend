# PitchMint Frontend Context

## 1. Project Purpose
Frontend client for the PitchMint platform.

## 2. Technology Stack
React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Redux Toolkit.

## 3. Architecture
Feature-based architecture located in `src/features/`.

## 4. Major Features
auth, canvas, competitors, credits, dashboard, ideas, investors, landing, legal, market-research, pitch-deck, pitch-simulator.

## 5. Application State
Redux Toolkit (`@reduxjs/toolkit`, `react-redux`).

## 6. Routing
React Router (`react-router-dom`).

## 7. API Architecture
Axios used as the API client to communicate with the Backend.

## 8. Shared UI
Located in `src/shared/`. Styled with Tailwind CSS and Framer Motion.

## 9. Testing & Deployment
- Deployment: Vercel (`vercel.json`), Docker (`Dockerfile`).
- Testing: Vitest (`tests/`).

## 10. Relationship with PitchMint-Backend
PitchMint-frontend consumes the REST API provided by PitchMint-Backend. Cross-repository boundary relies on REST JSON contracts and JWT authentication.

```
Frontend -> API Contract -> Backend -> Database / External Services
```
