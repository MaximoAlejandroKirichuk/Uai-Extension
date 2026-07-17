## Exploration: isolate-firebase

### Current State
Firebase Realtime Database is still exposed to the UI layer. `src/firebase/firebaseConfig.ts` exports `database`, `ref`, and `push`; `src/hooks/useRealtimeList.ts` imports `ref`, `onValue`, and `database` directly; every add/delete dashboard component imports Firebase primitives too. `DashboardIncubadoras.tsx` is the outlier: it bypasses `useRealtimeList` and subscribes with `onValue` inside the component.

### Affected Areas
- `src/firebase/firebaseConfig.ts` — currently leaks Realtime DB primitives.
- `src/firebase/realtimeRepository.ts` — new home for Realtime DB reads/writes.
- `src/hooks/useRealtimeList.ts` — should stop importing Firebase directly.
- `src/presentation/components/ButtonAdd/ButtonAdd.tsx` — create flow for `universidades`.
- `src/presentation/components/ButtonAddCrowfunding/ButtonAddCrowfunding.tsx` — create flow for `crowfundings`.
- `src/presentation/components/ButtonAddCV/ButtonAddCapitalVenture.tsx` — create flow for `capitalVentures`.
- `src/presentation/components/ButtonAddPlataformas/ButtonAddPlataformas.tsx` — create flow for `plataformas`.
- `src/presentation/components/ButtonAddOrganismos/ButtonAddOrganismos.tsx` — create flow for `organismosEstado`.
- `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` — delete flow currently uses `remove/ref/database`.
- `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` — delete flow currently uses `remove/ref/database`.
- `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` — delete flow currently uses `remove/ref/database`.
- `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` — delete flow currently uses `remove/ref/database`.
- `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.tsx` — delete flow currently uses `remove/ref/database`.
- `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` — direct realtime listener; needs the same encapsulation path.
- Matching `*.test.tsx` files under `src/presentation/components/**` — current tests mock `firebase/database` and will need to shift to the repository boundary.

### Approaches
1. **Centralized realtime repository (recommended)** — add `createRealtimeRecord`, `deleteRealtimeRecord`, and a subscription helper in `src/firebase/realtimeRepository.ts`; update `useRealtimeList` and `DashboardIncubadoras` to consume the repository, and change all add/delete components to call repository helpers.
   - Pros: all Realtime DB knowledge stays in `src/firebase/`, preserves existing paths, satisfies the isolation rule, smallest safe refactor boundary.
   - Cons: introduces one new abstraction and requires test updates.
   - Effort: Medium

2. **Partial move of CRUD only** — move add/delete calls into the repository but leave `useRealtimeList` and `DashboardIncubadoras` as direct Firebase consumers.
   - Pros: fewer immediate edits.
   - Cons: violates the encapsulation goal because hooks/UI still know Firebase; leaves the hardest coupling in place.
   - Effort: Low-Medium

### Recommendation
Proceed with **Approach 1**. It is the smallest refactor that actually meets the acceptance rule that the UI stops knowing Firebase while preserving the current realtime paths and behavior.

### Risks
- The existing tests are tightly coupled to `firebase/database` mocks and will likely need to mock the repository boundary instead.
- `DashboardIncubadoras` is structurally different from the other dashboards, so it may need a dedicated subscription helper rather than forcing it through `useRealtimeList`.
- There is no `api.md` in the repo, so the only reliable source for collection/path names is the current source code.

### Ready for Proposal
Yes. The scope is clear enough to draft the change proposal without more product clarification.
