# Tasks: Unify Dashboard Components

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,335 |
| 800-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | auto-forecast (→ auto-chain) |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
800-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Capital Ventures shell/card/confirm + tests | PR 1 | base = main or tracker; establishes migration pattern |
| 2 | Plataformas shell/card/confirm + tests | PR 2 | same mechanical pattern as PR 1 |
| 3 | Organismos shell/card/confirm + tests | PR 3 | same mechanical pattern; replace ad-hoc title colors |
| 4 | Crowdfunding confirm + Incubadoras shell + Eventos placeholder + tests | PR 4 | remaining modules; independent of PR 2-3 order |

## Phase 0: Visual Consistency / Token Alignment

- [x] 0.1 `ButtonAdd.css` — center `.floating-button` via flexbox; replace raw colors with `--color-brand` / `--color-brand-contrast` / `--color-surface-elevated` / `--color-border` / `--color-danger` tokens; swap text `+` for CSS-drawn cross icon

## Phase 1: Card-Based Module Migration

- [x] 1.1 `DashboardCapitalVentures.tsx` — adopt SectionHeader, shared filter panel, LoadingState/ErrorState/EmptyState, pendingDeleteId + ConfirmAction
- [x] 1.2 `ItemCapitalVentures.tsx` — wrap in DashboardItemCard with DeleteIconButton; use `--color-text` for title
- [x] 1.3 `DashboardPlataformas.tsx` — same shell/state/confirm migration as 1.1
- [x] 1.4 `ItemPlataforma.tsx` — same DashboardItemCard migration as 1.2
- [x] 1.5 `DasboardOrganismosEstados.tsx` — same shell/state/confirm migration as 1.1
- [x] 1.6 `ItemOrganismosEstados.tsx` — same DashboardItemCard migration as 1.2; replace `text-indigo-700` and raw link color with shared tokens

## Phase 2: Remaining Module Changes

- [x] 2.1 `DashboardCrowfunding.tsx` — add ConfirmAction with pendingDeleteId, delete confirm/cancel handlers; keep existing shell
- [x] 2.2 `DashboardIncubadoras.tsx` — wrap in SectionHeader; adopt LoadingState/ErrorState/EmptyState; preserve table layout and onValue listener
- [x] 2.3 `DashboardEventos.tsx` — replace body with SectionHeader + EmptyState placeholder; no CRUD controls

## Phase 3: Tests

- [x] 3.1 `DashboardCapitalVentures.test.tsx` — shared states, SectionHeader, confirm/cancel delete, Firebase path `capitalVentures/{id}`
- [x] 3.2 `DashboardPlataformas.test.tsx` — same coverage with path `plataformas/{id}`
- [x] 3.3 `DasboardOrganismosEstados.test.tsx` — same coverage with path `organismosEstado/{id}`
- [x] 3.4 `DashboardCrowfunding.test.tsx` — confirm/cancel delete with path `crowfundings/{id}`
- [x] 3.5 `DashboardIncubadoras.test.tsx` — shared states, SectionHeader, table layout preserved
- [x] 3.6 `DashboardEventos.test.tsx` — SectionHeader + EmptyState only, no delete/CRUD affordances

## Phase 4: Verification

- [x] 4.1 Run `npm run test` — all dashboard tests pass
- [x] 4.2 Run `npm run lint` — no new warnings
- [x] 4.3 Run `npm run build` — no TypeScript or build errors
- [x] 4.4 Visual: ButtonAdd button renders centered with token-aligned colors and CSS-drawn cross icon; verified via build/lint
