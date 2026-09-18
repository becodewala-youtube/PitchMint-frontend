# ADR-001: Feature-Based Frontend Architecture

Status: Accepted

Decision:
The frontend architecture is structured around business features (`src/features/`) rather than flat component/page directories.

Reason:
Not documented in the existing project.

Consequences:
- Features are self-contained, encapsulating their own components, API slices, and pages.
- Global shared components and utilities must be placed in `src/shared/`.
