# Delta for internal-portal-shell

## ADDED Requirements

### Requirement: Reusable Dashboard Item Cards

Card-based dashboards (Capital Ventures, Plataformas, Organismos Estatales) MUST render items through a shared `DashboardItemCard` primitive with a shared `DeleteIconButton` affordance when delete is available. Modules MUST NOT re-implement local card markup that duplicates the shared primitive.

#### Scenario: Module renders shared cards

- GIVEN a card-based dashboard module renders its items
- WHEN the list has records
- THEN each item MUST render via `DashboardItemCard` with no module-local card wrapper

#### Scenario: Delete affordance is consistent

- GIVEN a card module exposes delete
- WHEN the delete control renders
- THEN it MUST use `DeleteIconButton` with identical icon, size, and focus styling across modules

### Requirement: Shared Dashboard Title Treatment

Dashboard item titles MUST use the shared institutional title token/color from `internal-portal-shell` instead of ad-hoc module colors. Module-local accent colors on titles MUST NOT be reintroduced.

#### Scenario: Item title uses shared token

- GIVEN a dashboard item card renders a title
- WHEN the title is displayed
- THEN its color MUST resolve through the shared institutional title token, not a module-specific hex/class

#### Scenario: No ad-hoc title color returns

- GIVEN a module previously styled titles with a local color
- WHEN the unified shell renders
- THEN no module-local title color class MUST remain on item titles

### Requirement: Placeholder-Only Module Surface (Eventos)

`DashboardEventos` MUST render only a shared `SectionHeader` and `EmptyState` placeholder. It MUST NOT expose create, delete, list, filter, or backend behavior beyond its current placeholder behavior.

#### Scenario: Eventos shows placeholder only

- GIVEN a user opens Eventos
- WHEN the panel renders
- THEN it MUST show only a header and empty-state surface and MUST NOT present CRUD controls

### Requirement: Table-Preserving Shell Adoption (Incubadoras)

`DashboardIncubadoras` MUST adopt the shared shell, `SectionHeader`, themed filter panel, and shared async states while preserving its current table layout. It MUST NOT be forced into card layout.

#### Scenario: Incubadoras keeps table under shared shell

- GIVEN Incubadoras renders
- WHEN it lists records
- THEN it MUST keep the existing table layout inside the shared shell with shared states

#### Scenario: Incubadoras shares async surfaces

- GIVEN Incubadoras fetch is pending, empty, or failed
- WHEN the surface renders
- THEN it MUST use the shared `LoadingState`, `EmptyState`, and `ErrorState` primitives

### Requirement: Floating Dashboard Add Action Affordance Consistency

The existing floating `ButtonAdd` add action affordance MUST keep its `+` glyph optically centered within its circular surface and MUST resolve all colors through shared brand design tokens (`--color-brand`, `--color-brand-contrast`) instead of raw hex values. The affordance MUST NOT introduce new add behavior, placement semantics, handlers, or backend calls; consistency is limited to visual centering and token alignment within `ButtonAdd.css`.

#### Scenario: Icon is optically centered

- GIVEN the floating add affordance renders its circular surface
- WHEN the `+` glyph is composed through the existing pseudo-element geometry
- THEN the glyph MUST be centered via a centering transform (`translate(-50%, -50%)`) rather than static offsets, so it appears visually centered on both axes

#### Scenario: Colors resolve through tokens

- GIVEN the floating add affordance paints its surface and glyph
- WHEN its background and foreground colors resolve
- THEN they MUST come from `--color-brand` and `--color-brand-contrast` tokens with no module-local or raw hex overrides

#### Scenario: Affordance gains no new behavior

- GIVEN the visual-centering and token-alignment polish is applied
- WHEN the user interacts with the floating add button
- THEN the existing add handler, fixed placement, and module targeting MUST remain unchanged and no new CRUD affordance is introduced

## MODIFIED Requirements

### Requirement: Shared Dashboard Pattern

Card-based dashboards (Capital Ventures, Plataformas, Organismos Estatales) MUST adopt the shared shell, `SectionHeader`, themed filter panels, and shared `LoadingState`, `EmptyState`, and `ErrorState`. `DashboardUniversidades` remains the reference pattern. Dashboards MUST NOT change Firebase paths, collections, data shape, fields, or Spanish copy.
(Previously: Pilot pattern scoped only to DashboardUniversidades.)

#### Scenario: Card modules reuse shared primitives

- GIVEN a card-based dashboard is refreshed
- WHEN it renders
- THEN it MUST use the shared shell, header, filter panel, and state blocks instead of local equivalents

#### Scenario: Data contract preserved

- GIVEN a card dashboard reads its current data source
- WHEN it lists records
- THEN it MUST use existing Firebase paths and the current result shape

#### Scenario: Existing filters and copy preserved

- GIVEN a card module had its own filters and Spanish copy
- WHEN the unified shell renders
- THEN existing filters, fields, and Spanish copy MUST remain unchanged

### Requirement: Safe Destructive Action UX

Existing delete actions in `DashboardUniversidades`, Crowdfunding, Capital Ventures, Plataformas, and Organismos Estatales MUST require explicit confirmation via `ConfirmAction` before executing. Confirmation MUST NOT alter the delete's effective behavior, Firebase path, or permissions.
(Previously: Confirmation scoped only to the DashboardUniversidades pilot.)

#### Scenario: Confirmation gates the delete

- GIVEN a user triggers an existing delete in a covered module
- WHEN the confirmation step is shown
- THEN the destructive action MUST NOT execute until the user confirms

#### Scenario: Cancel preserves data

- GIVEN the confirmation step is open
- WHEN the user cancels
- THEN the target record MUST remain and the list MUST stay unchanged

#### Scenario: Confirm does not change scope

- GIVEN the user confirms the delete
- WHEN the action runs
- THEN it MUST use the existing delete path and MUST NOT delete beyond the targeted record

#### Scenario: Consistent delete affordance

- GIVEN a covered card module renders delete
- WHEN the control is shown
- THEN it MUST use the shared `DeleteIconButton` and `ConfirmAction` flow