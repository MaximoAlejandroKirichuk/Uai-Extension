# Design: API.md Event Integration

## Technical Approach

Add a read-only HTTP integration beside the existing Firebase boundary. `api.md` is the contract source: `VITE_API_URL` points to `/api`, list calls `GET /events`, detail calls `GET /events/:id`, requests use JSON, and no auth headers, query params, or write endpoints are introduced. Events UI keeps async state local through hooks, exposes the Events module in `Home`, and adds a guarded detail route under the existing `App` auth model.

## Architecture Decisions

| Decision | Alternatives considered | Rationale |
| --- | --- | --- |
| Create `src/api/eventsApi.ts` for HTTP reads | Extend `src/firebase/` or call `fetch` inside components | Firebase helpers are Realtime Database-specific; a separate API boundary prevents coupling and centralizes URL/error/header behavior. |
| Keep event list/detail state in hooks (`src/hooks/useEvents.ts`, `src/hooks/useEventDetail.ts`) | Add Redux slice in `src/store/slices/events` | Event API state is screen-owned and not session-critical; project rules prefer local/hook state over Redux unless sharing is justified. |
| Add `src/presentation/screens/EventDetail.tsx` guarded by `App.tsx` route `/Home/events/:id` | Embed detail inside `Home` module state only | Specs require direct detail routes and auth redirects. A route keeps browser navigation testable while preserving the existing `value.user ? screen : Navigate` model. |
| Reuse internal shell async components and dashboard styling | Build a separate visual system | Existing dashboards already use `SectionHeader`, `LoadingState`, `ErrorState`, and `EmptyState`; reuse lowers regression risk. |

## Data Flow

```txt
Home Events module ── useEvents ── eventsApi.getEvents ── fetch(VITE_API_URL/events)
        │
        └─ Link/Navigate(/Home/events/:id)

App auth guard ── EventDetail ── useEventDetail(id) ── eventsApi.getEvent(id)
```

No Redux store update occurs. `404` from detail maps to a not-found state; other non-OK responses map to error states.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/core/entities/eventoEndeavor.entity.ts` | Modify | Replace `BaseEntity` alias with contract types for `ApiEvent`, `ApiEventSource`, nullable fields, and timestamps from `api.md`. |
| `src/api/eventsApi.ts` | Create | Typed fetch boundary for `getEvents()` and `getEvent(id)`, base URL normalization, JSON parsing, non-OK handling, no auth headers/query params/write calls. |
| `src/hooks/useEvents.ts` | Create | Hook-owned loading/error/success state for list. |
| `src/hooks/useEventDetail.ts` | Create | Hook-owned loading/error/notFound/success state for detail by route id. |
| `src/presentation/components/DashboardEventos/DashboardEventos.tsx` | Modify | Replace placeholder with list loading/error/empty/success states and event navigation. |
| `src/presentation/components/DashboardEventos/DashboardEventos.test.tsx` | Modify | Cover list states, success rendering, navigation action, and no write affordances. |
| `src/presentation/screens/EventDetail.tsx` | Create | Contract-backed detail screen rendered inside internal portal shell/access model. |
| `src/presentation/screens/EventDetail.test.tsx` | Create | Cover loading, error, not found, success, route id usage, and safe nullable rendering. |
| `src/presentation/screens/Home.tsx` | Modify | Add Events module metadata without write controls. |
| `src/presentation/screens/Home.test.tsx` | Modify | Assert Events module is reachable and existing modules remain reachable. |
| `src/App.tsx` | Modify | Add guarded `/Home/events/:id` route preserving unauthenticated redirects. |
| `src/App.test.tsx` | Modify | Cover authenticated detail route and unauthenticated redirect. |
| `src/vite-env.d.ts` | Modify | Type `VITE_API_URL` as optional string for Vite env access. |
| `src/api/eventsApi.test.ts` | Create | Mock `global.fetch` for URL construction, mapping, 404, non-OK, and absence of auth/query/write behavior. |

## Interfaces / Contracts

```ts
export interface ApiEventSource {
  id: string;
  nombre: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEvent {
  id: string;
  nombre: string;
  url?: string;
  descripcion?: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  ubicacion: string | null;
  categoria: string | null;
  modalidad: string | null;
  costo_entrada: string | null;
  fuente_id: string | null;
  fuente: ApiEventSource | null;
  url_detalles: string | null;
  finalizado: boolean;
  createdAt: string;
  updatedAt: string;
}
```

`getEvents(): Promise<ApiEvent[]>` calls `${VITE_API_URL}/events`. `getEvent(id): Promise<ApiEvent>` calls `${VITE_API_URL}/events/${encodeURIComponent(id)}`. Missing `VITE_API_URL` throws a client configuration error before calling `fetch`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | API URL construction, JSON mapping, 404/non-OK errors, no auth headers, no query params, no write calls | Vitest with mocked `global.fetch` in `src/api/eventsApi.test.ts`. |
| Integration | Dashboard list loading/error/empty/success, event navigation, detail loading/error/not found/success, nullable dates/source rendering | RTL component tests with mocked hooks/API and `MemoryRouter`. |
| E2E | Not available | Provide manual QA checklist during verify; run `npm run test`, `npm run lint`, `npm run build`. |

## Migration / Rollout

No data migration required. Configure `VITE_API_URL` before rollout. Rollback by reverting the API boundary, hooks, Events module exposure, detail route, and tests.

## Open Questions

- [ ] Exact display copy/field priority can be refined later, but it does not block implementation because all rendered fields will come from `api.md`.
