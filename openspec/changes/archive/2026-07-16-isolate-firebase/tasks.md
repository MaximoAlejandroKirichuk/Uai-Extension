# Tasks: Isolate Firebase Realtime Database from UI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~560-760 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add the Realtime repository boundary and keep `firebaseConfig` compatible | PR 1 | Base = feature/tracker branch; includes repository unit tests |
| 2 | Move hook/listener and add/delete consumers onto the repository seam | PR 2 | Base = PR 1 branch; preserves existing paths and UI behavior |
| 3 | Migrate tests, remove compatibility exports, add static guards, and run verification | PR 3 | Base = PR 2 branch; repository mocks only in tests |

## Phase 1: Foundation / Repository Boundary

- [x] 1.1 Create `src/firebase/realtimeRepository.ts` with `createRealtimeRecord`, `deleteRealtimeRecord`, and `subscribeToRealtimeList` using the existing Realtime paths.
- [x] 1.2 Update `src/firebase/firebaseConfig.ts` toward init-only exports while keeping temporary `ref`/`push` compatibility re-exports until ButtonAdd consumers migrate.
- [x] 1.3 Add focused Vitest coverage for `src/firebase/realtimeRepository.ts` to prove create/delete/subscribe path handling.

## Phase 2: Hook and Listener Migration

- [x] 2.1 Refactor `src/hooks/useRealtimeList.ts` to call `subscribeToRealtimeList` instead of `ref`/`onValue`/`database`.
- [x] 2.2 Refactor `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` to use the repository subscription helper and keep sorting, filtering, loading, and error dispatches unchanged.

## Phase 3: ButtonAdd and Dashboard Delete Migration

- [x] 3.1 Update `src/presentation/components/ButtonAdd/ButtonAdd.tsx`, `src/presentation/components/ButtonAddCrowfunding/ButtonAddCrowfunding.tsx`, `src/presentation/components/ButtonAddCV/ButtonAddCapitalVenture.tsx`, `src/presentation/components/ButtonAddPlataformas/ButtonAddPlataformas.tsx`, and `src/presentation/components/ButtonAddOrganismos/ButtonAddOrganismos.tsx` to create through `createRealtimeRecord`.
- [x] 3.2 Update `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx`, `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx`, `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx`, `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx`, and `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.tsx` to delete through `deleteRealtimeRecord`.

## Phase 4: Test/Mock Migration and Verification

- [x] 4.1 Migrate `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.test.tsx`, `src/presentation/components/DashboardUniversidades/DasboardUniversidades.test.tsx`, `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.test.tsx`, `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.test.tsx`, `src/presentation/components/DashboardPlataformas/DashboardPlataformas.test.tsx`, and `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.test.tsx` to mock `src/firebase/realtimeRepository.ts` instead of `firebase/database`.
- [x] 4.2 Remove temporary `ref`/`push` compatibility re-exports from `src/firebase/firebaseConfig.ts` after all ButtonAdd consumers use `createRealtimeRecord`.
- [x] 4.3 Add a static grep guard that fails if `src/presentation/` or `src/hooks/` imports `ref`, `push`, `remove`, `onValue`, or `database` from Firebase.
- [x] 4.4 Run `npm run test`, `npm run lint`, and `npm run build`; confirm the grep guard only leaves Firebase primitives inside `src/firebase/realtimeRepository.ts`.
