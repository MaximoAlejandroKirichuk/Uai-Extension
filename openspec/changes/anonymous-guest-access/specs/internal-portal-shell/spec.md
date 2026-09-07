# Delta for internal-portal-shell

## MODIFIED Requirements

### Requirement: Home Portal Structure

The `Home` screen MUST render as a dashboard-style internal portal with institutional branding, module access preserved, and clear guest/read-only context when the current session is read-only. The portal MUST NOT add role-specific module access, personalization, or backend calls beyond current behavior.
(Previously: Home explicitly avoided role-specific UX and did not require read-only guest context messaging.)

#### Scenario: Home renders as a portal

- GIVEN a user opens Home
- WHEN the portal loads
- THEN it MUST present a branded header, visible module access, and no role-dependent module access

#### Scenario: Mobile and desktop responsive

- GIVEN the user resizes the viewport
- WHEN the layout adapts
- THEN navigation and content MUST remain legible and usable on mobile and desktop

#### Scenario: Guest context is visible

- GIVEN an anonymous or otherwise read-only user opens Home
- WHEN the portal loads
- THEN the UI MUST communicate read-only access without hiding read routes

## ADDED Requirements

### Requirement: Read-Only Module Affordances

The shell and modules MUST preserve normal read navigation for read-only users while mutation affordances remain governed by the existing `canWrite` capability.

#### Scenario: Read-only navigation remains complete

- GIVEN an anonymous read-only user is on Home
- WHEN module navigation renders
- THEN all current modules MUST remain reachable

#### Scenario: Mutation controls follow canWrite

- GIVEN a read-only user opens a module
- WHEN add, delete, upload, approve, edit, or admin actions would render
- THEN those actions MUST be hidden, disabled, or blocked according to `canWrite: false`
