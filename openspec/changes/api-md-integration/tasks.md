# Tasks: API.md Event Integration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 650-850; below cached 1000-line approval |
| 400-line budget risk | High |
| 1000-line approval risk | Low |
| Chained PRs recommended | Yes by 400-line guard; not required by cached 1000-line approval |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | API types, client, and hook state | Single PR | Include API and hook tests. |
| 2 | Events list, navigation, and shell route | Single PR | Include list/navigation/auth tests. |
| 3 | Event detail screen and docs follow-up | Single PR | Include detail tests and reference-drift note. |

## Phase 1: Contract Boundary and RED Tests

- [x] 1.1 Update `src/core/entities/eventoEndeavor.entity.ts` with `ApiEvent` and `ApiEventSource` fields from `api.md`.
- [x] 1.2 Add RED tests in `src/api/eventsApi.test.ts` for `GET /events`, `GET /events/:id`, 404, non-OK, no auth headers, no query params, and no writes.
- [x] 1.3 Create `src/api/eventsApi.ts` with `VITE_API_URL` normalization, JSON reads, `encodeURIComponent(id)`, 404 mapping, and config errors.
- [x] 1.4 Update `src/vite-env.d.ts` to type optional `VITE_API_URL`.

## Phase 2: Hook State and List UI

- [x] 2.1 Add paired tests and implementation for `src/hooks/useEvents.ts` covering loading, error, empty, and success states.
- [x] 2.2 Replace `src/presentation/components/DashboardEventos/DashboardEventos.test.tsx` placeholder assertions with list loading/error/empty/success, nullable fields, navigation, and no write affordances.
- [x] 2.3 Update `src/presentation/components/DashboardEventos/DashboardEventos.tsx` to render read-only event cards/list and navigate by event `id`.

## Phase 3: Detail Route and Portal Shell

- [x] 3.1 Add tests in `src/presentation/screens/EventDetail.test.tsx` for loading, error, not found, success, route id usage, and null-safe rendering.
- [x] 3.2 Create `src/hooks/useEventDetail.ts` and `src/presentation/screens/EventDetail.tsx` for contract-backed detail states inside the internal shell.
- [x] 3.3 Update `src/App.test.tsx` and `src/App.tsx` for guarded `/Home/events/:id`, preserving unauthenticated redirect behavior.
- [x] 3.4 Update `src/presentation/screens/Home.test.tsx` and `src/presentation/screens/Home.tsx` so Events is reachable without create/edit/delete controls.

## Phase 4: Verification and Documentation Follow-up

- [x] 4.1 Run `npm run test`, `npm run lint`, and `npm run build`; fix only regressions caused by this change.
- [x] 4.2 Record the stale `.agents/references/api-contracts.md` drift as a follow-up; do not update it in this source slice unless scope changes.
