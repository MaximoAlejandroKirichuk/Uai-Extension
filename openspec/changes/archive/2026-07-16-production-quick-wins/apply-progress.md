# Apply Progress: Production Quick Wins

## Summary

Implemented the production quick wins as a focused frontend cleanup: timed modal feedback now owns its own lifecycle, modal shells block close/submit while pending, and login now submits through the form path with explicit loading/error state.

## Completed

- `useTimedMessage` added with restartable timeout cleanup and unmount teardown.
- `useModalForm` slimmed to visibility-only state.
- `ModalForm` now supports pending-safe close/submit behavior.
- All `ButtonAdd*` flows use the shared timed message hook and local pending state.
- `useAuth` now exposes `formData`, `loading`, `error`, `onSubmit`, and `onInputChange` with duplicate-submit protection.
- `Login` now submits through `<form onSubmit>` and renders inline loading/error state.
- Added tests for the timed message hook, modal shell, login shell, and auth flow.

## Verification

- `npm run lint` ✅
- `npm run test` ✅
- `npm run build` ✅
- Manual browser QA for login loading/error behavior ✅

## Remaining

- None. Manual browser QA confirmed the login loading/error behavior. Add-modal pending behavior is covered by automated tests and remains a recommended smoke check before release, not an archive blocker.

## Notes

- No previous apply-progress artifact existed.
- The change stayed within the single low-risk PR slice forecast in `tasks.md`.
