# Tasks: Institutional Internal Redesign (First Slice)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350–450 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

## Phase 1: Design Tokens & Shared Primitives

- [x] 1.1 Add CSS custom property tokens to `src/index.css` for brand (`#7A1C2E`), surface, border, text, focus, and danger colors
- [x] 1.2 Create `src/presentation/components/internal-shell/InternalPortalShell.tsx` — shared shell wrapper with branded header and content slot
- [x] 1.3 Create `src/presentation/components/internal-shell/ModuleNav.tsx` — metadata-driven navigation accepting `HomeModuleConfig[]`
- [x] 1.4 Create `src/presentation/components/internal-shell/SectionHeader.tsx` — branded section header with title and optional action slot
- [x] 1.5 Create `src/presentation/components/internal-shell/AsyncStates.tsx` — reusable `LoadingState`, `EmptyState`, `ErrorState` surfaces
- [x] 1.6 Create `src/presentation/components/confirmation/ConfirmAction.tsx` — reusable confirmation dialog with open/confirm/cancel/pending states per `ConfirmActionProps`
- [x] 1.7 Create barrel exports in `internal-shell/index.ts` and `confirmation/index.ts`

## Phase 2: Home Refactor & Dashboard Pilot

- [x] 2.1 Refactor `src/presentation/screens/Home.tsx` — define `HomeModuleConfig[]` metadata, compose via `InternalPortalShell` + `ModuleNav`, preserve all module routes
- [x] 2.2 Modify `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` — adopt `SectionHeader` + `AsyncStates`, wire `ConfirmAction` for delete, keep existing Firebase reads/filters
- [x] 2.3 Modify `src/presentation/components/DashboardUniversidades/Universidades/ItemUniversidad.tsx` — replace emoji-only delete button with accessible button triggering confirmation
- [x] 2.4 Modify `src/presentation/components/ButtonAdd/ButtonAdd.css` — retokenize hard-coded `#25D366` to use CSS custom properties

## Phase 3: Verification

- [x] 3.1 Run `npm run build` and `npm run lint` — zero errors
- [x] 3.2 Verify `Home` renders as branded portal with all 7 modules accessible and responsive mobile/desktop
- [x] 3.3 Verify `DashboardUniversidades` loads data, filters work, delete requires confirmation, cancel preserves data
- [x] 3.4 Verify async states: loading spinner renders while fetching, error on failure (no stack trace), empty state on zero results
