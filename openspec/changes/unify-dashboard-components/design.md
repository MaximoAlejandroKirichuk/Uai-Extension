# Design: Unify Dashboard Components

## Technical Approach

Extend the existing `internal-shell` pattern already used by Universidades and Crowfunding instead of adding a new generic layout. The change standardizes wrappers, cards, async states, destructive-action confirmation, and the existing floating add affordance polish while preserving current Firebase paths, Redux slices, filters, field rendering, and Spanish screen copy.

## Architecture Decisions

| Decision | Alternatives considered | Rationale |
|---|---|---|
| Reuse `SectionHeader`, `DashboardItemCard`, `DeleteIconButton`, `LoadingState`, `EmptyState`, and `ErrorState` directly | New `DashboardListLayout` abstraction | Current modules still differ in filter controls and Incubadoras stays table-based. Direct reuse keeps the diff smaller and within the 800-line review budget. |
| Centralize destructive UX with local `pendingDeleteId` + `ConfirmAction` in each deleting dashboard | Immediate delete, or modal logic inside each item card | Confirmation already exists in Universidades. Keeping modal state at dashboard level preserves existing Firebase targets and keeps item components presentational. |
| Draw the floating add “plus” with centered CSS bars in `ButtonAdd.css` | Keep a text glyph (`+`) with line-height/padding tweaks or swap to an icon font/SVG | Font glyph metrics caused optical mis-centering even when flex-centered. Two pseudo-element bars stay visually centered, reuse current theme tokens via `currentColor`, and avoid introducing a new icon dependency or behavior change. |
| Keep Incubadoras as a themed table | Force cards or extract a table primitive now | Incubadoras has dense tabular data and no delete affordance. Shell/states/tokens can be unified without harming scanability. |
| Keep Eventos as placeholder shell only | Invent data flow or CRUD affordances | Code and proposal explicitly mark Eventos as unimplemented; backend behavior is unknown and out of scope. |

## Data Flow

`useRealtimeList/onValue` (or existing Incubadoras listener) → Redux slice/local state → filter state in dashboard → shared shell state (`LoadingState`/`ErrorState`/`EmptyState`) → card grid or Incubadoras table.

Delete flow:

`DeleteIconButton` → set `pendingDeleteId` → `ConfirmAction` → `remove(ref(database, existingPath/id))` → existing alert + realtime refresh.

Floating add affordance:

`ButtonAdd` click handler stays unchanged → `ButtonAdd.css` renders horizontal + vertical pseudo-element bars → brand/background tokens remain inherited from existing variables.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/presentation/components/DashboardCapitalVentures/DashboardCapitalVentures.tsx` | Modify | Adopt shared header, filter panel, async states, and confirm-delete flow. |
| `src/presentation/components/DashboardCapitalVentures/CapitalVentures/ItemCapitalVentures.tsx` | Modify | Replace custom card/delete markup with `DashboardItemCard`. |
| `src/presentation/components/DashboardPlataformas/DashboardPlataformas.tsx` | Modify | Same shell/state/confirm migration as Capital Ventures. |
| `src/presentation/components/DashboardPlataformas/Plataformas/ItemPlataforma.tsx` | Modify | Replace ad-hoc card with `DashboardItemCard`. |
| `src/presentation/components/DashboardOrganismosEstados/DasboardOrganismosEstados.tsx` | Modify | Same shell/state/confirm migration; preserve `organismosEstado` path. |
| `src/presentation/components/DashboardOrganismosEstados/OrganismosEstados/ItemOrganismosEstados.tsx` | Modify | Replace custom card/delete/link colors with shared tokens. |
| `src/presentation/components/DashboardCrowfunding/DashboardCrowfunding.tsx` | Modify | Add `ConfirmAction` without changing existing card content or data source. |
| `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` | Modify | Keep table, but add `SectionHeader`, themed filters, shared empty/error/loading states, and tokenized table colors. |
| `src/presentation/components/DashboardEventos/DashboardEventos.tsx` | Modify | Render `SectionHeader` + `EmptyState` placeholder only. |
| `src/presentation/components/ButtonAdd/ButtonAdd.css` | Modify | Keep the existing floating add affordance but render the plus with CSS bars so it is optically centered and aligned with shared tokens. |
| `src/presentation/components/Dashboard{CapitalVentures,Plataformas,OrganismosEstados,Crowfunding,Incubadoras,Eventos}/*.test.tsx` | Create/Modify | Add module-level tests for shared states and delete confirmation where delete exists. |

## Interfaces / Contracts

No backend or entity contract changes. UI contract to standardize:

```ts
type DeleteFlow = {
  pendingDeleteId: string | null;
  onDeleteRequest: (id: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => Promise<void>;
};
```

Item components remain presentational: receive entity data plus `id` and `onDelete(id)`; they do not call Firebase directly.

`ButtonAdd` keeps its current submit/open contract; only its visual mark changes from text glyph rendering to CSS-drawn bars.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Shared render contracts for migrated modules | Vitest + RTL assertions for section headers, record counts, loading/error/empty states, and themed delete labels. |
| Integration | Confirm/cancel delete flows keep existing Firebase paths | Mock `firebase/database`, verify `ref(database, existingPath/id)` and alert behavior, mirroring `DasboardUniversidades.test.tsx`. |
| E2E | Not available | No e2e runner configured. Use `npm run test`, `npm run lint`, and `npm run build` as verification gates. |

## Migration / Rollout

No migration required. Implement module-by-module in this order: Capital Ventures, Plataformas, Organismos, Crowfunding confirmation, Incubadoras shell, Eventos placeholder. Universidades remains the reference baseline.

## Open Questions

- [ ] None blocking; verify whether module tests already exist before creating new files.
