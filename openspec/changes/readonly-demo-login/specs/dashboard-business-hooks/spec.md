# Delta for dashboard-business-hooks

## MODIFIED Requirements

### Requirement: Delete Confirmation Business Hook

The system MUST centralize delete confirmation and pending-delete async state in a reusable hook so dashboards do not manage local confirmation, pending item, write capability, or delete promise state directly. For read-only sessions, the hook MUST block delete confirmation execution before invoking delete work.
(Previously: the hook centralized confirmation and pending-delete state but did not account for read-only sessions.)

#### Scenario: Confirmed delete completes

- GIVEN a writable user requests deletion of an item
- WHEN confirmation is accepted
- THEN the hook MUST keep the item pending during the delete call
- AND it MUST clear the pending state after a successful delete

#### Scenario: Cancel or failure keeps behavior explicit

- GIVEN confirmation is open
- WHEN the user cancels or the delete request fails
- THEN cancel MUST clear the pending item and reset async state
- AND failure MUST keep the confirmation target visible until the user retries or cancels

#### Scenario: Read-only delete is blocked

- GIVEN a read-only session has access to existing records
- WHEN delete confirmation would execute
- THEN the hook MUST block before invoking delete work
- AND it MUST expose an explicit blocked/error state
