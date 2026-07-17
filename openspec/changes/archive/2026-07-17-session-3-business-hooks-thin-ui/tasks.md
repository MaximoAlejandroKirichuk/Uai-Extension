# Tasks: Session 3 Business Hooks Thin UI

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~650–850 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 foundation + Universidades → PR 2 remaining card dashboards → PR 3 Incubadoras |
| Delivery strategy | auto-forecast |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Lock shared hook contracts with tests | PR 1 | Base = main; include hook unit tests |
| 2 | Thin pattern in Universidades | PR 1 | Pattern lock-in; update dashboard test seam |
| 3 | Port remaining card dashboards | PR 2 | Crowfunding, Plataformas, CapitalVentures; mock business hooks |
| 4 | Align Incubadoras to shared list hook | PR 3 | Preserve table UI; verify sorted rows |

## Phase 1: Foundation / Contracts

- [x] 1.1 Create `src/hooks/useDeleteConfirmation.ts` with `requestDelete`, `confirmDelete`, `cancelDelete`, and pending/error state around `deleteRealtimeRecord`.
- [x] 1.2 Expand `src/hooks/useRealtimeList.ts` to accept `setLoadingAction`, `setErrorAction`, `errorMessage`, and optional `transformItems`; dispatch loading/error + cleanup.
- [x] 1.3 Add `src/hooks/useDeleteConfirmation.test.ts` and `src/hooks/useRealtimeList.test.ts` for success, failure, cancel, pending-guard, and unsubscribe cases.

## Phase 2: Pattern Lock-in — DashboardUniversidades

- [x] 2.1 Refactor `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` to use both hooks and keep only filters, rendering, and `ConfirmAction` wiring.
- [x] 2.2 Update `src/presentation/components/DashboardUniversidades/DasboardUniversidades.test.tsx` to mock the hook seam and cover loading, empty, error, and delete confirmation behavior.
- [x] 2.3 Verify `src/presentation/components/DashboardUniversidades/Universidades/ItemUniversidad.tsx` still only emits `onDelete(id)`; adjust only if the new hook shape requires it.

## Phase 3: Port Remaining Dashboards

- [x] 3.1 Refactor `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx`, `DashboardPlataformas.tsx`, and `DashboardCapitalVentures.tsx` to use `useDeleteConfirmation` + expanded `useRealtimeList`.
- [x] 3.2 Update each matching `*.test.tsx` to mock `useRealtimeList` and `useDeleteConfirmation` instead of `deleteRealtimeRecord`; assert no direct Firebase ownership remains in UI.
- [x] 3.3 Refactor `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` to consume `useRealtimeList` with `transformItems: compareByRegistration`; preserve table layout and filters.
- [x] 3.4 Update `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.test.tsx` to verify shared async states and sorted output through the hook seam.

## Phase 4: Verification / Cleanup

- [x] 4.1 Run `npm run test`, `npm run lint`, and `npm run build`; fix any typing or stale-import fallout.
- [x] 4.2 Remove temporary console noise only if introduced; keep all copy, comments, and UI text in English.
