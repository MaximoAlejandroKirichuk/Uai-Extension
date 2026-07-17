## Exploration: session-3-business-hooks-thin-ui

### Current State
Most realtime dashboards still own both data orchestration and delete flow state. Four modules (`DashboardUniversidades`, `DashboardCrowfunding`, `DashboardPlataformas`, `DashboardCapitalVentures`) already use `useRealtimeList`, but the hook only subscribes and dispatches list updates; it does not manage loading or error actions. Each of those dashboards still imports `deleteRealtimeRecord` directly and keeps `pendingDeleteId` / `isDeleting` locally.

`DashboardIncubadoras` is the main outlier: it bypasses `useRealtimeList`, calls `subscribeToRealtimeList` directly, and handles loading/error manually with `setLoading` / `setError`. It also renders a table instead of the shared card pattern.

There is no `api.md` in the repo root, so backend contract verification was limited to the current source and the existing `firebase-realtime-boundary` spec.

### Affected Areas
- `src/hooks/useRealtimeList.ts` — needs the new list-hook contract with loading/error actions and a stable error message.
- `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` — current reference implementation for Redux-backed list + delete confirmation.
- `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` — outlier that still subscribes directly and manages async state itself.
- `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` — same delete pattern as Universities; useful migration target.
- `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` — same delete pattern as Universities; useful migration target.
- `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` — same delete pattern as Universities; useful migration target.
- `src/presentation/components/confirmation/ConfirmAction.tsx` — existing generic confirm modal that can be reused by a business hook.
- `src/firebase/realtimeRepository.ts` — current boundary for list/create/delete operations.
- `src/store/slices/createListSlice.ts` — confirms the Redux list shape already expects explicit loading/error state.

### Approaches
1. **Extract business hooks first (recommended)** — add `useDeleteConfirmation`, expand `useRealtimeList` to accept loading/error actions, then migrate one dashboard as the canonical thin UI.
   - Pros: matches the requested shape, centralizes async behavior, reduces dashboard responsibilities, keeps Redux and Firebase boundaries intact.
   - Cons: touches both shared hook behavior and one dashboard contract at once; delete UX needs careful test updates.
   - Effort: Medium

2. **Normalize `useRealtimeList` only, leave delete flow in dashboards for now** — make list loading/error consistent first and postpone delete-hook extraction.
   - Pros: smaller initial diff, lower regression risk.
   - Cons: dashboards still own delete async state and still import Firebase delete helpers directly, so the UI remains fat.
   - Effort: Low-Medium

### Recommendation
Start with **Approach 1**, but keep the first slice narrow: refactor `useRealtimeList` to the new action-based signature and migrate **Universidades** as the reference thin dashboard. Use that slice to prove the hook contract, then port the other dashboards and finally align `DashboardIncubadoras` to the same loading/error model.

### Risks
- `DashboardIncubadoras` has a different table layout, so forcing it into the card-based pattern too early could create unnecessary churn.
- Delete confirmation centralization changes the async ownership boundary; tests will need to mock hooks instead of Firebase helpers directly.
- The repo currently violates the Firebase-boundary spec in presentation code, so the refactor should be careful not to broaden scope into a Firebase-removal effort.

### Ready for Proposal
Yes. The next step should be `sdd-propose` with a narrow first slice: new `useDeleteConfirmation`, refactored `useRealtimeList`, and one migrated dashboard as the pattern lock-in.
