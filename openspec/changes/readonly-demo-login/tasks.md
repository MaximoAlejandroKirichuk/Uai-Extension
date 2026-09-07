# Tasks: Readonly Demo Login

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 650-850 |
| 400-line budget risk | High |
| Chained PRs recommended | No, single PR remains under the configured 1000-line budget |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr-default |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Session capability mapping and store shape | PR 1 | Auth/entity/slice tests included. |
| 2 | Realtime write guards and delete hook blocking | PR 1 | Repository/hook tests included. |
| 3 | Home, add, and dashboard UI propagation | PR 1 | UI regression tests included. |

## Phase 1: Session Capability Foundation

- [x] 1.1 Update `src/core/entities/user.entity.ts` with `readonly` and `canWrite` fields.
- [x] 1.2 Update `src/store/slices/user/userSlice.ts` so `setUser` persists the new capability fields.
- [x] 1.3 Update `src/hooks/useAuth.ts` to call `getIdTokenResult()`, map `claims.readonly === true`, and dispatch capability data after sign-in.

## Phase 2: Defensive Mutation Boundary

- [x] 2.1 Add a `WriteGuard` option to `src/firebase/realtimeRepository.ts` create/delete helpers and reject before `push`/`remove` when `canWrite` is false.
- [x] 2.2 Update all `createRealtimeRecord` call sites in `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` to pass `{ canWrite }`.
- [x] 2.3 Update `src/hooks/useDeleteConfirmation.ts` to accept `canWrite`, block `requestDelete`/`confirmDelete`, and expose explicit blocked error state.

## Phase 3: UI Propagation

- [x] 3.1 Update `src/presentation/screens/Home.tsx` to select the session user, derive `canWrite`, pass it into writable modules, and keep read subscriptions unchanged.
- [x] 3.2 Update `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` to hide create affordances when `canWrite` is false.
- [x] 3.3 Update `src/presentation/components/Dashboard*/Dashboard*.tsx` and `src/presentation/components/internal-shell/DashboardItemCard.tsx` so read-only users cannot start delete flows.
- [x] 3.4 Centralize a demo-email read-only guard (`src/core/entities/session-access.ts`) and apply it in `useAuth` and `Home` so `ciiti-test@uai.edu.ar` stays read-only even when the `readonly` claim is missing or stale.

## Phase 4: Tests and Verification

- [x] 4.1 Extend `src/hooks/useAuth.test.tsx` for read-only claim, missing claim, duplicate submit, and claim-load failure scenarios.
- [x] 4.2 Extend `src/firebase/realtimeRepository.test.ts` and `src/hooks/useDeleteConfirmation.test.ts` for blocked and writable mutation scenarios.
- [x] 4.3 Extend `src/presentation/screens/Home.test.tsx` and affected dashboard tests to verify read-only users can read data but cannot create/delete.
- [x] 4.4 Run `npm run test`, `npm run lint`, and `npm run build`.
- [x] 4.5 Fix browser regression: force token refresh (`getIdTokenResult(true)`) so the `readonly` claim is not read from a stale cached ID token; add regression test.

Manual browser QA (login as `ciiti-test@uai.edu.ar`) remains pending because the regression only reproduced against live Firebase token caching.
