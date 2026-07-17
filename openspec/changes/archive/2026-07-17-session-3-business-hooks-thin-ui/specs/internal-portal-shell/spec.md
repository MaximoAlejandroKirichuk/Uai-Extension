# Delta for internal-portal-shell

## MODIFIED Requirements

### Requirement: Async State Surfaces

Shared loading, empty, and error surfaces MUST exist as reusable primitives and MUST be adopted consistently by all realtime dashboards. The shell MUST not force a single card or table layout in order to render those states.

(Previously: Shared loading, empty, and error surfaces only needed to be adopted by the pilot surface.)

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
