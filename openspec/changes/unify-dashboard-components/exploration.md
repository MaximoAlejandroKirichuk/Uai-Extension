## Exploration: unify-dashboard-components

### Current State
The internal portal (`src/presentation/screens/Home.tsx`) exposes seven modules: Universidades, Financiamiento colectivo, Capital de riesgo, Plataformas, Organismos estatales, Eventos, and Incubadoras. Only **Universidades** and **Financiamiento colectivo** have been migrated to the new shared shell components introduced in the recent redesign:

- `DashboardItemCard` and `DeleteIconButton` from `src/presentation/components/internal-shell/DashboardItemCard.tsx`
- `SectionHeader`, `LoadingState`, `EmptyState`, `ErrorState` from `src/presentation/components/internal-shell/`
- `ConfirmAction` confirmation dialog from `src/presentation/components/confirmation/ConfirmAction.tsx`
- Theme variables from `src/index.css` (`--color-brand`, `--color-text`, `--color-danger`, etc.)

The remaining five modules still use ad-hoc card markup, inconsistent title colors, raw Tailwind grays, and immediate-delete buttons without confirmation or accessible labels. Eventos is an empty placeholder; Incubadoras renders a table instead of cards and has no delete affordance.

### Affected Areas
- `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` — no `SectionHeader`, no shared async states, no confirmation, raw search input.
- `src/presentation/components/DashboardCapitalVentures/CapitalVentures/ItemCapitalVentures.tsx` — custom card (`border rounded p-4 shadow`), `text-blue-700` title, inline emoji delete button.
- `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` — same wrapper gaps as Capital Ventures.
- `src/presentation/components/DashboardPlataformas/Plataformas/ItemPlataforma.tsx` — same card/delete gaps as `ItemCapitalVentures`.
- `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.tsx` — same wrapper gaps.
- `src/presentation/components/DashboardOrganismosEstados/OrganismosEstados/ItemOrganismosEstados.tsx` — custom card, `text-indigo-700` title, inline emoji delete button.
- `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` — already uses `DashboardItemCard` and `SectionHeader`, but deletes immediately without `ConfirmAction`.
- `src/presentation/components/DashboardEventos/DashboardEventos.tsx` — empty shell; needs `SectionHeader` and `EmptyState`.
- `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` — uses table layout, `text-blue-700` row link, `LoadingComponent`, no `SectionHeader`, no shared empty/error states.
- `src/presentation/screens/Home.tsx` — Eventos and Incubadoras have no add buttons; likely out of scope unless backend/UX intent is clarified.
- Existing tests for Universidades (`DasboardUniversidades.test.tsx`, `ItemUniversidad.test.tsx`) already encode the expected shared delete UX and can serve as the reference contract.

### Approaches
1. **Replace custom cards/items with existing shared components (recommended)**
   - Swap custom card markup in Capital Ventures, Plataformas, and Organismos items for `DashboardItemCard` + `DeleteIconButton`.
   - Swap raw dashboard wrappers in those modules for `SectionHeader` + shared async states (`LoadingState`/`EmptyState`/`ErrorState`).
   - Add `ConfirmAction` to Crowdfunding, Capital Ventures, Plataformas, and Organismos so every delete flow matches Universidades.
   - Update Eventos with `SectionHeader` + `EmptyState`; update Incubadoras with `SectionHeader`, async states, and theme-colored table cells.
   - Pros: Low abstraction risk, uses components that already exist and are tested, preserves per-module field layouts.
   - Cons: Some duplication remains across dashboard wrappers (search panel, grid container). Effort: **Medium**.

2. **Introduce a generic `DashboardListLayout` shell**
   - Build a reusable layout component that accepts title, description, filter UI slot, async state, and item renderer.
   - Pros: DRY, future modules get consistency for free, enforces one visual pattern.
   - Cons: Generic composition can become awkward when modules need different filter shapes (select + text, single text, etc.) or when Incubadoras needs a table. Adds abstraction before the baseline is stable. Effort: **Medium-High**.

### Recommendation
Proceed with **Approach 1**. The shared `internal-shell` components already express the target design; the work is largely mechanical replacement. This keeps the diff reviewable within the 800-line budget and avoids premature generic abstractions. If after unification the wrappers still look repetitive, a follow-up change can extract a `DashboardListLayout` shell.

### Risks
- **Behavior change**: Adding `ConfirmAction` to Crowdfunding, Capital Ventures, Plataformas, and Organismos changes delete UX from immediate to confirmed. This is a UX improvement but must be reflected in any existing tests.
- **Incubadoras scope**: It renders a dense data table, not a card grid. Cards may not fit its 8-column dataset; keep the table, apply shell header/states, and only normalize the link color.
- **Eventos backend**: Eventos is an unimplemented placeholder (TODO in code). Adding real data/delete UI would require backend/API clarity; UI unification should be limited to header + empty state.
- **Test churn**: Tests for Capital Ventures, Plataformas, and Organismos may need new mocks and assertions for shared async states and delete confirmation.
- **Add buttons**: Eventos and Incubadoras currently have no add buttons. Adding them is out of scope unless product intent is confirmed, because it implies new Firebase writes.

### Ready for Proposal
**Yes.** The orchestrator should ask the user two clarifying questions before moving to `sdd-propose`:
1. Should delete confirmation (`ConfirmAction`) be added to every module that currently deletes immediately?
2. Should Eventos and Incubadoras receive add/delete affordances now, or is UI shell/header unification sufficient for those two modules?
