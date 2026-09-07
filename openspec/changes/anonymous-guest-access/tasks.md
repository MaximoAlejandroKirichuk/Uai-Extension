# Tasks: Anonymous Guest Access

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 450-650 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr-default; 1000-line budget |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Guest session mapping and login CTA | PR 1 | Include `useAuth`, `Login`, session entity/slice tests. |
| 2 | Read-only portal and route verification | PR 1 | Include `Home`, `App`, realtime boundary checks, and manual rules evidence. |

## Phase 1: Session Model Foundation

- [x] 1.1 Update `src/core/entities/user.entity.ts` with optional `isAnonymous?: boolean` for guest context.
- [x] 1.2 Extend `src/core/entities/session-access.ts` so anonymous sessions resolve to `readonly: true` and `canWrite: false` without relying on email.
- [x] 1.3 Update `src/store/slices/user/userSlice.ts` to preserve `isAnonymous` in `setUser` payloads.

## Phase 2: Authentication and Login UI

- [x] 2.1 Modify `src/hooks/useAuth.ts` to import `signInAnonymously`, expose `onGuestSignIn`, and map anonymous users to read-only capabilities.
- [x] 2.2 Add separate guest loading/error state in `src/hooks/useAuth.ts` and block duplicate credential or guest auth while either path is pending.
- [x] 2.3 Update `src/presentation/screens/Login.tsx` with an operable guest CTA that bypasses required credential fields and shows loading/error feedback.

## Phase 3: Portal, Routing, and Realtime Boundary

- [x] 3.1 Verify `src/App.tsx` keeps `/Home` protected by user presence and allows mapped anonymous Redux users; adjust only if tests fail.
- [x] 3.2 Update `src/presentation/screens/Home.tsx` to show read-only/guest context while preserving all current module navigation.
- [x] 3.3 Verify `src/firebase/realtimeRepository.ts` rejects `canWrite: false` creates/deletes before Firebase calls; add only minimal guard changes if gaps appear.

## Phase 4: Tests and Verification

- [x] 4.1 Extend `src/hooks/useAuth.test.tsx` for anonymous success, anonymous failure, missing email mapping, token mapping, and duplicate guest activation.
- [x] 4.2 Extend `src/presentation/screens/Login.test.tsx` for guest CTA rendering, click behavior without form submit, disabled/loading state, and inline guest errors.
- [x] 4.3 Extend `src/presentation/screens/Home.test.tsx` for guest/read-only messaging and absence of add/delete/upload/admin affordances with modules still reachable.
- [x] 4.4 Create `src/App.test.tsx` proving anonymous users reach `/Home` and unauthenticated users redirect to `/`.
- [x] 4.5 Extend `src/firebase/realtimeRepository.test.ts` if needed for guest `canWrite: false` mutation rejection and unchanged read subscription paths.
- [ ] 4.6 Run `npm run test`, `npm run lint`, and `npm run build`; record manual Firebase Console/Rules evidence for anonymous read allowed and write denied.
