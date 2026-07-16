# Tasks: Production Quick Wins

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 220-320 |
| 400-line budget risk | Low |
| 800-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Ship all production quick wins as one focused slice | PR 1 | Base = main; includes tests and manual QA notes |

## Phase 1: Timed Feedback Foundation

- [x] 1.1 Create `src/hooks/useTimedMessage.ts` with restartable timeout, `showMessage`, `clearMessage`, and unmount cleanup.
- [x] 1.2 Simplify `src/hooks/useModalForm.ts` to `isOpen/open/close/toggle` only; remove message ownership and `CloseOptions`.

## Phase 2: Pending-Safe Modal Shell and Add Flows

- [x] 2.1 Update `src/presentation/components/ModalForm/ModalForm.tsx` to accept `pending` and `pendingLabel`, and disable overlay close, close button, and submit while pending.
- [x] 2.2 Refactor `src/presentation/components/ButtonAdd/ButtonAdd.tsx`, `ButtonAddCrowfunding/ButtonAddCrowfunding.tsx`, `ButtonAddOrganismos/ButtonAddOrganismos.tsx`, `ButtonAddPlataformas/ButtonAddPlataformas.tsx`, and `ButtonAddCV/ButtonAddCapitalVenture.tsx` to use `useTimedMessage` and local pending state.
- [x] 2.3 Remove direct `setTimeout` message cleanup from every `ButtonAdd*` submit path and clear transient messages through the hook only.

## Phase 3: Single-Path Login Submission

- [x] 3.1 Update `src/hooks/useAuth.ts` to expose `{ formData, loading, error, onSubmit, onInputChange }` and ignore duplicate submits while loading.
- [x] 3.2 Update `src/presentation/components/Pressable.tsx` and `src/presentation/screens/Login.tsx` so login submits only via `<form onSubmit>`, with loading/error UI and a submit-disabled button.
- [x] 3.3 Keep Firebase sign-in, Redux user dispatch, and post-login navigation behavior unchanged while surfacing inline error state.

## Phase 4: Verification

- [x] 4.1 Add/update `src/hooks/useTimedMessage.test.ts` for timer reset, message replacement, and unmount cleanup.
- [x] 4.2 Add/update `src/presentation/components/ModalForm/ModalForm.test.tsx` and `src/presentation/screens/Login.test.tsx` for pending close blocking and single-submit/error handling.
- [x] 4.3 Run `npm run lint`, `npm run test`, and `npm run build`; manually verify add-modal save, pending-close guard, and login loading/error states.
