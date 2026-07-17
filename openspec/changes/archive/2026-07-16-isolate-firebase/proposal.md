# Proposal: Isolate Firebase Realtime Database from UI

## Intent

Stop `src/presentation/` and shared UI-facing hooks from importing Realtime Database primitives directly. Firebase access should live behind `src/firebase/` helpers while preserving current paths, behavior, and UX.

## Scope

### In Scope
- Add `src/firebase/realtimeRepository.ts` for create, delete, and subscribe helpers.
- Refactor `useRealtimeList` and `DashboardIncubadoras.tsx` to consume repository APIs instead of `ref/onValue/database`.
- Refactor add/delete dashboard flows and their tests to mock the repository boundary.

### Out of Scope
- Changing Firebase paths, payload shapes, or Redux slice contracts.
- UI redesign, new validations, or non-Realtime Firebase cleanup.

## Capabilities

### New Capabilities
- `firebase-realtime-boundary`: Encapsulate Realtime Database reads/writes/subscriptions in `src/firebase/` and keep presentation consumers Firebase-agnostic.

### Modified Capabilities
- None.

## Approach

Create repository helpers such as `createRealtimeRecord`, `deleteRealtimeRecord`, and a typed subscription helper. Keep `firebaseConfig.ts` responsible for app initialization only, move Realtime SDK usage into the repository, and update UI consumers to depend on repository functions so `DashboardIncubadoras` follows the same boundary as shared list consumers.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/firebase/firebaseConfig.ts` | Modified | Stop leaking Realtime helpers from config |
| `src/firebase/realtimeRepository.ts` | New | Own Realtime CRUD + subscription access |
| `src/hooks/useRealtimeList.ts` | Modified | Subscribe through repository boundary |
| `src/presentation/components/ButtonAdd*/**/*.tsx` | Modified | Create via repository helper |
| `src/presentation/components/Dashboard*/**/*.tsx` | Modified | Delete/listen via repository helper |
| `src/presentation/components/**/*.test.tsx` | Modified | Mock repository instead of `firebase/database` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Listener regression in `DashboardIncubadoras` | Med | Keep path + mapping logic unchanged; cover with targeted test updates |
| Tests break due to new seam | Med | Migrate mocks at the repository boundary consistently |

## Rollback Plan

Revert `realtimeRepository` adoption and restore direct imports in `useRealtimeList`, dashboards, and add buttons; keep existing Realtime paths unchanged so rollback is code-only.

## Dependencies

- Current source paths remain the authority because no `api.md` exists for Realtime collections.

## Success Criteria

- [ ] No file in `src/presentation/` imports `ref`, `push`, `remove`, `onValue`, or `database`.
- [ ] Realtime paths (`universidades`, `crowfundings`, `capitalVentures`, `plataformas`, `organismosEstado`, `incubadoras`) stay unchanged.
- [ ] UI behavior remains visually unchanged, including `DashboardIncubadoras` loading/error/empty handling.
- [ ] Existing automated checks still pass after test mocks move to the repository boundary.
