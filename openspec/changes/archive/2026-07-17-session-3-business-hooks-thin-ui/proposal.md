# Proposal: Session 3 Business Hooks Thin UI

## Intent
- Reduce dashboard orchestration responsibilities by moving realtime list/delete async behavior into reusable business hooks.
- Keep Redux for shared lists and Firebase as the data boundary; this slice is a low-risk refactor, not a data-layer rewrite.

## Scope
### In Scope
- Expand `useRealtimeList` to drive `loading` and `error` through existing Redux list actions.
- Introduce a reusable delete-confirmation business hook so dashboards stop owning delete async details.
- Migrate current realtime dashboards to the same async contract, including the `DashboardIncubadoras` outlier.

### Out of Scope
- Removing Redux, replacing Firebase, or changing Realtime paths/data shape.
- Optional presentational splits or layout unification beyond the current first slice; `DashboardIncubadoras` may keep its table UI.

## Capabilities
### New Capabilities
- `dashboard-business-hooks`: shared list/delete orchestration hooks for realtime dashboards with explicit loading, error, confirmation, and pending states.

### Modified Capabilities
- `firebase-realtime-boundary`: dashboards MUST consume business hooks instead of direct repository delete/subscription calls while Firebase access stays in `src/firebase/`.
- `internal-portal-shell`: shared loading/empty/error behavior extends consistently across realtime dashboards without forcing one visual layout.

## Assumptions
- Existing list slices already expose `fetch*`, `setLoading`, and `setError` actions.
- No `api.md` was found; current source and OpenSpec are the verified contract baseline.

## Approach
- Keep repository helpers and Redux slices intact; widen `useRealtimeList` to accept list, loading, and error actions plus normalized error copy.
- Add a reusable delete business hook built on `deleteRealtimeRecord` and `ConfirmAction`.
- Implement in two levels: first lock the pattern with `DashboardUniversidades`, then port `Crowfunding`, `Plataformas`, `CapitalVentures`, and align `Incubadoras` to the same async model while preserving its table view.

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useRealtimeList.ts` | Modified | Centralize list loading/error orchestration |
| `src/hooks/` | New | Add reusable delete-confirmation business hook |
| `src/presentation/components/Dashboard*/` | Modified | Thin dashboards, remove direct async ownership |
| `src/store/slices/*` | Modified | Reuse existing loading/error actions where needed |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Hook contract drift across modules | Med | Migrate Universidades first, then reuse the same hook API |
| Incubadoras table causes extra churn | Med | Preserve table layout; align only async ownership/state rules |

## Rollback Plan
Revert the new hook signatures and dashboard migrations, restoring per-dashboard delete handlers and current subscriptions. Because Redux slices and Firebase repository paths stay unchanged, rollback is code-only.

## Dependencies
- Existing Redux list slices and `ConfirmAction`
- `src/firebase/realtimeRepository.ts` remains the only Firebase boundary

## Success Criteria
- [ ] Dashboards do not make Firebase calls or own delete async details directly.
- [ ] Loading/error behavior is consistent across migrated realtime modules.
- [ ] `DashboardIncubadoras` follows the shared async contract without losing its current table UX.
