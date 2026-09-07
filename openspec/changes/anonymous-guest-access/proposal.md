# Proposal: Anonymous Guest Access

## Intent

Allow visitors to enter the portal as authenticated Firebase Anonymous users and read all current modules, while preserving the existing write protection model. Guest access must be explicitly read-only: no create, edit, delete, approve, upload, or admin mutation behavior.

## Scope

### In Scope
- Add a guest CTA on `Login` that uses Firebase Anonymous Auth.
- Map anonymous sessions into the existing `readonly: true` / `canWrite: false` capability model.
- Keep route access authenticated and block write affordances/actions through existing `canWrite` guards.
- Add UX messaging that makes guest/read-only limitations clear.
- Define the operational Firebase Rules requirement outside this repo.

### Out of Scope
- No broad role/permission system unless existing code requires it.
- No guest writes or admin mutations.
- No Firebase provider setup in code; Anonymous provider is already enabled manually.
- No invented Firebase collections, backend endpoints, or custom claim schema.

## Capabilities

### New Capabilities
- `anonymous-guest-access`: Guest authentication, route entry, read-only session mapping, and guest write restrictions.

### Modified Capabilities
- `submission-safety`: Extend login submit/error/loading expectations to the separate guest auth path.
- `firebase-realtime-boundary`: Preserve read subscriptions for guests and keep repository write helpers guarded by `canWrite`.
- `internal-portal-shell`: Surface read-only guest context without adding role-specific module access.

## Approach

Extend the current read-only model. `useAuth` should add `signInAnonymously`, map `user.isAnonymous` to a local `User` with `readonly: true` and `canWrite: false`, then navigate to `/Home`. `Home`, add buttons, delete hooks, dashboards, and `realtimeRepository` should continue gating mutations through `canWrite`; avoid scattered anonymous checks except where identity messaging is needed.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Modified | Guest auth handler, state, session mapping. |
| `src/presentation/screens/Login.tsx` | Modified | Guest CTA, loading/error UX. |
| `src/core/entities/session-access.ts` | Modified | Central anonymous read-only derivation if needed. |
| `src/App.tsx` | Modified | Verify authenticated guest route access. |
| `src/presentation/screens/Home.tsx` | Modified | Guest/read-only messaging, preserve `canWrite`. |
| Firebase Rules | External | Allow authenticated reads; deny anonymous writes. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Frontend-only guards are bypassable | High | Deploy Realtime DB/Firestore rules outside repo. |
| Anonymous user lacks email | Med | Do not rely on email-only readonly derivation. |
| Guest and login loading conflict | Med | Keep explicit state/duplicate-submit guards per path. |

## Rollback Plan

Remove the guest CTA and anonymous auth handler, revert anonymous session mapping, and disable Firebase Anonymous provider/rules changes in Firebase Console.

## Dependencies

- Firebase Anonymous provider enabled in Firebase Console.
- Out-of-repo Firebase Rules update; no `api.md`, `firebase.json`, `firestore.rules`, or `database.rules.json` exists.

## Success Criteria

- [ ] Guest users can enter `/Home` and read every existing module.
- [ ] Guest users cannot see or execute write/admin mutations.
- [ ] Email/password login behavior remains unchanged.
- [ ] Firebase Rules deny anonymous writes independently of frontend guards.
