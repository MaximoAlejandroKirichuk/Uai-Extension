# Event Discovery Specification

## Purpose

Define read-only event discovery backed by the root `api.md` contract.

## Requirements

### Requirement: Read-only Events API Contract

The system MUST read events from `VITE_API_URL` using only `GET /events` and `GET /events/:id`. Event data MUST match `api.md`, including string `id`, ISO-or-null dates, nullable `fuente_id`, nullable `fuente`, and no invented auth headers, query parameters, or write calls.

#### Scenario: List request uses contract URL

- GIVEN `VITE_API_URL` points to `/api`
- WHEN the events list loads
- THEN the system MUST request `GET {VITE_API_URL}/events`
- AND it MUST NOT send auth headers or query parameters

#### Scenario: Event fields are nullable

- GIVEN an event has null dates or source fields
- WHEN the event is mapped for display
- THEN the system MUST preserve null-safe rendering without crashing

### Requirement: Events List States and Navigation

The events dashboard MUST expose list loading, error, empty, and success states. In success state, each event MUST provide a way to open its detail view by event `id`.

#### Scenario: List loading state

- GIVEN the events request is pending
- WHEN the dashboard renders
- THEN a loading state MUST be visible

#### Scenario: List error state

- GIVEN `GET /events` fails or returns non-OK
- WHEN the dashboard renders
- THEN an error state MUST be visible without stack traces

#### Scenario: List empty state

- GIVEN `GET /events` returns an empty array
- WHEN the dashboard renders
- THEN an empty state MUST explain that no events are available

#### Scenario: List success navigation

- GIVEN `GET /events` returns one or more events
- WHEN the user selects an event
- THEN the app MUST navigate to that event's detail using its `id`

### Requirement: Event Detail States

The event detail view MUST read one event by `id` and render loading, error, not found, and success states from the `api.md` contract.

#### Scenario: Detail loading state

- GIVEN the detail request is pending
- WHEN the detail view renders
- THEN a loading state MUST be visible

#### Scenario: Detail not found state

- GIVEN `GET /events/:id` returns `404`
- WHEN the detail view renders
- THEN a not found state MUST be visible

#### Scenario: Detail success state

- GIVEN `GET /events/:id` returns an event
- WHEN the detail view renders
- THEN the event name and contract-backed details MUST be visible

### Requirement: Read-only Scope Constraints

The system MUST NOT expose event/source CRUD, admin permissions, filters, pagination, source management, or unsupported search behavior in this change.

#### Scenario: No write affordances

- GIVEN the events module renders
- WHEN the user reviews available actions
- THEN no create, edit, delete, approve, or source-management action MUST be shown
