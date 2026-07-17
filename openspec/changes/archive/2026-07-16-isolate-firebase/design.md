# Design: Isolate Firebase Realtime Database from UI

## Technical Approach

Introduce `src/firebase/realtimeRepository.ts` as the only Realtime Database boundary. It will own `firebase/database` imports and expose small helpers for create, delete, and subscribe. `useRealtimeList` and `DashboardIncubadoras` will keep their current Redux/state behavior, but they will receive data through repository callbacks instead of calling Firebase SDK primitives directly.

## Architecture Decisions

| Decision | Options | Choice |
|---|---|---|
| Realtime boundary shape | Keep direct SDK calls in hooks/components; add one repository in `src/firebase/`; move logic into Redux thunks | Add one repository in `src/firebase/` because it preserves current component ownership, avoids new Redux complexity, and satisfies the encapsulation rule. |
| Subscription reuse | Force `DashboardIncubadoras` into `useRealtimeList`; keep a dedicated listener inside the component; create a generic subscribe helper used by both | Create a generic subscribe helper. `DashboardIncubadoras` keeps its custom sort/filter flow, while `useRealtimeList` stays reusable for the card dashboards. |
| Error/loading ownership | Move loading/error into repository; keep it in consumers | Keep it in consumers because current slices and UI already own those states, and the change must not alter visible behavior. |

## Data Flow

    ButtonAdd / Dashboard / useRealtimeList
                 │
                 ▼
      realtimeRepository helpers
                 │
                 ▼
      firebaseConfig database instance
                 │
                 ▼
        Firebase Realtime Database

- Create: component builds the existing payload -> `createRealtimeRecord(path, payload)` -> repository calls `push(ref(database, path), payload)`.
- Delete: dashboard confirm flow -> `deleteRealtimeRecord(path, id)` -> repository calls `remove(ref(database, `${path}/${id}`))`.
- Subscribe: consumer passes `path`, `onData`, and optional `onError` -> repository calls `onValue` -> consumer maps data and dispatches existing slice actions.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/firebase/realtimeRepository.ts` | Create | Centralize Realtime create/delete/subscribe helpers and shared snapshot-to-list mapping support. |
| `src/firebase/firebaseConfig.ts` | Modify | Keep app/auth/firestore/database initialization only; stop exporting `ref` and `push`. |
| `src/hooks/useRealtimeList.ts` | Modify | Replace direct `ref/onValue` usage with repository subscription while preserving current dispatch contract. |
| `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` | Modify | Replace inline Firebase listener with repository subscription; keep sorting, filtering, and slice actions unchanged. |
| `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` | Modify | Delete through repository helper instead of Firebase SDK imports. |
| `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` | Modify | Same delete refactor for `crowfundings`. |
| `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` | Modify | Same delete refactor for `capitalVentures`. |
| `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` | Modify | Same delete refactor for `plataformas`. |
| `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.tsx` | Modify | Same delete refactor for `organismosEstado`. |
| `src/presentation/components/ButtonAdd/ButtonAdd.tsx` | Modify | Create universidades through repository helper. |
| `src/presentation/components/ButtonAddCrowfunding/ButtonAddCrowfunding.tsx` | Modify | Create crowfundings through repository helper. |
| `src/presentation/components/ButtonAddCV/ButtonAddCapitalVenture.tsx` | Modify | Create capitalVentures through repository helper. |
| `src/presentation/components/ButtonAddPlataformas/ButtonAddPlataformas.tsx` | Modify | Create plataformas through repository helper. |
| `src/presentation/components/ButtonAddOrganismos/ButtonAddOrganismos.tsx` | Modify | Create organismosEstado through repository helper. |
| `src/presentation/components/**/*.{test.tsx}` | Modify | Mock `realtimeRepository` instead of `firebase/database`; keep path assertions at the repository boundary. |

## Interfaces / Contracts

```ts
export type RealtimePath =
  | "universidades"
  | "crowfundings"
  | "capitalVentures"
  | "plataformas"
  | "organismosEstado"
  | "incubadoras";

export interface RealtimeSubscribeOptions<T> {
  path: RealtimePath | string;
  onData: (items: T[]) => void;
  mapItem?: (value: unknown, id: string) => T;
  onError?: (error: unknown) => void;
}

export declare function createRealtimeRecord<T>(path: RealtimePath | string, payload: T): Promise<void>;
export declare function deleteRealtimeRecord(path: RealtimePath | string, id: string): Promise<void>;
export declare function subscribeToRealtimeList<T>(options: RealtimeSubscribeOptions<T>): () => void;
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Repository create/delete/subscribe path handling | Add focused Vitest coverage for `src/firebase/realtimeRepository.ts` with mocked `firebase/database`. |
| Integration | `useRealtimeList` and `DashboardIncubadoras` dispatch and state behavior | Update existing component/hook tests to mock repository callbacks and assert unchanged slice usage, empty, loading, and error states. |
| E2E | N/A | No E2E suite exists; rely on `npm run test`, `npm run lint`, and `npm run build`. |

## Migration / Rollout

No migration required. Realtime paths and payload shapes remain unchanged.

## Open Questions

- [ ] None.
