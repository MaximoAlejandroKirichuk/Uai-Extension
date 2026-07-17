# firebase-realtime-boundary Specification

## Purpose

Encapsulate Firebase Realtime Database access behind `src/firebase/` helpers while preserving current paths, data mapping, UI behavior, and test outcomes.

## Requirements

### Requirement: Realtime Data Boundary

The system MUST keep Realtime Database reads, writes, and subscriptions behind helpers owned by `src/firebase/`. Presentation components and dashboard business hooks MUST NOT call `subscribeToRealtimeList` or `deleteRealtimeRecord` directly; they MUST route through reusable business hooks that delegate to `src/firebase/` helpers.

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

### Requirement: Existing Realtime Behavior Is Preserved

The system MUST keep current Realtime Database paths and record shapes unchanged while moving access behind the new boundary. Existing list, create, delete, and subscription flows MUST continue to target the same nodes and data mapping.

#### Scenario: Paths remain unchanged

- GIVEN a create, delete, or subscribe action runs
- WHEN it targets `universidades`, `crowfundings`, `capitalVentures`, `plataformas`, `organismosEstado`, or `incubadoras`
- THEN it MUST use the same existing Realtime path

#### Scenario: Data mapping remains stable

- GIVEN a subscription returns records
- WHEN the UI consumes the data
- THEN the items MUST preserve the current ids and fields expected by the screens

### Requirement: UI Behavior and Test Coverage Remain Stable

The refactor MUST preserve current loading, empty, error, and success behavior in dashboards and add flows, and the automated tests MUST continue to pass while dashboards mock business hooks or the repository boundary instead of `firebase/database`.

#### Scenario: Dashboard behavior unchanged

- GIVEN DashboardIncubadoras or another realtime dashboard renders
- WHEN data is loading, empty, failed, or present
- THEN the visible state MUST match the current UI behavior

#### Scenario: Tests use the seam

- GIVEN component tests exercise realtime flows
- WHEN they are updated for the refactor
- THEN they MUST mock the business hook seam or repository helpers
- AND they MUST still pass
