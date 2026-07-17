# Proposal: Institutional Internal Redesign

## Intent
- **Problem**: The internal app looks inconsistent, module-first navigation feels ad hoc, destructive actions are unsafe, and shared states/components are missing.
- **Goals**: Establish an institutional-premium internal portal, improve navigation clarity, standardize core dashboard surfaces, and make one delete flow safer.
- **Target Users**: Authorities, students, and teachers using the same current interface.

## Scope
### In Scope
- Add brand/design tokens in `src/index.css`, using `#7A1C2E` as a controlled authority accent.
- Introduce shared internal shell/navigation/state primitives in `src/presentation/components/`.
- Refactor `src/presentation/screens/Home.tsx` into a dashboard-style portal with current modules preserved.
- Apply the new pattern to `DashboardUniversidades` and add a confirmation step for its existing delete action.

### Out of Scope
- Role-specific UX, permissions, or personalization before real role data exists.
- Firebase path/data-shape changes, new collections, or backend/auth behavior changes.
- Full redesign of every dashboard, modal, and add flow in this first slice.

## Capabilities
### New Capabilities
- `internal-portal-shell`: Shared shell, module navigation, section header, and reusable loading/empty/error surfaces for internal dashboards.

### Modified Capabilities
- None.

## Approach
- Follow a shell-first refresh: tokens → shared primitives → `Home` refactor → one representative dashboard.
- Keep state local/derived where possible; do not add Redux for presentation-only behavior.
- Reuse existing module list and Firebase paths; limit behavior change to safer confirmation for one delete flow.
- **Assumptions**: one shared interface remains valid for all users, `DashboardUniversidades` is the pilot pattern, and remaining dashboards ship in later slices if review size grows.

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `src/index.css` | Modified | Brand/surface/border/focus tokens |
| `src/presentation/screens/Home.tsx` | Modified | Portal shell and module metadata-driven navigation |
| `src/presentation/components/` | New/Modified | Shared shell, headers, state blocks, confirmation UI |
| `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` | Modified | Representative dashboard refresh + safer delete |
| `src/presentation/components/ButtonAdd/ButtonAdd.css` | Modified | Replace non-institutional accent usage as needed |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Slice exceeds 800-line review budget | Med | Limit to shell, `Home`, shared primitives, one dashboard |
| Visual work drifts into role logic | Low | Explicitly defer role-based UX |
| Safety change expands behavior scope | Med | Apply confirmation only to one existing delete flow |

## Rollback Plan
Revert the proposal slice files to restore the current `Home` layout, existing dashboard rendering, and prior styling; delete newly added presentation primitives if the shell pattern fails review.

## Dependencies
- Existing React/Tailwind/Firebase setup only; no new backend dependency assumed.

## Success Criteria
- [ ] `Home` reads as a professional internal portal with institutional branding and preserved module access.
- [ ] Shared shell/state primitives are reusable and adopted by `DashboardUniversidades`.
- [ ] `DashboardUniversidades` delete action requires confirmation without changing Firebase paths.
- [ ] First slice remains reviewable within the 800-line budget or is ready to split before apply.
