# Design: Session 3 Business Hooks Thin UI

## Technical Approach

Refactor realtime dashboards around two shared hooks without changing Redux ownership or `src/firebase/realtimeRepository.ts`. `useRealtimeList` becomes the canonical subscription orchestrator: set loading, clear stale error, subscribe to one RTDB path, optionally transform incoming items, dispatch the existing fetch action, dispatch a user-safe error action on failure, and always cleanup the listener. `useDeleteConfirmation` centralizes delete-confirmation state and async deletion so card-based dashboards keep only filters and rendering. `DashboardIncubadoras` adopts the same list contract but keeps its current table UI and registration sorting.

## Architecture Decisions

### Decision: Shared realtime list orchestration

| Option | Tradeoff | Decision |
|------|------|------|
| Keep per-dashboard `useEffect`/repository wiring | Repeats loading/error logic and preserves the Incubadoras outlier | Reject |
| Expand `useRealtimeList` with Redux async actions + optional list transform | Slightly wider hook API, but one consistent contract across dashboards | Choose |

Rationale: the repo already standardizes list state in `createListSlice.ts`, so the hook should drive that contract instead of every dashboard re-implementing it.

### Decision: Delete workflow lives in a business hook

| Option | Tradeoff | Decision |
|------|------|------|
| Keep `pendingDeleteId`/`isDeleting` in each dashboard | Lowest short-term churn, but Firebase delete ownership stays in UI | Reject |
| Add `useDeleteConfirmation` wrapping `deleteRealtimeRecord` | New hook/test seam, but dashboards become thin and consistent | Choose |

Rationale: presentation components should configure copy and selected item labels, not own async delete state.

### Decision: No mandatory per-dashboard hook in the first slice

| Option | Tradeoff | Decision |
|------|------|------|
| Add `useUniversidadesDashboard`, `useCrowfundingDashboard`, etc. now | Thinner screens, but many new files for mostly local filtering | Reject for now |
| Keep generic hooks first; allow a dashboard hook only where view-model logic stays noisy | Smaller diff within the 800-line review budget | Choose |

Rationale: current filters are local/derived state, so Redux stays untouched. A dashboard hook remains an allowed follow-up pattern, not a phase requirement.

## Data Flow

    Dashboard UI → useRealtimeList → realtimeRepository.subscribeToRealtimeList
         │                │                        │
         │                ├─ dispatch(setLoading/setError/fetch*)
         │                └─ cleanup unsubscribe
         └→ useDeleteConfirmation → realtimeRepository.deleteRealtimeRecord

For Incubadoras: `transformItems(sortByRegistration)` runs inside `useRealtimeList` before `fetchIncubadoras` dispatch.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useRealtimeList.ts` | Modify | Accept `setLoading`, `setError`, `errorMessage`, optional `transformItems`; dispatch consistent async state and cleanup listener. |
| `src/hooks/useDeleteConfirmation.ts` | Create | Own selected item, open/pending/error state, and expose `requestDelete`, `confirmDelete`, `cancelDelete`. |
| `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` | Modify | Use both hooks; keep filters and card rendering only. |
| `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` | Modify | Same thin-dashboard pattern as Universidades. |
| `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` | Modify | Same thin-dashboard pattern as Universidades. |
| `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` | Modify | Same thin-dashboard pattern as Universidades. |
| `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` | Modify | Replace direct subscription `useEffect` with `useRealtimeList`; preserve table layout and filters. |
| `src/presentation/components/Dashboard*/**/*.test.tsx` | Modify | Mock hooks instead of repository calls where ownership moved; verify loading/error/confirm behavior. |

## Interfaces / Contracts

```ts
type UseRealtimeListOptions<T> = {
  path: string;
  action: (items: T[]) => AnyAction;
  setLoading: (value: boolean) => AnyAction;
  setError: (message: string | null) => AnyAction;
  errorMessage: string;
  mapItem?: (value: unknown, id: string) => T;
  transformItems?: (items: T[]) => T[];
};

type UseDeleteConfirmationOptions<T> = {
  path: string;
  getId: (item: T) => string;
  onSuccessMessage?: string;
  onErrorMessage?: string;
};
```

`useDeleteConfirmation` returns `{ selectedItem, isOpen, isDeleting, error, requestDelete, confirmDelete, cancelDelete }` so `ConfirmAction` stays presentational.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useRealtimeList` dispatch order, error handling, cleanup, `transformItems` | Vitest + mocked `subscribeToRealtimeList` and dispatch hook |
| Unit | `useDeleteConfirmation` request/confirm/cancel, pending guard, success/error paths | Vitest + mocked `deleteRealtimeRecord` |
| Integration | Dashboards render loading/empty/error/success and wire confirm modal through hooks | RTL in jsdom with mocked selectors/hooks |
| Integration | `DashboardIncubadoras` keeps table UX while using shared async contract | RTL assertion for table + sorted rows + error state |
| E2E | No dedicated E2E layer in repo | Not planned for this slice |

## Migration / Rollout

No migration required. Roll out by migrating Universidades first as the reference implementation, then Crowfunding/Plataformas/CapitalVentures, and finally Incubadoras with table preservation.

## Open Questions

- [ ] Should `DashboardOrganismosEstados` adopt the same delete hook in this change or in a follow-up slice?
- [ ] Keep existing `alert(...)` success/error UX for parity, or move delete feedback to inline UI later?
