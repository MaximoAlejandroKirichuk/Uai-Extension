# Delta for submission-safety

## MODIFIED Requirements

### Requirement: Single-Path Login Submission

The system MUST submit login through the form submit path only, while `useAuth` exposes loading and error state. Duplicate submits MUST be ignored while loading, and the existing sign-in result MUST continue to drive the current post-login navigation after token claims are loaded and mapped to session capabilities.
(Previously: login completed from the sign-in result without documenting token-claim loading.)

#### Scenario: Submit runs once

- GIVEN credentials are entered
- WHEN the user activates Login
- THEN a single form submit path MUST run and loading MUST become visible

#### Scenario: Error surfaces inline

- GIVEN sign-in or token-claim loading fails
- WHEN the submit completes
- THEN loading MUST stop and an error state MUST be available to the screen

#### Scenario: Claim loading precedes session capability use

- GIVEN sign-in succeeds
- WHEN Firebase token claims are read
- THEN the session MUST map `readonly` before writable UI is enabled

#### Scenario: Stale claim refresh is explicit

- GIVEN a session token predates a Firebase custom-claim change
- WHEN the user remains logged in
- THEN the previous capability MAY persist until token refresh or re-login
