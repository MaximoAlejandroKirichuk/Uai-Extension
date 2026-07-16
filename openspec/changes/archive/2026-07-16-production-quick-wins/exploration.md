## status
explored

## executive_summary
- `useModalForm` currently owns both modal open/close state and the transient message state; the success toast timeout is duplicated in every `ButtonAdd*` component and has no cleanup.
- `ModalForm` is presentational only today: it has no `pending` state, no alternate pending label, and the close affordances stay enabled during save.
- `Login.tsx` already uses `<form onSubmit>`, but the `Pressable` button has a dead `onClick={() => onSubmit}` handler and `useAuth` does not expose `loading` or `error`, so duplicate submits are not guarded.
- There is no `src/hooks/useTimedMessage.ts` in the repo, so the requested direction implies a new hook or a refactor of the current modal hook responsibilities.

## artifacts
- OpenSpec: `openspec/changes/production-quick-wins/exploration.md`
- Engram: `sdd/production-quick-wins/explore` (`architecture`, `project: uai-extension`)

## next_recommended
- Move to proposal with a small, production-focused plan: introduce `useTimedMessage`, slim `useModalForm` to modal state only, add `pending/submitLabel/pendingLabel` to `ModalForm`, and refactor `useAuth`/`Login` to submit through the form with loading + error state.

## risks
- Timers in the current `ButtonAdd*` flows can outlive the component and trigger state updates after unmount.
- Adding pending/disabled behavior to `ModalForm` changes modal interaction while saving; it needs a visible pending label so users understand why close is blocked.
- `useAuth` currently alerts on error; moving to inline error state will need a small UX decision and test updates.

## skill_resolution
- Loaded `sdd-explore`, `02-frontend-architecture`, `03-react-implementation`, `05-testing-and-verification`, `state-rules`, `routing-auth-rules`, and `forms-rules` to validate placement, React form behavior, and verification expectations.
