# firebase-realtime-boundary Specification

## Purpose

Encapsulate Firebase Realtime Database access behind `src/firebase/` helpers while preserving current paths, data mapping, UI behavior, and test outcomes.

## Requirements

### Requirement: Realtime Data Boundary

The system MUST keep Realtime Database reads, writes, and subscriptions behind helpers owned by `src/firebase/`. Presentation components and shared UI-facing hooks MUST NOT import Realtime Database primitives directly.

#### Scenario: UI consumer uses repository boundary

- GIVEN a dashboard or add flow needs realtime data
- WHEN it performs read, write, or subscribe work
- THEN it MUST do so through a `src/firebase/` helper
- AND it MUST not depend on `ref`, `push`, `remove`, `onValue`, or `database` directly

#### Scenario: Boundary stays isolated

- GIVEN a presentation component is reviewed
- WHEN its imports are inspected
- THEN no Firebase database primitives MUST appear in presentation-layer imports

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

The refactor MUST preserve current loading, empty, error, and success behavior in dashboards and add flows, and the automated tests MUST continue to pass by mocking the repository boundary instead of `firebase/database`.

#### Scenario: Dashboard behavior unchanged

- GIVEN `DashboardIncubadoras` or another realtime dashboard renders
- WHEN data is loading, empty, failed, or present
- THEN the visible state MUST match the current UI behavior

#### Scenario: Tests use the new seam

- GIVEN component tests exercise realtime flows
- WHEN they are updated for the refactor
- THEN they MUST mock the repository helpers instead of Firebase database primitives
- AND they MUST still pass
