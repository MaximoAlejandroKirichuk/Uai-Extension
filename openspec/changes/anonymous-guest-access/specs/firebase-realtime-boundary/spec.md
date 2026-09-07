# Delta for firebase-realtime-boundary

## MODIFIED Requirements

### Requirement: Realtime Data Boundary

The system MUST keep Realtime Database reads, writes, and subscriptions behind helpers owned by `src/firebase/`. Presentation components and dashboard business hooks MUST NOT call `subscribeToRealtimeList` or `deleteRealtimeRecord` directly; they MUST route through reusable business hooks that delegate to `src/firebase/` helpers. Write helpers MUST honor `canWrite` so anonymous read-only sessions cannot create, update, or delete realtime data.
(Previously: The boundary required helper delegation but did not explicitly cover anonymous read-only write rejection.)

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

#### Scenario: Guest write is rejected at the boundary

- GIVEN an anonymous read-only user attempts a realtime mutation
- WHEN the repository helper receives `canWrite: false`
- THEN the helper MUST reject before writing to Firebase

## ADDED Requirements

### Requirement: Guest Realtime Read Preservation

Anonymous authenticated users MUST be allowed to use existing realtime read subscriptions for all current module paths, subject to deployed Firebase Rules.

#### Scenario: Guest subscription reads current path

- GIVEN an anonymous user opens a realtime dashboard
- WHEN the dashboard subscribes to its current path
- THEN the subscription MUST use the existing path and mapping

#### Scenario: Backend rules deny guest write

- GIVEN frontend write guards are bypassed
- WHEN an anonymous user attempts to write directly
- THEN deployed Firebase Rules MUST deny the write outside this repo
