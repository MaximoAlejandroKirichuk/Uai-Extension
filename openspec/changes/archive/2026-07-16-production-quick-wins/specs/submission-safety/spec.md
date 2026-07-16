# Delta for submission-safety

## ADDED Requirements

### Requirement: Timed Feedback Cleanup

The system MUST centralize transient add-modal feedback so success/error message timers are reset and cleaned up when the message changes, the modal closes, or the component unmounts. Existing add-modal flows MUST not leave orphaned timers or late state updates.

#### Scenario: Transient message clears safely

- GIVEN an add-modal shows a success message
- WHEN the timer expires or the modal is closed
- THEN the message MUST clear without a late state update after unmount

#### Scenario: Message updates replace prior timeout

- GIVEN a new transient message appears before the previous one ends
- WHEN the new message is set
- THEN the previous timeout MUST no longer control visibility

### Requirement: Pending-Safe Modal Form

The system MUST keep modal close and submit affordances disabled while a save is pending and MUST show a pending label during that state. Pending modals MUST stay open until the pending action completes.

#### Scenario: Close is blocked while pending

- GIVEN a modal submit is in progress
- WHEN the user clicks the overlay or close control
- THEN the modal MUST remain open until the save finishes

#### Scenario: Pending label is visible

- GIVEN a modal is saving
- WHEN the footer renders
- THEN the submit control MUST present a pending label and the submit action MUST be guarded against duplicates

### Requirement: Single-Path Login Submission

The system MUST submit login through the form submit path only, while `useAuth` exposes loading and error state. Duplicate submits MUST be ignored while loading, and the existing sign-in result MUST continue to drive the current post-login navigation.

#### Scenario: Submit runs once

- GIVEN credentials are entered
- WHEN the user activates Login
- THEN a single form submit path MUST run and loading MUST become visible

#### Scenario: Error surfaces inline

- GIVEN sign-in fails
- WHEN the submit completes
- THEN loading MUST stop and an error state MUST be available to the screen

### Requirement: Verification Coverage

The change MUST be verifiable through lint/build checks and targeted manual QA for timer cleanup, pending modal behavior, and login submit/error states. The covered flows MUST demonstrate the existing Firebase contract and routing behavior remain unchanged.

#### Scenario: Production checks pass

- GIVEN the change is complete
- WHEN lint and build checks run
- THEN they MUST succeed before release readiness is accepted

#### Scenario: Manual checks cover regressions

- GIVEN the affected UI flows are exercised
- WHEN a tester opens an add modal, saves, and logs in
- THEN timer cleanup, pending close blocking, and duplicate-submit prevention MUST be observable
