# dashboard-business-hooks Specification

## Purpose

Shared business hooks centralize realtime list and delete orchestration for dashboards while keeping Redux list state and Firebase access intact.

## Requirements

### Requirement: Realtime List Business Hook

The system MUST provide a reusable realtime list hook that accepts `path`, `action`, `setLoadingAction`, `setErrorAction`, and `errorMessage`. It MAY also accept an item mapper for normalization. The hook MUST drive loading and error state through the supplied Redux actions.

#### Scenario: Subscription succeeds

- GIVEN a dashboard mounts with a valid realtime path
- WHEN data arrives from the subscription
- THEN the hook MUST set loading to true before subscribing
- AND dispatch the list action with the items
- AND clear any prior error

#### Scenario: Subscription fails

- GIVEN the subscription emits an error
- WHEN the hook handles that error
- THEN the hook MUST set loading to false
- AND dispatch the supplied error action with `errorMessage`

### Requirement: Delete Confirmation Business Hook

The system MUST centralize delete confirmation and pending-delete async state in a reusable hook so dashboards do not manage local confirmation, pending item, or delete promise state directly.

#### Scenario: Confirmed delete completes

- GIVEN a user requests deletion of an item
- WHEN confirmation is accepted
- THEN the hook MUST keep the item pending during the delete call
- AND it MUST clear the pending state after a successful delete

#### Scenario: Cancel or failure keeps behavior explicit

- GIVEN confirmation is open
- WHEN the user cancels or the delete request fails
- THEN cancel MUST clear the pending item and reset async state
- AND failure MUST keep the confirmation target visible until the user retries or cancels
