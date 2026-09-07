# Delta for submission-safety

## MODIFIED Requirements

### Requirement: Single-Path Login Submission

The system MUST submit email/password login through the form submit path only, while `useAuth` exposes loading and error state for credential login and guest login independently enough to prevent duplicate actions. Duplicate credential submits MUST be ignored while credential login is loading, guest continuation MUST be ignored while guest login is loading, and either successful sign-in result MUST continue to drive the current post-login navigation.
(Previously: Only the email/password submit path exposed login loading/error and duplicate-submit expectations.)

#### Scenario: Submit runs once

- GIVEN credentials are entered
- WHEN the user activates Login
- THEN a single form submit path MUST run and loading MUST become visible

#### Scenario: Error surfaces inline

- GIVEN sign-in fails
- WHEN the submit completes
- THEN loading MUST stop and an error state MUST be available to the screen

#### Scenario: Guest auth reports loading and errors

- GIVEN the visitor activates guest continuation
- WHEN anonymous sign-in is pending or fails
- THEN guest loading MUST prevent duplicate guest activation and guest errors MUST surface inline

### Requirement: Verification Coverage

The change MUST be verifiable through lint/build checks and targeted manual QA for timer cleanup, pending modal behavior, credential login submit/error states, and guest login loading/error states. The covered flows MUST demonstrate the existing Firebase contract and routing behavior remain unchanged except for the added anonymous authenticated read-only entry path.
(Previously: Manual login verification only covered the existing credential submit/error states.)

#### Scenario: Production checks pass

- GIVEN the change is complete
- WHEN lint and build checks run
- THEN they MUST succeed before release readiness is accepted

#### Scenario: Manual checks cover regressions

- GIVEN the affected UI flows are exercised
- WHEN a tester opens an add modal, saves, signs in with credentials, and enters as guest
- THEN timer cleanup, pending close blocking, duplicate-submit prevention, and guest auth error/loading behavior MUST be observable
