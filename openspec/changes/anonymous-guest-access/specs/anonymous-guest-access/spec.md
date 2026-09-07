# anonymous-guest-access Specification

## Purpose

Allow visitors to enter as Firebase Anonymous authenticated guests with read-only access to existing portal modules.

## Requirements

### Requirement: Guest Login Entry

The login screen MUST expose a guest continuation action separate from the email/password submit path.

#### Scenario: Guest action is available

- GIVEN a visitor is on Login
- WHEN the login form renders
- THEN a guest continuation action MUST be visible and operable

#### Scenario: Guest action does not submit credentials

- GIVEN email/password fields are empty
- WHEN the visitor activates guest continuation
- THEN guest authentication MUST start without requiring form validation

### Requirement: Anonymous Firebase Authentication

Guest continuation MUST sign in through Firebase Anonymous Auth and MUST navigate authenticated guests to the normal authenticated portal entry.

#### Scenario: Anonymous sign-in succeeds

- GIVEN Firebase Anonymous Auth accepts the request
- WHEN the guest action completes
- THEN the user MUST be authenticated anonymously and routed to `/Home`

#### Scenario: Anonymous sign-in fails

- GIVEN Firebase Anonymous Auth rejects the request
- WHEN the guest action completes
- THEN the user MUST remain on Login and see an inline error state

### Requirement: Guest Read-Only Session Mapping

Anonymous authenticated users MUST map to local capabilities with `readonly: true` and `canWrite: false`.

#### Scenario: Anonymous user maps read-only

- GIVEN Firebase returns an anonymous authenticated user
- WHEN the local session user is created
- THEN `readonly` MUST be true and `canWrite` MUST be false

#### Scenario: Anonymous user has no email

- GIVEN the anonymous Firebase user has no email
- WHEN capabilities are derived
- THEN read-only mapping MUST NOT depend on email presence

### Requirement: Normal Read Route Access

Anonymous authenticated users MUST access the same authenticated read routes and current modules as other authenticated users.

#### Scenario: Guest enters Home

- GIVEN an anonymous user is authenticated
- WHEN protected routing evaluates access to `/Home`
- THEN access MUST be allowed

#### Scenario: Guest reads modules

- GIVEN an anonymous user is on Home
- WHEN a current module is opened
- THEN existing read data MUST be visible subject to backend read permission

### Requirement: Mutation and Admin Restrictions

Anonymous users MUST NOT see or execute create, edit, delete, approve, upload, or admin mutation actions.

#### Scenario: Write affordances are blocked

- GIVEN an anonymous user views a module
- WHEN mutation controls would normally render
- THEN those controls MUST be hidden or disabled by `canWrite: false`

#### Scenario: Write helper rejects guest mutation

- GIVEN an anonymous session reaches a mutation helper
- WHEN the helper receives `canWrite: false`
- THEN it MUST reject the mutation before changing data

### Requirement: External Firebase Rules Acceptance

Production acceptance MUST include operational evidence that Firebase rules allow anonymous reads and deny anonymous writes.

#### Scenario: Rules evidence is provided

- GIVEN rules files are absent from this repo
- WHEN release readiness is evaluated
- THEN manual Firebase Rules evidence MUST show anonymous read allowed and write denied
