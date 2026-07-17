# Delta for internal-portal-shell

## ADDED Requirements

### Requirement: Brand Design Tokens

The system MUST define institutional brand tokens in `src/index.css` and consuming surfaces MUST use these tokens instead of hard-coded colors. The authority accent MUST be `#7A1C2E` and MUST be used as a controlled accent, not as a default background.

#### Scenario: Tokens available to Tailwind

- GIVEN `src/index.css` exposes brand, surface, border, and focus tokens
- WHEN a component references a brand color
- THEN it MUST resolve through a token, not a literal hex

#### Scenario: Authority accent is controlled

- GIVEN the authority accent token is `#7A1C2E`
- WHEN the shell or dashboard renders emphasis
- THEN the accent MUST NOT paint large background areas by default

### Requirement: Internal Portal Shell and Module Navigation

The system MUST provide a shared internal shell with a section header and module navigation driven by module metadata. Navigation MUST preserve the existing module set and routes and MUST NOT introduce new modules, roles, or permissions.

#### Scenario: Navigation is metadata-driven

- GIVEN the shell renders with module metadata
- WHEN a user opens Home or a dashboard
- THEN the same navigation primitives MUST be reused and MUST list current modules only

#### Scenario: Module access unchanged

- GIVEN the shell replaces the previous ad hoc navigation
- WHEN a user navigates to any existing module
- THEN all current modules and routes MUST remain reachable

### Requirement: Home Portal Structure

The `Home` screen MUST render as a dashboard-style internal portal with institutional branding and module access preserved. The portal MUST NOT add role-specific UX, personalization, or backend calls beyond current behavior.

#### Scenario: Home renders as a portal

- GIVEN a user opens Home
- WHEN the portal loads
- THEN it MUST present a branded header, visible module access, and no role-dependent content

#### Scenario: Mobile and desktop responsive

- GIVEN the user resizes the viewport
- WHEN the layout adapts
- THEN navigation and content MUST remain legible and usable on mobile and desktop

### Requirement: Pilot Dashboard Pattern

`DashboardUniversidades` MUST adopt the shared shell, section header, and state surfaces as the reference pattern for later dashboards. The dashboard MUST NOT change Firebase paths, collections, or data shape.

#### Scenario: Pilot reuses shared primitives

- GIVEN `DashboardUniversidades` is refreshed
- WHEN it renders
- THEN it MUST use the shared shell, header, and state blocks instead of local equivalents

#### Scenario: Data contract preserved

- GIVEN the dashboard reads its current data source
- WHEN it lists universidades
- THEN it MUST use existing Firebase paths and the current result shape

### Requirement: Async State Surfaces

Shared loading, empty, and error surfaces MUST exist as reusable primitives and MUST be adopted consistently by all realtime dashboards. The shell MUST not force a single card or table layout in order to render those states.

#### Scenario: Loading state

- GIVEN data is being fetched
- WHEN the request is pending
- THEN a loading surface MUST render

#### Scenario: Empty state

- GIVEN a request succeeds with no records
- WHEN the list renders
- THEN a non-empty empty-state surface MUST render

#### Scenario: Error state

- GIVEN a request fails
- WHEN the surface renders
- THEN an error surface MUST render and MUST NOT expose stack traces to the user

#### Scenario: Table-based dashboard uses shared states

- GIVEN DashboardIncubadoras renders
- WHEN loading, empty, or error occurs
- THEN it MUST use the shared state surfaces
- AND it MUST keep its existing table layout

### Requirement: Safe Destructive Action UX (Pilot Only)

The existing delete action in `DashboardUniversidades` MUST require explicit user confirmation before executing. Confirmation MUST be scoped only to the pilot dashboard in this slice and MUST NOT alter the delete's effective behavior, Firebase path, or permissions.

#### Scenario: Confirmation gates the delete

- GIVEN a user triggers the existing delete on `DashboardUniversidades`
- WHEN the confirmation step is shown
- THEN the destructive action MUST NOT execute until the user confirms

#### Scenario: Cancel preserves data

- GIVEN the confirmation step is open
- WHEN the user cancels
- THEN the target record MUST remain and the list MUST stay unchanged

#### Scenario: Confirm does not change scope

- GIVEN the user confirms the delete
- WHEN the action runs
- THEN it MUST use the existing delete path and MUST NOT delete beyond the targeted record