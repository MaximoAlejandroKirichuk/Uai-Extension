# Proposal: Readonly Demo Login

## Intent

Allow the configured demo user to browse institutional data without being able to create or delete records. Firebase Realtime Database Rules remain the enforcement layer; the frontend adds clear UX and defense-in-depth.

## Scope

### In Scope
- Read Firebase `readonly` custom claim after login and derive `canWrite`.
- Store `readonly`/`canWrite` in the Redux auth user state.
- Hide or disable create/delete affordances for read-only sessions.
- Guard create/delete mutation calls before Firebase writes execute.
- Add targeted tests for claim mapping, UI blocking, and guarded mutations.

### Out of Scope
- New roles, permissions framework, Firebase collections, or backend endpoints.
- Changing Realtime Database paths, record shapes, or read access.
- Managing custom claims or Firebase Rules inside this repository.

## Capabilities

### New Capabilities
- `readonly-demo-session`: Maps the Firebase `readonly` claim to frontend session capabilities and read-only UX behavior.

### Modified Capabilities
- `firebase-realtime-boundary`: Mutation helpers must support a write-permission guard before `push` or `remove`.
- `dashboard-business-hooks`: Delete confirmation must block read-only sessions before invoking delete work.
- `submission-safety`: Login behavior must preserve the single submit path while loading token claims.

## Approach

Use the minimal capability-based approach from exploration. `useAuth` should call Firebase token-claim APIs after sign-in, map `readonly === true` to `canWrite: false`, and dispatch the expanded `User`. UI receives `canWrite` from session state and blocks mutation affordances. Repository helpers add a final explicit guard so missed UI checks cannot call Firebase writes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Modified | Read token claims and dispatch permission state. |
| `src/core/entities/user.entity.ts` | Modified | Add `readonly`/`canWrite` session fields. |
| `src/store/slices/user/userSlice.ts` | Modified | Persist permission fields. |
| `src/presentation/screens/Home.tsx` | Modified | Propagate `canWrite` and optionally show read-only notice. |
| `src/presentation/components/ButtonAdd*/` | Modified | Block create affordances for read-only users. |
| `src/hooks/useDeleteConfirmation.ts` | Modified | Block delete confirmation execution for read-only users. |
| `src/firebase/realtimeRepository.ts` | Modified | Guard create/delete before Firebase mutation calls. |
| `src/**/*.test.*` | Modified | Cover auth mapping, disabled UI, and guarded writes. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Claims become stale after login | Med | Accept re-login/token-refresh limitation for this slice. |
| UI hiding mistaken for security | Med | Document Firebase Rules as authoritative enforcement. |
| Add-button duplication increases edits | Med | Keep prop/API small or use a tiny shared helper only if needed. |

## Rollback Plan

Revert the proposal implementation commit: remove user permission fields, restore previous `useAuth` mapping, unblock UI affordances, and remove repository guard parameters. Firebase Rules can remain unchanged because they already protect writes.

## Dependencies

- Firebase custom claim `readonly` on `ciiti-test@uai.edu.ar`.
- Existing Realtime Database Rules: writes require `auth.token.readonly !== true`.

## Success Criteria

- [ ] Read-only users can log in and read existing data.
- [ ] Read-only users cannot start create/delete flows in the UI.
- [ ] Create/delete helpers reject read-only mutation attempts before Firebase writes.
- [ ] Existing writable users keep current create/delete behavior.
- [ ] Targeted tests pass for auth claim mapping, UI blocking, and mutation guards.
