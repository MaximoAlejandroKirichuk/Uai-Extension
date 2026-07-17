# Apply Progress: Institutional Internal Redesign (First Slice)

## Status
Completed — first slice implemented; remediation added Vitest coverage and Spanish UI copy cleanup.

## Completed Tasks
- [x] 1.1 Add CSS custom property tokens to `src/index.css` for brand (`#7A1C2E`), surface, border, text, focus, and danger colors
- [x] 1.2 Create `src/presentation/components/internal-shell/InternalPortalShell.tsx` — shared shell wrapper with branded header and content slot
- [x] 1.3 Create `src/presentation/components/internal-shell/ModuleNav.tsx` — metadata-driven navigation accepting `HomeModuleConfig[]`
- [x] 1.4 Create `src/presentation/components/internal-shell/SectionHeader.tsx` — branded section header with title and optional action slot
- [x] 1.5 Create `src/presentation/components/internal-shell/AsyncStates.tsx` — reusable `LoadingState`, `EmptyState`, `ErrorState` surfaces
- [x] 1.6 Create `src/presentation/components/confirmation/ConfirmAction.tsx` — reusable confirmation dialog with open/confirm/cancel/pending states per `ConfirmActionProps`
- [x] 1.7 Create barrel exports in `internal-shell/index.ts` and `confirmation/index.ts`
- [x] 2.1 Refactor `src/presentation/screens/Home.tsx` — define `HomeModuleConfig[]` metadata, compose via `InternalPortalShell` + `ModuleNav`, preserve all module routes
- [x] 2.2 Modify `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` — adopt `SectionHeader` + `AsyncStates`, wire `ConfirmAction` for delete, keep existing Firebase reads/filters
- [x] 2.3 Modify `src/presentation/components/DashboardUniversidades/Universidades/ItemUniversidad.tsx` — replace emoji-only delete button with accessible button triggering confirmation
- [x] 2.4 Modify `src/presentation/components/ButtonAdd/ButtonAdd.css` — retokenize hard-coded `#25D366` to use CSS custom properties

## Verification
- `npm run build` ✅ passed
- `npm run lint` ✅ passed after minimal cleanup in shared hooks/entities:
  - `src/core/entities/eventoEndeavor.entity.ts` — replaced empty interface with a type alias
  - `src/hooks/useForm.ts` — replaced `any` with `unknown`
  - `src/hooks/useRealtimeList.ts` — destructured options to satisfy exhaustive-deps
- Structural verification completed for `Home`, `DashboardUniversidades`, and async state surfaces.

## Notes
- The pilot confirmation flow is scoped only to `DashboardUniversidades`.
- Firebase paths and data shapes were preserved.
- Role-specific UX remains out of scope.
- Build still reports the existing non-blocking Vite bundle-size warning.

## Remediation Addendum
- Added `npm run test` with Vitest + jsdom setup.
- Added focused tests for `Home`, `ConfirmAction`, `DashboardUniversidades`, and `ItemUniversidad`.
- Translated redesign-visible UI copy to Spanish and removed the dead `/src/styles.css` link.
