# Delta for internal-portal-shell

## MODIFIED Requirements

### Requirement: Internal Portal Shell and Module Navigation

The system MUST provide a shared internal shell with a section header and module navigation driven by module metadata. Navigation MUST preserve existing module access, MUST allow the Events module and event detail routes, and MUST NOT introduce roles, permissions, or write capabilities.
(Previously: Navigation preserved the existing module set and routes and did not introduce new modules, roles, or permissions.)

#### Scenario: Navigation is metadata-driven

- GIVEN the shell renders with module metadata
- WHEN a user opens Home or a dashboard
- THEN the same navigation primitives MUST be reused
- AND current modules plus the Events module MUST be reachable

#### Scenario: Module access unchanged

- GIVEN the shell includes the Events module
- WHEN a user navigates to any existing module
- THEN all previous modules and routes MUST remain reachable

#### Scenario: Event detail route preserves auth redirects

- GIVEN an unauthenticated user opens an event detail route
- WHEN routing resolves access
- THEN the user MUST be redirected by the existing auth rules

#### Scenario: Authenticated user opens event detail

- GIVEN an authenticated user selects an event from the Events module
- WHEN the app navigates to the detail route
- THEN the event detail view MUST render inside the internal portal access model

#### Scenario: Events add no write permissions

- GIVEN a read-only or writable internal session
- WHEN the Events module renders
- THEN the shell MUST NOT expose event create, edit, delete, approve, or admin controls
