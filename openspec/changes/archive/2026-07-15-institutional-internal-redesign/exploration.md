## Exploration: institutional-internal-redesign

### Current State
- The app is a React 19 + TypeScript + Vite single-page frontend with Redux Toolkit and Firebase. `src/main.tsx` wraps `App` with `BrowserRouter` and Redux `Provider`, but `src/App.tsx` does not declare route objects; it conditionally renders `Home` or `Login` from `state.user.value.user`.
- Authentication is Firebase email/password only. `src/hooks/useAuth.ts` maps Firebase user data to `User` with only `emailUser`, `token`, and `localId`; `src/core/entities/user.entity.ts` has no role, authority, student, teacher, or permission fields. Role-specific UX should therefore remain out of scope until real role data exists.
- `src/presentation/screens/Home.tsx` is the current internal entry point. It uses local `active` state and hardcoded module tabs for Universidades, Crowfunding, Capital Ventures, Plataformas, Organismos estados, Eventos, and Incubadoras. Tabs use `bg-blue-600`; the desired brand color `#7A1C2E` is not currently present.
- Styling is mostly inline Tailwind utility classes plus a small global import in `src/index.css` (`@import "tailwindcss"`). Modal/floating-button/loading styles live in local CSS files (`ButtonAdd.css`, `loadingComponent.css`) and use non-institutional accent colors such as `#25D366`, `#e30000`, blue, indigo, and Uiverse loading dots.
- Shared UI primitives are minimal: `Pressable`, `ModalForm`, `LoadingComponent`, `useModalForm`, and `useRealtimeList`. There is no shared app shell, module navigation component, card/table primitive, empty state, error state, destructive-action confirmation, or design token layer.
- Most module dashboards duplicate structure: Redux selector, search input, `useRealtimeList`, Firebase Realtime Database delete via `remove(ref(database, path/id))`, `alert()` success/error feedback, and grid cards. `DashboardIncubadoras` is the strongest internal-data pattern: explicit loading/error/empty/filter states, a table layout, counts, sorting, and memoized filters.
- Destructive actions are unsafe today. Dashboards call Firebase `remove` directly (`DashboardUniversidades`, `DashboardCrowfunding`, `DashboardCapitalVentures`, `DashboardPlataformas`, `DasboardOrganismosEstados`) from trash emoji buttons in item cards, with no confirmation step, no pending state, and only `alert()` feedback.
- Loading/error/empty states are inconsistent. Some dashboards render `LoadingComponent` and raw red error text but no empty state; `DashboardIncubadoras` handles empty and no-results states. `useRealtimeList` logs read errors but does not dispatch `setError`, so shared list slices can expose `error` while the generic hook never sets it.
- Firebase usage is Realtime Database for dashboard data and Auth for login. Firestore is initialized in `firebaseConfig.ts` but not relevant to the current dashboard redesign. Existing collection/path strings must not be invented or changed during a visual redesign.

### Affected Areas
- `src/presentation/screens/Home.tsx` — primary target for the internal portal shell, module navigation, active module metadata, and institutional layout.
- `src/presentation/components/` — likely home for shared primitives: app shell, module navigation, section header, data state components, cards/tables, confirmation dialog, and brand-aware buttons.
- `src/presentation/components/Dashboard*/` — dashboards need consistent headers, filters, content containers, loading/error/empty states, and safer destructive action wiring without changing Firebase paths.
- `src/presentation/components/ButtonAdd*/` and `src/presentation/components/ModalForm/ModalForm.tsx` — add flows currently share CSS but duplicate form patterns; first redesign slice should only restyle shell/modal/button primitives unless form behavior is explicitly in scope.
- `src/presentation/components/ButtonAdd/ButtonAdd.css` and `src/presentation/components/loading/loadingComponent.css` — contain non-tokenized colors and modal/loading styles; candidates for consolidation or gradual replacement with Tailwind/tokenized classes.
- `src/index.css` — the right place for Tailwind 4 theme variables/design tokens such as institutional brand, surface, border, muted, danger, focus, and text colors.
- `src/store/slices/createListSlice.ts` and `src/hooks/useRealtimeList.ts` — affected only if the redesign proposal includes consistent async error behavior; otherwise keep state behavior unchanged in the first visual slice.
- `src/core/entities/user.entity.ts` and `src/store/slices/user/userSlice.ts` — should not be expanded for roles in this change unless backend/Firebase role data is formally specified later.

### Approaches
1. **Shell-first institutional refresh** — Introduce brand tokens, a reusable internal app shell, module navigation, page header, and shared state primitives, then adapt `Home` and one representative dashboard.
   - Pros: Best fit for the 800-line review budget; creates reusable foundations; avoids backend/role invention; visibly moves the product toward an internal portal.
   - Cons: Leaves some dashboards visually mixed until later slices; requires careful component boundaries to avoid half-finished abstractions.
   - Effort: Medium.

2. **Dashboard-by-dashboard full redesign** — Redesign every dashboard/card/table/add button at once using the new visual system.
   - Pros: Most consistent end-user result in one delivery; easier to judge final visual direction.
   - Cons: High review risk, likely over 800 changed lines; repeated Firebase/delete/form code increases regression surface; harder to isolate visual from behavior changes.
   - Effort: High.

3. **Token-only cosmetic pass** — Add brand tokens and replace obvious blue/green/indigo colors while keeping the current layout and components.
   - Pros: Low risk and small diff; improves brand alignment quickly.
   - Cons: Does not solve portal structure, shared UI primitives, empty/loading/error inconsistency, or destructive-action safety; mostly cosmetic.
   - Effort: Low.

### Recommendation
Prefer **Approach 1: Shell-first institutional refresh**. It matches the prior audit: professional internal portal/dashboard, controlled institutional accent usage, module navigation, shared primitives, consistent state surfaces, and safer destructive actions, without inventing role behavior.

Recommended first slice within the 800-line review budget:
- Add a small token layer in `src/index.css` for `#7A1C2E` as controlled brand accent plus neutral/danger/surface/focus tokens.
- Add shared presentation primitives under `src/presentation/components/` for an internal shell, module navigation, dashboard section/header, and reusable loading/empty/error state blocks.
- Refactor `Home.tsx` to use module metadata and the new shell/navigation while preserving the current module list and active-state behavior.
- Apply the shared state/header pattern to one representative dashboard (recommend `DashboardUniversidades`) and introduce a reusable destructive confirmation path for its delete action only, then replicate in later chained slices.

### Risks
- Role-specific UX is tempting but unsafe: there is no role/permission field in `User`, no role search hits in source, and no verified backend contract in this exploration.
- Tailwind 4 is configured through `@tailwindcss/vite` and only `src/index.css`; token work should use Tailwind 4-compatible CSS variables/theme patterns, not assume a legacy `tailwind.config.js`.
- Firebase Realtime Database paths are hardcoded in dashboards and forms; visual redesign must not rename paths or change data shape.
- A one-shot redesign of all dashboards/forms can exceed the 800-line review budget and mix visual, state, and Firebase behavior changes.
- Current destructive deletes use direct `remove()` calls and `alert()` feedback; adding confirmation improves safety but can become a behavioral change if applied broadly without focused review.
- Loading/error behavior is inconsistent because `useRealtimeList` logs read errors without dispatching `setError`; fixing it is useful but should be scoped as a separate behavior slice if needed.

### Ready for Proposal
Yes. The orchestrator should tell the user to propose a shell-first institutional internal portal redesign, explicitly deferring role-specific personalization until backend/Firebase role data is available. The proposal should define a first PR slice limited to tokens, app shell/module navigation, shared states, `Home`, and one representative dashboard/destructive confirmation path, with later chained slices for remaining dashboards and forms.
