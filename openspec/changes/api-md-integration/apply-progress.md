# Apply Progress: API.md Event Integration

## Status

- Change: `api-md-integration`
- Mode: Standard
- Delivery: single PR with `size:exception`
- Completed tasks: 13/13
- Next recommended phase: `sdd-verify`

## Completed Tasks

- [x] 1.1 Updated `src/core/entities/eventoEndeavor.entity.ts` with `ApiEvent` and `ApiEventSource` fields from `api.md`.
- [x] 1.2 Added tests in `src/api/eventsApi.test.ts` for list/detail reads, 404, non-OK, no auth headers, no query params, and GET-only behavior.
- [x] 1.3 Created `src/api/eventsApi.ts` with `VITE_API_URL` normalization, JSON reads, `encodeURIComponent(id)`, 404 mapping, and config errors.
- [x] 1.4 Updated `src/vite-env.d.ts` to type optional `VITE_API_URL`.
- [x] 2.1 Added paired tests and implementation for `src/hooks/useEvents.ts` covering loading, error, empty, and success states.
- [x] 2.2 Replaced `DashboardEventos` placeholder tests with list state, nullable rendering, navigation, and no write affordance assertions.
- [x] 2.3 Updated `DashboardEventos.tsx` to render read-only Events API cards and detail links by event `id`.
- [x] 3.1 Added `EventDetail.test.tsx` for loading, error, not found, success, route id usage, and null-safe rendering.
- [x] 3.2 Created `useEventDetail.ts` and `EventDetail.tsx` for contract-backed detail states inside the internal portal shell.
- [x] 3.3 Updated `App.test.tsx` and `App.tsx` for guarded `/Home/events/:id`, preserving unauthenticated redirects.
- [x] 3.4 Updated `Home.test.tsx` and `Home.tsx` so Events is reachable without create/edit/delete controls.
- [x] 4.1 Ran `npm run test`, `npm run lint`, and `npm run build` successfully.
- [x] 4.2 Recorded stale `.agents/references/api-contracts.md` drift as a follow-up; it was not updated in this implementation slice.

## Verification Evidence

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run test` | Passed | 30 test files passed, 115 tests passed. |
| `npm run lint` | Passed | Firebase boundary guard passed and ESLint completed. |
| `npm run build` | Passed with existing bundle-size warning | TypeScript build and Vite production build completed; Vite warned that the main chunk is larger than 500 kB. |

## Deviations from Design

- `ApiEventSource.createdAt` and `ApiEventSource.updatedAt` are optional because root `api.md` shows populated `fuente` objects on event read responses with only `id`, `nombre`, and `url`. This follows `api.md` as the source of truth.

## Issues / Follow-ups

- `.agents/references/api-contracts.md` is stale: it says no root `api.md` exists. This is documented as a follow-up and intentionally left unchanged because the implementation scope excluded updating that reference.
- `npm run build` reports a Vite chunk-size warning for the existing app bundle; build still succeeds.

## Remediation Notes

- Follow-up bugfix: normalized `VITE_API_URL` so event reads call `/api/events` and `/api/events/:id` exactly once whether the configured base URL is the backend root or already includes `/api`.
- Updated Events UI user-facing copy to neutral/professional Spanish and switched generated detail links to `/Home/eventos/:id`, while preserving `/Home/events/:id` as a compatible route.
- Verification rerun: `npm run test`, `npm run lint`, and `npm run build` passed; the existing Vite chunk-size warning remains.
- Remediation: list and detail event UIs now render `Fuente: {fuente.nombre}` or `Fuente: Fuente no disponible` and tests assert that source ids from `fuente.id` / `fuente_id` are not exposed as user-facing text.
- Remediation: list and detail event UIs now render a `Ver fuente` external link when `fuente.url` is present, using the populated source URL from `api.md` without exposing source ids.
- Remediation: list and detail event UIs now distinguish the event-specific external URL (`event.url`) from the source website (`fuente.url`) with Spanish labels `Página del evento` and `Sitio de la fuente`; detail view also treats `url_detalles` as an additional detail URL when present.
- Verification rerun after URL-label remediation: `npm run test` passed with 30 test files and 119 tests; `npm run lint` passed; `npm run build` passed with the existing Vite chunk-size warning.
- Responsive UI remediation: event list cards and the detail view now use structured metadata areas plus compact external action rows; long event, source, and detail URLs are constrained with truncation or breaking so they do not overflow at mobile, tablet, or desktop widths. Verification rerun: `npm run test`, `npm run lint`, and `npm run build` passed; the existing Vite chunk-size warning remains.

## Workload / PR Boundary

- Mode: single PR with `size:exception`.
- Current work unit: all API.md event integration tasks.
- Boundary: read-only Events API contract boundary, hooks, list UI, detail route, tests, task artifact, and apply progress.
- Estimated review budget impact: implemented within the maintainer-approved 1000-line exception; standard 400-line guard remains exceeded by design.
