# readonly-demo-session Specification

## Purpose

Map Firebase `readonly` custom claims to frontend session capabilities so demo users can browse data without starting writes.

## Requirements

### Requirement: Claim-Based Session Capability

The system MUST read the Firebase custom claim `readonly` after successful login and derive session capabilities. When `readonly === true`, the session MUST be read-only and `canWrite` MUST be false. Otherwise, authenticated sessions MUST remain writable.

#### Scenario: Read-only claim maps to read-only session

- GIVEN Firebase returns token claims containing `readonly: true`
- WHEN login completes
- THEN the session MUST expose read-only state
- AND `canWrite` MUST be false

#### Scenario: Missing claim keeps writable behavior

- GIVEN Firebase returns no `readonly: true` claim
- WHEN login completes
- THEN the session MUST remain writable
- AND existing create/delete behavior MUST be available

### Requirement: Read-Only Data Access

Authenticated read-only users MUST be able to read existing dashboard data. The frontend MUST NOT block subscriptions or list rendering because a session is read-only.

#### Scenario: Read-only user views existing data

- GIVEN an authenticated read-only user opens a dashboard
- WHEN existing records are loaded
- THEN the records MUST render normally

#### Scenario: Re-login refreshes stale claims

- GIVEN a user's custom claim changes outside the app
- WHEN the user keeps an existing token
- THEN the prior capability MAY remain until Firebase refresh or re-login
- AND re-login MUST reload the claim-derived capability

### Requirement: Read-Only UX Blocking

The system MUST prevent read-only users from starting create/delete flows through visible UI affordances, while normal users retain write affordances.

#### Scenario: Read-only mutation controls are blocked

- GIVEN a read-only session
- WHEN a create or delete affordance renders
- THEN it MUST be hidden or disabled
- AND mutation work MUST NOT start from that control
