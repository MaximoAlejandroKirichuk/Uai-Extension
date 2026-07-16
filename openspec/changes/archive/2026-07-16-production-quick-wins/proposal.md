# Proposal: Production Quick Wins

## Intent

Reduce immediate production risk in modal-create flows and login submission without changing Firebase contracts or broader frontend architecture.

## Scope

### In Scope
- Add `useTimedMessage` so transient modal feedback owns timer setup, reset, and cleanup.
- Slim `useModalForm` to modal visibility concerns and update `ModalForm` with pending-safe submit/close behavior.
- Align `useAuth` and `Login.tsx` around form-driven submit, loading/error state, and duplicate-submit prevention.

### Out of Scope
- Firebase path, payload, auth-contract, or routing redesign changes.
- Shared form architecture refactors outside the listed files.

## Capabilities

### New Capabilities
- `submission-safety`: Guard transient feedback and form submission states so create/login flows clean up timers and block duplicate submits.

### Modified Capabilities
- None.

## Approach

Create a focused hook split: `useTimedMessage` manages message lifecycle; `useModalForm` keeps open/close state. Pass `pending`, `submitLabel`, and `pendingLabel` into `ModalForm` so submit and close affordances disable while saves run. Keep login submission on `<form onSubmit>` only, and expose `{ formData, loading, error, onSubmit, onInputChange }` from `useAuth` while preserving existing Firebase sign-in and post-login navigation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useTimedMessage.ts` | New | Centralize timed message state and cleanup. |
| `src/hooks/useModalForm.ts` | Modified | Remove message/timer ownership; keep modal state helpers. |
| `src/presentation/components/ModalForm/ModalForm.tsx` | Modified | Add pending labels and disable close/submit during save. |
| `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` | Modified | Replace local timers with hook-driven feedback and pending guards. |
| `src/hooks/useAuth.ts`, `src/presentation/screens/Login.tsx` | Modified | Use form submit as the single entry point and expose loading/error state. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Pending lock makes modal feel stuck | Med | Require visible pending label and clear success/error transitions. |
| Login UX drift from current alert flow | Med | Keep Firebase auth flow unchanged; only move error/loading ownership into hook state. |

## Rollback Plan

Revert the new hook and prop additions, restore local modal message handling in `ButtonAdd*`, and return login to the current `useAuth`/`Login.tsx` submit wiring.

## Dependencies

- Existing Firebase Auth and Realtime Database integrations remain unchanged.

## Success Criteria

- [ ] No listed flow uses uncancelled `setTimeout` or allows duplicate submit while pending.
- [ ] `Login.tsx` has one live submit path via `<form onSubmit>` and no dead click handler.
- [ ] Verification covers `npm run lint`, `npm run test` if available, and `npm run build`.
