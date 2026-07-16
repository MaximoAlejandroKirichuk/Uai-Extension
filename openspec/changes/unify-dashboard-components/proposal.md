# Proposal: Unify Dashboard Components

## Intent

Dashboard modules use mixed wrappers, cards, states, action affordances, and colors. This change unifies dashboard UI with the shared internal shell, including floating add button centering polish, without changing Firebase paths, data shapes, permissions, routes, or CRUD capabilities.

## Scope

### In Scope
- Migrate Capital Ventures, Plataformas, and Organismos Estatales cards to `DashboardItemCard` / `DeleteIconButton`.
- Use `SectionHeader`, themed filters, `LoadingState`, `EmptyState`, and `ErrorState`.
- Add `ConfirmAction` before existing deletes in Crowdfunding, Capital Ventures, Plataformas, and Organismos; preserve targets.
- Keep the existing `ButtonAdd` floating add button centered and token-aligned in `ButtonAdd.css`; no new add behavior.
- Normalize Eventos as `SectionHeader` + `EmptyState`; keep Incubadoras table-based with aligned shell/states/tokens.

### Out of Scope
- Backend behavior, Firebase collections, routes, roles, permissions, or data contracts.
- New add/delete affordances for Eventos or Incubadoras.
- Generic `DashboardListLayout` extraction.
- Spanish UI copy rewrites.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `internal-portal-shell`: Extend shared dashboard UI, delete confirmation, and action-affordance consistency.

## Approach

Reuse existing internal-shell primitives directly. Preserve fields, filters, Firebase references, action semantics, and Spanish copy while replacing ad-hoc presentation and optically centering the floating add button.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/presentation/components/DashboardCapitalVentures/` | Modified | Shared shell, cards, states, delete confirmation. |
| `src/presentation/components/DashboardPlataformas/` | Modified | Shared shell, cards, states, delete confirmation. |
| `src/presentation/components/DashboardOrganismosEstados/` | Modified | Shared shell, cards, states, confirm delete. |
| `src/presentation/components/DashboardCrowfunding/` | Modified | Existing delete gains confirmation. |
| `src/presentation/components/ButtonAdd/ButtonAdd.css` | Modified | Floating add affordance visually centered and token-aligned. |
| `src/presentation/components/DashboardEventos/DashboardEventos.tsx` | Modified | Placeholder header and empty state only. |
| `src/presentation/components/DashboardIncubadoras/DashboardIncubadoras.tsx` | Modified | Shared shell/states; table preserved. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Delete confirmation changes flow | Med | Test confirm/cancel paths and delete targets. |
| Floating add polish implies behavior | Low | Limit to `ButtonAdd.css`; keep handlers and placement semantics. |
| Eventos scope creep | Med | Keep placeholder-only until API/data behavior is specified. |

## Rollback Plan

Revert dashboard component changes, `ButtonAdd.css` polish, and the `internal-portal-shell` delta. No data/backend rollback is required.

## Dependencies

- Existing `internal-shell` primitives and `ConfirmAction`.
- Existing Firebase paths only; `api.md` is absent.

## Success Criteria

- [ ] Target modules use shared shell/cards/states where appropriate.
- [ ] Existing delete actions require confirmation and preserve current delete targets.
- [ ] Floating add affordance keeps behavior while appearing centered and aligned with shared dashboard polish.
- [ ] Eventos and Incubadoras do not gain new CRUD behavior.
- [ ] Visual language uses theme tokens instead of ad-hoc raw colors.
