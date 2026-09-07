# Apply Progress: Anonymous Guest Access

## Mode

- Artifact store: OpenSpec
- Implementation mode: Standard
- Workload boundary: single PR with maintainer-approved `size:exception`; user-approved review budget is 1000 changed lines.
- Strict TDD: disabled

## Completed Tasks

- [x] 1.1 Added optional `isAnonymous?: boolean` to the session `User` entity.
- [x] 1.2 Extended central session access helpers so anonymous sessions resolve to `readonly: true` and `canWrite: false` without relying on email.
- [x] 1.3 Preserved `isAnonymous` in the Redux user slice.
- [x] 2.1 Added Firebase Anonymous Auth through `onGuestSignIn` and mapped guests to read-only capabilities.
- [x] 2.2 Added separate guest loading/error state and a shared pending guard that blocks duplicate auth across credential and guest paths.
- [x] 2.3 Added an operable guest CTA on Login that bypasses credential validation and surfaces guest loading/error feedback.
- [x] 3.1 Verified `/Home` remains protected by Redux user presence and accepts mapped anonymous users.
- [x] 3.2 Added guest/read-only context messaging on Home while preserving all module navigation.
- [x] 3.3 Verified `realtimeRepository` already rejects `canWrite: false` creates/deletes before Firebase calls; no code change was required there.
- [x] 4.1 Extended `useAuth` tests for anonymous success, failure, missing email mapping, token mapping, duplicate guest activation, and cross-path pending guard behavior.
- [x] 4.2 Extended Login tests for guest CTA rendering, click behavior, disabled/loading state, and inline guest errors.
- [x] 4.3 Extended Home tests for guest/read-only messaging, unavailable write affordances, and preserved module navigation.
- [x] 4.4 Added App routing tests for anonymous `/Home` access and unauthenticated redirect behavior.
- [x] 4.5 Verified existing realtime repository tests already cover `canWrite: false` mutation rejection and unchanged read subscription paths.

## Partially Completed / Pending

- [ ] 4.6 Repository checks passed, but Firebase Console/Rules operational evidence is external to this repository and still must be captured before production release readiness.

## Verification Run

| Command | Result | Notes |
|---------|--------|-------|
| `npm run test` | Passed | 26 files, 93 tests passed. |
| `npm run lint` | Passed | Firebase boundary guard passed before ESLint. |
| `npm run build` | Passed | Vite emitted the existing chunk-size warning for a 730.13 kB JS asset. |

## External Firebase Rules Requirement

This repository does not contain `api.md`, `firebase.json`, `firestore.rules`, or `database.rules.json`. Production acceptance requires out-of-repo Firebase Rules evidence showing:

- Anonymous authenticated reads are allowed for the current read paths.
- Anonymous writes are denied independently of frontend guards.
- Equivalent Firestore rules are verified if Firestore-backed data becomes visible in this guest flow.

## Deviations from Design

- `src/firebase/realtimeRepository.ts` was not modified because its existing guard already rejects `canWrite: false` creates/deletes before `ref`, `push`, or `remove` are called.
- Firebase Console/Rules verification was documented as an external release gate because the repository has no deployable rules files or Firebase project access.

## Issues Found

- External Firebase Rules evidence remains pending and cannot be proven from this repository alone.
- `npm run build` reports a Vite chunk-size warning for the production bundle; the build still succeeds.
