## Exploration: api.md Integration Gaps

### Current State
`api.md` now defines a small unauthenticated JSON API under `/api` for event discovery and event sources. The frontend currently has no HTTP API client, no `VITE_API_URL` usage, and no `fetch()`/Axios calls. Existing data modules use Firebase Realtime Database through `src/firebase/realtimeRepository.ts`, `src/hooks/useRealtimeList.ts`, Redux list slices, and dashboard components. The events dashboard is intentionally a placeholder and is not exposed in `Home` navigation.

The local reference `.agents/references/api-contracts.md` is stale: it still says no `api.md` exists, while the repository root has a complete `api.md`. For this change, root `api.md` is the source of truth.

### Backend Contract Surface Relevant to Frontend

| Contract area | Source of truth | Frontend state | Gap / drift | Risk | Suggested first slice | Test implication |
| --- | --- | --- | --- | --- | --- | --- |
| API base URL | `VITE_API_URL=http://localhost:3000/api`; routes are under `/api` | No env typing or API client usage found | Missing integration boundary for HTTP calls | Hard-coded URLs or scattered fetch calls later | Add a small typed API boundary under an integration-owned path before UI work | Unit-test URL construction and error handling by mocking `fetch` |
| `GET /api/events` | Returns all events sorted by `createdAt` ascending | `DashboardEventos` renders only a placeholder; no event slice/store/list hook | Missing event list integration | Main backend feature is invisible in the frontend | Implement read-only event list as the first UI slice | Component test loading, success, empty, and error states; API client test for response mapping |
| Event data model | `id`, `nombre`, `url`, `descripcion`, `fecha_inicio`, `fecha_fin`, `ubicacion`, `categoria`, `modalidad`, `costo_entrada`, `fuente_id`, `url_detalles`, `finalizado`, timestamps, optional populated `fuente` | `EventoEndeavor` is only `BaseEntity`; no fields typed | Entity drift / under-modeling | UI may accidentally depend on nonexistent or mistyped fields | Replace placeholder entity with contract-aligned event/source types | Type-level compile coverage plus rendering tests for nullable date/source fields |
| `GET /api/events/:id` | Returns one event by MongoDB ObjectId; invalid ids behave as not found | No route or detail component exists; routing is currently shell/state-driven | Missing detail flow | Proposal may overreach if detail UX is not required | Defer unless product confirms event detail is in scope | If included later, test 404/error/detail states and route behavior |
| `POST /api/events` | Publicly callable, unprotected create endpoint | Current write affordances are Firebase-only and gated by Firebase session write guards | Backend write contract conflicts with current frontend safety model | Exposing public writes would bypass current read-only/demo safety expectations | Do not expose create event UI until auth/authorization expectations are decided | Tests should assert no write affordance is rendered unless a later spec explicitly allows it |
| `GET /api/sources` | Returns sources sorted by `createdAt` ascending | No source API integration | Missing supporting data if event filters or create forms need source names | Filter/create UX may need source labels but source requirements are unclear | Defer source list unless needed for read-only display or filters | API client tests for source mapping if used |
| `POST /api/sources` | Publicly callable, accepts `nombre` or `name` alias | No source create UI | Missing but unsafe to expose | Same public write risk as events | Defer until backend auth/authorization exists or product accepts risk | Tests should keep write endpoints uncalled in read-only slice |
| Auth / authorization | `api.md`: not implemented; no token/cookie required | Frontend uses Firebase Auth for app access and Firebase write guards | Contract mismatch by integration type | Developers may assume Firebase token applies to Express API when it currently does not | Treat event API as public read-only from frontend for first slice | Test API client does not attach invented auth headers |
| Pagination/filtering/search | `api.md`: not available; `GET /events` returns all events | Existing dashboards often do client-side search/filter after full list load | Potential scalability issue but not a contract gap | Large event lists could hurt performance | Use client-side filtering only if needed; do not invent query params | Tests should verify no unsupported query string is required |
| Health check | Not available | No health checks | Missing operational endpoint, not frontend-critical | App-level availability detection cannot rely on backend health | Defer; frontend should handle request failure directly | Error state tests instead of health-check dependency |
| Existing Firebase modules | Realtime paths: `universidades`, `crowfundings`, `capitalVentures`, `plataformas`, `organismosEstado`, `incubadoras` | Implemented and covered by tests | Separate from `api.md`; no backend contract for those modules in `api.md` | Accidental migration could break current app behavior | Do not migrate non-event modules in this change | Regression tests should ensure existing Firebase dashboards remain untouched |

### Affected Areas
- `api.md` — primary backend contract for events, sources, auth expectations, response shapes, and known production gaps.
- `.agents/references/api-contracts.md` — stale reference that conflicts with the root contract; should be updated in a later non-source/docs slice.
- `src/core/entities/eventoEndeavor.entity.ts` — currently only aliases `BaseEntity`; it does not model the API event/source contract.
- `src/presentation/components/DashboardEventos/DashboardEventos.tsx` — placeholder for event UI; no data loading, table/list, or async states.
- `src/presentation/components/DashboardEventos/DashboardEventos.test.tsx` — currently asserts placeholder-only behavior; will need replacement when integration starts.
- `src/presentation/screens/Home.tsx` — does not include the events module in navigation; adding it is a product/scope decision, not a technical assumption.
- `src/store/store.ts` and `src/store/slices/` — no event slice exists; add Redux only if the event list is shared/session-relevant, otherwise prefer local or hook state.
- `src/firebase/realtimeRepository.ts` and `src/hooks/useRealtimeList.ts` — current data boundary is Firebase-specific and should not be stretched to HTTP APIs.
- `vite.config.ts`, `src/test/setup.ts`, and existing `*.test.tsx` files — Vitest/jsdom/RTL setup is ready for API-client and component tests.

### Approaches
1. **Read-only HTTP event module first** — Add a typed HTTP API boundary, model `Event`/`Source`, and render `GET /events` in the existing events dashboard pattern.
   - Pros: Aligns with the safest frontend contract; avoids public write exposure; keeps scope reviewable; exercises the new API boundary with tests.
   - Cons: Requires product confirmation to expose Events navigation; does not solve admin/create workflows.
   - Effort: Medium

2. **Full events and sources CRUD integration** — Build read and create screens for events and sources in one change.
   - Pros: Covers the whole `api.md` surface.
   - Cons: Exposes unprotected write endpoints unless product/backend changes occur; larger review; many product decisions are missing.
   - Effort: High

3. **Contract-only preparation** — Add types/API client tests without visible UI.
   - Pros: Lowest risk; prepares the integration seam.
   - Cons: Does not deliver visible event discovery; may feel incomplete for users.
   - Effort: Low

### Recommendation
Proceed with a proposal for a read-only event discovery slice. The first implementation should create a typed HTTP API boundary for `GET /events`, model the exact `api.md` response including nullable date/source fields, and update `DashboardEventos` only after product confirms whether the Events module should appear in `Home` navigation. Do not expose `POST /events` or `POST /sources` from the frontend until backend authentication/authorization is defined or the risk is explicitly accepted.

### Test Strategy for Later SDD Apply
- Add unit tests for the HTTP API boundary by mocking `global.fetch`: base URL usage, successful JSON parsing, non-OK/error response behavior, and no invented auth headers.
- Add component tests for `DashboardEventos`: loading, empty, error, success table/list rendering, nullable date display, nullable `fuente`, and external link behavior if rendered.
- Add or update `Home.test.tsx` only if the proposal/spec confirms Events should be exposed in navigation.
- Keep existing Firebase dashboard tests as regression coverage; this change should not modify Firebase Realtime paths or hooks.
- Run `npm run test`, `npm run lint`, and `npm run build` during verify.

### Unresolved Product / Business Questions
- Should the Events module be visible in the internal portal navigation now, or remain hidden until a broader release decision?
- Is the first frontend slice strictly read-only event discovery, or should event detail (`GET /events/:id`) be included?
- Which event fields must be visible in the list, and how should `fecha_inicio`, `fecha_fin`, `finalizado`, and missing `fuente` be presented?
- Should client-side search/filter/sort be added even though `api.md` has no backend query parameters?
- Are public create endpoints intentionally available to the frontend, or must admin/create UI wait for backend auth/authorization?
- Should `.agents/references/api-contracts.md` be updated as part of this change or handled as a separate documentation maintenance task?

### Risks
- The backend API has no authentication/authorization; exposing create flows would conflict with current frontend read-only/write-guard assumptions.
- `api.md` has no pagination/filtering; a naive full-list UI may not scale if event volume grows.
- The project has two data integration styles after this change: Firebase Realtime Database for existing modules and HTTP JSON for events/sources. The boundary must make that distinction explicit.
- The stale `.agents/references/api-contracts.md` can mislead future agents unless updated soon.

### Ready for Proposal
Yes — with a narrow read-only scope. The orchestrator should tell the user that proposal/spec can proceed for a typed `GET /events` integration and Events dashboard exposure only after the navigation/detail/write-scope questions are answered.

### Review Workload Early Forecast
- Likely first slice size: Medium, roughly 250-500 changed lines if limited to types, HTTP API client, dashboard read-only UI, and tests.
- 1000-line budget risk: Low for read-only event list; Medium/High if details, filters, navigation, and create flows are bundled.
- Chained PRs recommended: No for the recommended slice; Yes if full CRUD is requested.
