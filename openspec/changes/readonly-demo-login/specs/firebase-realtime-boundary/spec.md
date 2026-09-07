# Delta for firebase-realtime-boundary

## ADDED Requirements

### Requirement: Defensive Write Guard

Create/delete helpers MUST require an explicit write capability before Firebase mutation calls execute. If write capability is false, helpers MUST reject locally before `push` or `remove` is invoked.

#### Scenario: Read-only create is rejected before Firebase write

- GIVEN a read-only session attempts to create a record
- WHEN the create helper is called
- THEN it MUST reject before calling Firebase `push`

#### Scenario: Read-only delete is rejected before Firebase write

- GIVEN a read-only session attempts to delete a record
- WHEN the delete helper is called
- THEN it MUST reject before calling Firebase `remove`

#### Scenario: Writable users keep mutation behavior

- GIVEN an authenticated writable user
- WHEN create or delete helpers are called
- THEN existing Firebase mutation behavior MUST continue

## MODIFIED Requirements

### Requirement: Existing Realtime Behavior Is Preserved


The system MUST keep current Realtime Database paths and record shapes unchanged while moving access behind the boundary and adding write guards. Existing list and subscription flows MUST remain readable for all authenticated users; writable create/delete flows MUST continue to target the same nodes and data mapping.
(Previously: create/delete flows were preserved without requiring an explicit frontend write-capability guard.)

#### Scenario: Paths remain unchanged


- GIVEN a create, delete, or subscribe action runs
- WHEN it targets `universidades`, `crowfundings`, `capitalVentures`, `plataformas`, `organismosEstado`, or `incubadoras`
- THEN it MUST use the same existing Realtime path

#### Scenario: Data mapping remains stable


- GIVEN a subscription returns records
- WHEN the UI consumes the data
- THEN the items MUST preserve the current ids and fields expected by the screens
