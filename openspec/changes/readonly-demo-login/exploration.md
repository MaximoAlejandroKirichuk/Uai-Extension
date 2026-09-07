## Exploration: readonly-demo-login

### Current State
The app signs users in with Firebase email/password in `src/hooks/useAuth.ts`, maps the Firebase user into the local `User` entity with `emailUser`, `token`, and `localId`, stores it in Redux through `src/store/slices/user/userSlice.ts`, and gates `Home` in `src/App.tsx` by checking whether `state.user.value.user` exists.

There is no frontend permission model today. `api.md` is absent, and `.agents/references/api-contracts.md` explicitly says backend/Firebase contracts are not documented in-repo. For this change, the known external contract is the already-configured Firebase custom claim `readonly` and Realtime Database Rules:

```json
{ ".read": "auth != null", ".write": "auth != null && auth.token.readonly !== true" }
```

Realtime Database writes are centralized at the repository boundary in `src/firebase/realtimeRepository.ts` through `createRealtimeRecord` and `deleteRealtimeRecord`. Create UI exists in five floating add components (`ButtonAdd*`), while delete UI flows through dashboard item `onDelete` props and the shared `useDeleteConfirmation` hook. Events and incubators currently do not expose create/delete affordances.

### Affected Areas
- `src/hooks/useAuth.ts` — should read Firebase ID token claims after sign-in, derive readonly/canWrite capability, and dispatch it with the user.
- `src/core/entities/user.entity.ts` — should add the minimal session permission shape, preferably capability-oriented (`canWrite`) with optional raw claim if useful.
- `src/store/slices/user/userSlice.ts` — should persist the new permission fields so the app can make consistent UI and guard decisions.
- `src/presentation/screens/Home.tsx` — should pass readonly/canWrite state to mutation affordances and can optionally show a read-only session notice near the shell.
- `src/presentation/components/ButtonAdd*/` — create affordances for universidades, crowdfunding, capital ventures, plataformas, and organismos should be hidden or disabled for read-only sessions.
- `src/hooks/useDeleteConfirmation.ts` — delete confirmation should guard before calling `deleteRealtimeRecord` and surface a clear read-only UX message.
- `src/firebase/realtimeRepository.ts` — should add a final frontend write guard at the centralized mutation boundary before `push`/`remove` executes.
- Existing tests in `src/hooks/*.test.tsx`, `src/firebase/realtimeRepository.test.ts`, dashboard tests, and add-button tests — should cover claim mapping, readonly UI, and guarded mutations.

### Approaches
1. **Capability-based frontend guard with UI propagation** — Map `readonly === true` to `canWrite: false` in auth state, pass it to mutation UI, and require it at mutation hooks/repository boundaries.
   - Pros: Minimal, explicit, avoids inventing roles, aligns with the current Redux session model, keeps Firebase Rules as the source of enforcement.
   - Cons: Requires touching several mutation affordances because add buttons are separate components; frontend guard cannot replace backend rules.
   - Effort: Medium

2. **Role/permission framework** — Introduce a broader role model (`role`, `permissions`, route guards, reusable policy helpers) and adapt mutation UI to that model.
   - Pros: More extensible if future admin/editor/viewer roles are planned.
   - Cons: Over-engineers a single known custom claim, risks inventing unsupported roles/contracts, creates more review surface than needed.
   - Effort: High

### Recommendation
Proceed with **Approach 1**.

The minimum safe implementation should treat `readonly` as a Firebase custom claim and derive one frontend capability: `canWrite`. The UI should prevent read-only users from starting create/delete flows, while a centralized guard should stop accidental calls to `createRealtimeRecord` and `deleteRealtimeRecord` if a caller misses the UI check. Firebase Realtime Database Rules remain the authoritative protection; the frontend adds clarity and defense-in-depth.

The implementation should not introduce roles, new Firebase collections, or a repository-owned auth flow. It should only extend the existing login/session state and mutation seams.

### Risks
- Firebase custom claims may require reading `getIdTokenResult()` rather than only `getIdToken()`; tests must mock the exact Firebase Auth method used.
- If the custom claim is changed after login, the stored Redux permission may remain stale until token refresh or re-login unless explicitly refreshed.
- Add buttons are duplicated across modules, so hiding/disabling them can produce repeated edits unless a small shared permission wrapper is introduced.
- The repository boundary does not currently receive user/session context, so adding a centralized guard needs a simple API that does not couple Firebase helpers directly to Redux.
- Frontend-only hiding is not security. The backend rules already configured by the user are still required and should be documented as the enforcement layer.

### Ready for Proposal
**Yes.** The orchestrator can move to `sdd-propose` with this scope: read the existing Firebase `readonly` custom claim during login, store a derived `canWrite` capability in Redux user state, hide or disable create/delete UI for read-only sessions, and add a frontend mutation guard with a clear read-only message. No backend rules file should be added because the rules were configured manually and no rules file exists in the repo.
