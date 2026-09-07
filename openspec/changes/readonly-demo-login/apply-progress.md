# Apply Progress: Readonly Demo Login

## Mode

Standard apply. Strict TDD was not enabled for this project/change.

## Delivery Boundary

Single PR approved by user preflight up to 1000 changed lines. Actual diff remained below the configured review budget.

## Completed Tasks

- [x] 1.1 Added `readonly` and `canWrite` to the session `User` entity.
- [x] 1.2 Persisted `readonly` and `canWrite` through `setUser`.
- [x] 1.3 Loaded Firebase token claims with `getIdTokenResult()` and mapped `claims.readonly === true` to `canWrite: false`.
- [x] 2.1 Added explicit `WriteGuard` checks to create/delete realtime helpers before `push`/`remove`.
- [x] 2.2 Passed `{ canWrite }` from all create button call sites.
- [x] 2.3 Added read-only blocking to `useDeleteConfirmation` with explicit error state.
- [x] 3.1 Derived `canWrite` in `Home` and passed it to writable modules while leaving realtime subscriptions unchanged.
- [x] 3.2 Hid create affordances for read-only sessions.
- [x] 3.3 Hid delete affordances for read-only sessions across card-based dashboards.
- [x] 4.1 Extended auth tests for readonly claim mapping, missing claim writable behavior, duplicate submit, and claim-load failure.
- [x] 4.2 Extended realtime repository and delete confirmation tests for writable and blocked mutation paths.
- [x] 4.3 Extended Home coverage for read-only capability propagation and hidden create affordance.
- [ ] 4.4 Ran verification commands; manual browser verification remains pending.

## Verification

| Command | Result | Notes |
|---------|--------|-------|
| `npm run test` | Passed | 25 files, 82 tests. |
| `npm run lint` | Passed | Firebase boundary guard and ESLint passed. |
| `npm run build` | Passed | Vite emitted the existing chunk-size warning for the main JS bundle. |

## Deviations

- `DashboardEventos` and `DashboardIncubadoras` were left without write capability props because they do not expose create/delete flows in the current source.
- Manual demo-login QA was not executed in-browser in this environment.

## Bugfix: readonly session still writable in browser

### Root cause

`useAuth` read custom claims with `userFirebase.getIdTokenResult()` without the `forceRefresh` flag. Firebase Auth caches the ID token and only auto-refreshes it near expiry, so a `readonly` claim assigned to the demo account after its last token issuance is missing from the cached token. `claims.readonly === true` therefore evaluated to `false`, `canWrite` was mapped to `true`, and the frontend kept rendering the add/delete affordances. The repository/hook guards were correct but never fired because they received `canWrite: true`.

### Fix

- `src/hooks/useAuth.ts`: call `getIdTokenResult(true)` to force a fresh token from the backend so the `readonly` claim is always current.
- `src/hooks/useAuth.test.tsx`: added a regression test asserting `getIdTokenResult` is invoked with `true`.

### Verification after fix

| Command | Result |
|---------|--------|
| `npm run test` | Passed — 25 files, 83 tests. |
| `npm run lint` | Passed — Firebase boundary guard + ESLint. |
| `npm run build` | Passed — existing chunk-size warning only. |

## Remaining

- Manual browser QA: log in as the configured readonly demo user (`ciiti-test@uai.edu.ar`) and confirm dashboard data is readable while create/delete affordances are unavailable and direct writes are rejected by Firebase Rules. This is required because the regression was only reproducible against the live Firebase Auth token cache.

## Bugfix 2: demo account still writable without the readonly claim

### Root cause

The previous fix relied entirely on the Firebase `readonly` custom claim. On the live demo session the claim can be missing or stale, so `canWrite` resolved to `true` and the (already correct) downstream guards never fired — the add FAB and card delete buttons kept rendering.

### Fix

Add a centralized email-based guard so the demo account is treated as read-only in the frontend regardless of the claim state:

- `src/core/entities/session-access.ts` (new): exports `READONLY_DEMO_EMAIL`, `isReadonlyDemoEmail`, `resolveReadonly`, and `resolveCanWrite`. `resolveCanWrite` returns `false` when the email is the demo address OR the `readonly` claim is truthy.
- `src/hooks/useAuth.ts`: maps session fields through `resolveReadonly`/`resolveCanWrite` instead of raw claim checks.
- `src/presentation/screens/Home.tsx`: derives `canWrite` from the stored user's email via `resolveCanWrite` (instead of `?? true`), so a stale/missing claim in the store still yields read-only for the demo account.

### Tests

- `src/hooks/useAuth.test.tsx`: added a case proving `ciiti-test@uai.edu.ar` maps to `readonly: true, canWrite: false` even when `claims` returns `{}`.
- `src/presentation/screens/Home.test.tsx`: updated the mock to a full user object; the read-only test now uses the demo email with a writable (missing) claim and still asserts the create affordance is hidden.

### Verification

| Command | Result |
|---------|--------|
| `npm run test` | Passed — 25 files, 84 tests. |
| `npm run lint` | Passed — Firebase boundary guard + ESLint. |
| `npm run build` | Passed — existing chunk-size warning only. |
