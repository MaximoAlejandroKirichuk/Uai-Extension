# Design: Readonly Demo Login

## Technical Approach

Add a session capability flag at the existing auth boundary. After `signInWithEmailAndPassword`, `useAuth` will read Firebase token claims from the signed-in user, map `readonly === true` to `canWrite: false`, and dispatch the expanded `User` to the existing Redux user slice. `Home` will derive `canWrite` from `state.user.value.user` and pass it to create/delete-capable UI. Firebase Realtime Database Rules remain authoritative; frontend guards are UX plus defense-in-depth only.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Store `readonly` and `canWrite` on `User` | Duplicates a derived value, but makes permission intent explicit across UI and helpers. | Use both fields: `readonly` preserves the source claim mapping, `canWrite` is the UI/helper capability. |
| Read claims in `useAuth` vs separate permissions service | A separate service is cleaner for future roles, but adds abstraction for one claim. | Keep mapping in `src/hooks/useAuth.ts` for the minimal change. |
| Pass `canWrite` as props vs each component selecting Redux | Props require touching call sites, but keep write capability visible and testable. | `Home` selects once and passes `canWrite` to add/dashboard components that can mutate. |
| Hide vs disable write controls | Hiding reduces accidental actions; disabling can explain why. Existing add buttons are floating action buttons with no disabled state. | Prefer not rendering create/delete controls when `canWrite` is false; add a small read-only notice in `Home` if desired. |
| Guard helpers with explicit capability vs implicit Redux/auth access | Explicit arguments create more call-site edits, but keep `src/firebase/realtimeRepository.ts` decoupled from React/Redux. | Add an explicit `canWrite` guard option/parameter to create/delete helpers before `push`/`remove`. |

## Data Flow

```text
Login form
  -> useAuth.onSubmit
  -> Firebase Auth signInWithEmailAndPassword
  -> user.getIdTokenResult()
  -> map claims.readonly to { readonly, canWrite }
  -> userSlice.setUser
  -> Home/useAppSelector
  -> Add buttons + dashboards + useDeleteConfirmation
  -> createRealtimeRecord/deleteRealtimeRecord guard
  -> Firebase push/remove only when canWrite === true
```

Read subscriptions through `useRealtimeList` remain unchanged and must not depend on `canWrite`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/core/entities/user.entity.ts` | Modify | Add `readonly: boolean` and `canWrite: boolean` to session user data. |
| `src/hooks/useAuth.ts` | Modify | Replace raw token-only mapping with token-result claim mapping; dispatch permissions after claims load. Preserve duplicate-submit guard and current navigation. |
| `src/store/slices/user/userSlice.ts` | Modify | Persist `readonly` and `canWrite` in `setUser`. |
| `src/presentation/screens/Home.tsx` | Modify | Select current user via `useAppSelector`, derive writable access, pass `canWrite` to write-capable modules, and optionally show read-only context. |
| `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` | Modify | Accept `canWrite`; do not render/open create modal for read-only users; pass capability to `createRealtimeRecord`. |
| `src/presentation/components/Dashboard*/Dashboard*.tsx` | Modify | Pass `canWrite` into `useDeleteConfirmation` for dashboards with delete actions. |
| `src/presentation/components/internal-shell/DashboardItemCard.tsx` | Modify | Accept optional delete visibility/disabled state so read-only dashboards cannot start delete from cards. |
| `src/hooks/useDeleteConfirmation.ts` | Modify | Accept `canWrite`; block `requestDelete`/`confirmDelete` before delete work and expose explicit error state. |
| `src/firebase/realtimeRepository.ts` | Modify | Add defensive guard before `push` and `remove`; keep existing paths and payloads unchanged. |
| Existing `*.test.ts(x)` near modified files | Modify | Add targeted coverage for claim mapping, UI blocking, hook guard, and repository guard. |

## Interfaces / Contracts

No backend contract is added. The only assumed external input is the existing Firebase custom claim named `readonly` from the proposal.

```ts
interface User {
  emailUser: string;
  token: string;
  localId: string;
  readonly: boolean;
  canWrite: boolean;
}

type WriteGuard = { canWrite: boolean };
```

`createRealtimeRecord(path, payload, { canWrite })` and `deleteRealtimeRecord(path, id, { canWrite })` should reject locally when `canWrite === false` before calling Firebase.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useAuth` claim mapping and login loading/error behavior | Mock Firebase user `getIdTokenResult()` for `readonly: true`, missing claim, and claim-load failure. |
| Unit | Repository mutation guards | Assert `push`/`remove` are not called when `canWrite` is false and current behavior remains when true. |
| Integration | Home/add/dashboard permission flow | Render with Redux user states and verify create/delete affordances are unavailable for read-only sessions. |
| Manual QA | Auth and Realtime behavior | Run `npm run test`, `npm run lint`, `npm run build`; manually verify readonly demo can read but cannot create/delete. |

## Migration / Rollout

No data migration required. Roll out as one frontend change after Firebase custom claim and Realtime Database Rules are already configured outside this repository.

## Open Questions

- [ ] Confirm whether read-only UI should hide write controls only or also display a persistent read-only notice in `Home`.
