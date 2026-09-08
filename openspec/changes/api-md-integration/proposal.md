# Proposal: API.md Event Integration

## Intent

Replace the Events placeholder with read-only `api.md` integration so internal users can discover real events and open a contract-backed detail view without exposing unsafe writes.

## Scope

### In Scope
- Use a typed HTTP API boundary for `GET /events` and `GET /events/:id` from `VITE_API_URL`.
- Model event/source fields exactly from `api.md`, including nullable dates and `fuente`.
- Render `DashboardEventos` with loading, error, empty, and success states.
- Add list-to-detail navigation with loading, error, not found, and success states.
- Add tests for listing, navigation, detail states, API mapping, and no invented auth headers.

### Out of Scope
- CRUD/admin UI, `POST /events`, `POST /sources`, filters, pagination, and permissions.
- Existing Firebase dashboards or Realtime Database paths.
- Updating stale `.agents/references/api-contracts.md` in this slice.

## Capabilities

### New Capabilities
- `event-discovery`: Read-only Events API list/detail states, API mapping, and navigation.

### Modified Capabilities
- `internal-portal-shell`: Allow Events module/detail navigation while preserving auth redirects and module access.

## Approach

Add a small HTTP boundary separate from Firebase, typed event/source entities, and Events dashboard/detail orchestration. Keep state local or hook-owned unless later sharing requires Redux. Use only `/events` and `/events/:id`; do not attach Firebase tokens or invent query params.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/core/entities/eventoEndeavor.entity.ts` | Modified | Contract-aligned event/source types. |
| `src/presentation/components/DashboardEventos/` | Modified | Replace placeholder with read-only list states and tests. |
| `src/presentation/screens/Home.tsx` | Modified | Expose Events module. |
| `src/App.tsx` / routing area | Modified | Support detail navigation without auth-flow changes. |
| `src/api` or integration-owned path | New | Typed fetch boundary using `VITE_API_URL`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Public write endpoints are mistaken as safe | Medium | Keep POST flows out of scope and test no write affordance appears. |
| API lacks pagination/filtering | Medium | Render full list only; do not invent unsupported query params. |
| Mixing Firebase and HTTP boundaries causes coupling | Medium | Keep HTTP API separate from `src/firebase/` helpers. |

## Rollback Plan

Revert this change folder and implementation commits: restore `DashboardEventos` placeholder behavior, remove detail route/API boundary/tests, and leave Firebase dashboards unchanged.

## Dependencies

- `VITE_API_URL` pointing to backend `/api`.
- Backend serves `GET /api/events` and `GET /api/events/:id` per `api.md`.

## Success Criteria

- [ ] Events dashboard lists backend events and shows loading, error, empty, and success states.
- [ ] Event detail opens from the list and handles loading, error, not found, and success states.
- [ ] Tests cover list, navigation, detail, API mapping, and no invented auth/query/write behavior.
