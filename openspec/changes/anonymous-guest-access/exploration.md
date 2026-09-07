## Exploration: anonymous-guest-access

### Current State
The app initializes Firebase Auth, Firestore, and Realtime Database in `src/firebase/firebaseConfig.ts`; only Firebase Auth and Realtime Database are actively used by the inspected source. Login currently uses `signInWithEmailAndPassword` in `src/hooks/useAuth.ts`, maps the Firebase user into the local `User` shape, stores it through `src/store/slices/user/userSlice.ts`, and navigates to `/Home`. `src/App.tsx` gates `/Home` only by the presence of `state.user.value.user`, so any mapped authenticated session can access the portal.

The project already has a read-only session capability model: `User` includes `readonly` and `canWrite`, `src/core/entities/session-access.ts` derives write access, `Home` passes `canWrite` into write-capable modules, add buttons do not render when `canWrite` is false, delete buttons are hidden through dashboard item props, and `src/firebase/realtimeRepository.ts` rejects `createRealtimeRecord`/`deleteRealtimeRecord` when `canWrite` is false. Read subscriptions through `useRealtimeList` do not depend on `canWrite`, which fits anonymous read-only access.

No `api.md` exists in the repo, and no Firebase rules files were found (`firebase.json`, `firestore.rules`, and `database.rules.json` are absent). Therefore Firebase security rules must be changed outside this repository unless rule files are added by a later change. The desired rule posture should allow authenticated anonymous users to read and deny all anonymous writes; frontend guards are UX and defense-in-depth only.

### Affected Areas
- `src/firebase/firebaseConfig.ts` — exports the existing Firebase Auth instance needed by anonymous auth; no new Firebase app setup is required.
- `src/hooks/useAuth.ts` — should add a guest continuation path using Firebase `signInAnonymously`, map `user.isAnonymous` into a read-only local session, keep duplicate-submit/error handling explicit, and navigate to `/Home` after successful guest auth.
- `src/core/entities/user.entity.ts` — may need an `isAnonymous` flag if downstream UI, tests, or rules-facing documentation need to distinguish guest sessions from other read-only sessions.
- `src/core/entities/session-access.ts` — should centralize anonymous read-only capability derivation instead of scattering `isAnonymous` checks in screens.
- `src/store/slices/user/userSlice.ts` — should persist any added anonymous marker while preserving existing `readonly` and `canWrite` fields.
- `src/presentation/screens/Login.tsx` — should render the “Continuar como invitado” entry point and wire it to the new guest auth handler without breaking the existing email/password form submit path.
- `src/App.tsx` — currently allows any stored user into `/Home`; this likely remains valid because anonymous users are authenticated, but route behavior should be tested explicitly.
- `src/presentation/screens/Home.tsx` — already derives `canWrite` and passes it to most write-capable surfaces; should continue treating anonymous sessions as `canWrite: false` and may show guest/read-only context if product wants it.
- `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` — create affordances already accept `canWrite` and return `null` when false for universidades, crowfundings, capital ventures, plataformas, and organismos.
- `src/presentation/components/Dashboard*/Dashboard*.tsx` and `src/presentation/components/internal-shell/DashboardItemCard.tsx` — delete affordances already flow through `canWrite` for writable dashboard modules.
- `src/hooks/useDeleteConfirmation.ts` — already blocks delete requests and confirmation when `canWrite` is false.
- `src/firebase/realtimeRepository.ts` — already defensively blocks create/delete calls when `canWrite` is false, but Firebase rules remain the authoritative enforcement layer.
- `src/hooks/useAuth.test.tsx`, `src/presentation/screens/Login.test.tsx`, `src/presentation/screens/Home.test.tsx`, and repository/dashboard/add-button tests — should cover anonymous auth mapping, guest button state/error behavior, route access, and write affordance blocking.

### Approaches
1. **Extend the existing read-only capability model** — Add a guest login handler that calls Firebase Anonymous Auth and maps anonymous users to `readonly: true` and `canWrite: false` using the existing session capability flow.
   - Pros: Minimal, matches existing architecture, reuses current UI and repository write guards, avoids inventing roles or new backend contracts.
   - Cons: Guest sessions are visually indistinguishable from other read-only sessions unless an `isAnonymous` marker or notice is added.
   - Effort: Low/Medium

2. **Introduce a broader auth mode/role model** — Add explicit session modes such as `staff`, `readonly`, and `guest`, then gate UI based on that model.
   - Pros: More expressive if the product expects several access tiers soon.
   - Cons: Larger review surface, duplicates current `canWrite` capability behavior, and risks inventing role semantics not documented in the repo.
   - Effort: Medium/High

### Recommendation
Proceed with **Approach 1**. Add `signInAnonymously` in `useAuth`, expose a dedicated guest submit handler and guest loading/error state to `Login`, and map anonymous Firebase users to the existing read-only capability shape (`readonly: true`, `canWrite: false`). Add `isAnonymous` only if the UI needs a guest-specific label or tests need explicit session identity; write gating should still depend on `canWrite`, not on scattered anonymous checks.

For Firebase rules, plan an out-of-repo update because no rules files are present. Realtime Database rules should allow reads for `auth != null` and writes only for non-anonymous users with write permission, for example by denying `auth.token.firebase.sign_in_provider == 'anonymous'`. If Firestore data is actually used later, equivalent Firestore rules should allow authenticated reads and deny anonymous writes. Exact collection/path rules cannot be invented from this repo.

### Risks
- Frontend guards are not security; without Firebase rules, anonymous users may still write by calling Firebase directly.
- The repo has no `api.md` or rules files, so exact Firebase rule deployment must be coordinated outside this frontend change.
- `useAuth` currently has one `loading`/`error` pair for email login; guest auth should avoid confusing button states or duplicate submissions across both login paths.
- Anonymous Firebase users may have no email, so mapping must not rely on email-based read-only helpers alone.
- Existing `Home` derives `canWrite` with `resolveCanWrite(user.emailUser, user.readonly)`; anonymous users must set `readonly: true` or the derived value would become writable.

### Ready for Proposal
Yes — the orchestrator can move to `sdd-propose`. Scope should be: add a guest continuation button on login, call Firebase `signInAnonymously`, map anonymous users to authenticated read-only sessions, reuse the existing `canWrite` frontend guards for create/delete surfaces, add targeted tests, and document that Firebase Realtime Database/Firestore rules must be updated outside the repo because no rules files exist.
