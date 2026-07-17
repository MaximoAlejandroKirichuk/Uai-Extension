# Delta for firebase-realtime-boundary

## MODIFIED Requirements

### Requirement: Realtime Data Boundary

The system MUST keep Realtime Database reads, writes, and subscriptions behind helpers owned by `src/firebase/`. Presentation components and dashboard business hooks MUST NOT call `subscribeToRealtimeList` or `deleteRealtimeRecord` directly; they MUST route through reusable business hooks that delegate to `src/firebase/` helpers.

(Previously: Presentation components and shared UI-facing hooks only had to avoid direct Realtime Database primitives.)

#### Scenario: UI consumer uses business hook

- GIVEN a dashboard needs realtime list or delete behavior
- WHEN it performs read, write, subscribe, or delete work
- THEN it MUST do so through a business hook that delegates to a `src/firebase/` helper
- AND it MUST not depend on Firebase database primitives directly

#### Scenario: Boundary stays isolated

- GIVEN a presentation component is reviewed
- WHEN its imports are inspected
- THEN no Firebase database primitives MUST appear in presentation-layer imports
- AND delete async details MUST remain outside the dashboard

### Requirement: UI Behavior and Test Coverage Remain Stable

The refactor MUST preserve current loading, empty, error, and success behavior in dashboards and add flows, and the automated tests MUST continue to pass while dashboards mock business hooks or the repository boundary instead of `firebase/database`.

(Previously: Tests only needed to mock the repository boundary instead of firebase/database.)

#### Scenario: Dashboard behavior unchanged

- GIVEN DashboardIncubadoras or another realtime dashboard renders
- WHEN data is loading, empty, failed, or present
- THEN the visible state MUST match the current UI behavior

#### Scenario: Tests use the seam

- GIVEN component tests exercise realtime flows
- WHEN they are updated for the refactor
- THEN they MUST mock the business hook seam or repository helpers
- AND they MUST still pass
