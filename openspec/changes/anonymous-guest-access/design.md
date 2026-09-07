# Design: Anonymous Guest Access

## Technical Approach

Implement anonymous access as another authenticated Firebase session, not as a public route or new role system. `useAuth` will call Firebase Anonymous Auth, map anonymous users into the existing `User` capability shape with `readonly: true` and `canWrite: false`, then route to `/Home`. The current `/Home` gate in `src/App.tsx` is already based on `state.user.value.user`, so an anonymous authenticated user should pass once mapped into Redux. Write protection remains capability-based through existing `canWrite` props and `src/firebase/realtimeRepository.ts`; Firebase security rules are an external deployment requirement because this repo has no `api.md`, `firebase.json`, `firestore.rules`, or `database.rules.json`.

No delta spec files exist yet under this change; this design is based on `proposal.md` and `exploration.md`.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Reuse `readonly` / `canWrite` for guests | Minimal surface and matches current guards; guest identity needs a small marker for messaging | Chosen. Anonymous access maps to `readonly: true`, `canWrite: false`, with optional `isAnonymous` on `User` for UI context only. |
| Add roles such as `guest`, `staff`, `admin` | More expressive but invents unavailable product/backend semantics | Rejected. No role contract exists in this repo. |
| Public unauthenticated `/Home` route | Easier routing but bypasses Firebase authenticated-read rules posture | Rejected. Guests must be Firebase-authenticated anonymous users. |
| Frontend-only write blocking | Good UX but not security | Rejected as sole control. Keep frontend guards and require external Firebase Rules deployment. |

## Data Flow

```text
Login guest CTA
  └─ useAuth.signInAsGuest()
      └─ Firebase signInAnonymously(auth)
          └─ map Firebase user: email "", uid, token, isAnonymous true
              └─ Redux setUser({ readonly: true, canWrite: false })
                  └─ App user gate allows /Home
                      └─ Home passes canWrite=false to modules
                          ├─ read subscriptions continue
                          └─ create/delete affordances and repository writes blocked
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Modify | Import `signInAnonymously`, expose `onGuestSignIn`, add separate guest loading state, share session mapping, and prevent duplicate auth across both paths. |
| `src/core/entities/session-access.ts` | Modify | Extend central capability derivation so `isAnonymous` forces `readonly: true` and `canWrite: false`. |
| `src/core/entities/user.entity.ts` | Modify | Add optional `isAnonymous?: boolean` for guest/read-only messaging without driving write authorization directly. |
| `src/store/slices/user/userSlice.ts` | Modify | Preserve `isAnonymous` when storing the mapped session. |
| `src/presentation/screens/Login.tsx` | Modify | Add guest CTA wired to `onGuestSignIn`, disable auth buttons during pending auth, and show guest-specific error/loading copy if needed. |
| `src/App.tsx` | Modify | Keep user-presence gate; add/adjust tests to prove anonymous mapped users can access `/Home`. No route should become public. |
| `src/presentation/screens/Home.tsx` | Modify | Surface read-only/guest context while continuing to derive write capability from `canWrite`/central helpers. |
| `src/hooks/useAuth.test.tsx` | Modify | Cover anonymous success, anonymous failure, token mapping, and duplicate-submit prevention. |
| `src/presentation/screens/Login.test.tsx` | Modify | Cover guest CTA rendering, click handler, disabled/loading, and error display. |
| `src/presentation/screens/Home.test.tsx` | Modify | Cover guest/read-only message and write affordance absence. |
| `src/App.test.tsx` | Create | Verify anonymous Redux user reaches `/Home` and unauthenticated users remain redirected. |

## Interfaces / Contracts

```ts
interface User {
  emailUser: string;
  token: string;
  localId: string;
  readonly: boolean;
  canWrite: boolean;
  isAnonymous?: boolean;
}
```

Capability contract: anonymous sessions MUST always resolve to `readonly: true` and `canWrite: false`, regardless of missing email or token claims. Mutation UI and mutation helpers MUST depend on `canWrite`, not scattered `isAnonymous` checks.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Session access derivation and `useAuth` anonymous mapping | Vitest mocks for Firebase Auth and Redux dispatch. |
| Integration | Login CTA, route gate, Home write affordance hiding | React Testing Library with mocked store/router state. |
| E2E | Full Firebase anonymous read-only flow | Manual QA only; no E2E framework exists. |

Run `npm run test`, `npm run lint`, and `npm run build` during verification.

## Migration / Rollout

No data migration required. Operational rollout requires enabling Firebase Anonymous Auth and deploying out-of-repo rules that allow authenticated reads and deny anonymous writes for Realtime Database, plus equivalent Firestore rules if Firestore-backed data becomes user-visible.

## Open Questions

- [ ] Exact Firebase Realtime Database and Firestore rule paths must be confirmed outside this repository before production rollout.
