# Design: Institutional Internal Redesign

## Technical Approach

Implement the first slice as a presentation-only foundation: Tailwind 4 tokens in `src/index.css`, a shared internal portal shell in `src/presentation/components/`, a metadata-driven `Home` refactor, and one pilot adoption in `DashboardUniversidades`. Firebase reads/writes, module coverage, and current paths remain unchanged; only the universidades delete flow gains a confirmation gate.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice / Rationale |
|---|---|---|---|
| Shell composition | Keep `Home` monolithic; add shared shell primitives | Monolith is faster now but blocks reuse across dashboards | Create thin shared primitives (`InternalPortalShell`, `ModuleNav`, `SectionHeader`, async state blocks`) so `Home` stays orchestration-only and later dashboards can reuse the same structure. |
| Styling strategy | Hard-coded utilities; `tailwind.config`; CSS variable tokens | Hard-coded colors drift; config file does not exist in Tailwind 4 setup | Define CSS custom properties in `src/index.css` and consume them through Tailwind arbitrary values/classes. This matches the current `@tailwindcss/vite` setup and keeps `#7A1C2E` a controlled accent. |
| State ownership | Redux for shell state; local `useState` | Redux would add global complexity for view-only state | Keep active module, filters, and confirmation dialog state local. Reuse current Redux slices only for fetched list data, per repo state rules. |
| Delete confirmation | Native `window.confirm`; reusable dialog primitive | Native confirm is cheap but visually inconsistent | Add a lightweight reusable confirmation component under presentation components, but wire it only in `DashboardUniversidades` for this slice to limit behavior scope. |

## Data Flow

`App` → `Home` → `InternalPortalShell` → `ModuleNav` + active module content  
`DashboardUniversidades` → local filters + `useRealtimeList("universidades")` → Redux slice (`fetchUniversidades`) → filtered items → shared state/content surfaces → `ItemUniversidad`

Delete flow:

`ItemUniversidad delete button` → local pending target state → confirmation dialog → `remove(ref(database, "universidades/${id}"))` → Firebase update rehydrates list through existing `onValue` subscription.

Constraints:
- Do not rename Firebase paths, collections, or entity fields.
- Do not add role-aware branches; `User` has no role data.
- Do not move list-fetch ownership out of existing slices/hooks in this slice.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/index.css` | Modify | Add Tailwind 4-compatible CSS tokens for brand, surface, border, text, focus, and danger. |
| `src/presentation/screens/Home.tsx` | Modify | Replace hard-coded buttons/render branches with module metadata + shared shell composition. |
| `src/presentation/components/internal-shell/*` | Create | Shell, nav, section header, and async state primitives for internal dashboards. |
| `src/presentation/components/confirmation/*` | Create | Reusable confirmation dialog/panel primitive for destructive actions. |
| `src/presentation/components/DashboardUniversidades/DasboardUniversidades.tsx` | Modify | Adopt shared header/state layout and pilot confirmation flow. |
| `src/presentation/components/DashboardUniversidades/Universidades/ItemUniversidad.tsx` | Modify | Replace emoji-only destructive affordance with accessible button wiring. |
| `src/presentation/components/ButtonAdd/ButtonAdd.css` | Modify | Retokenize floating action and modal colors to match the new system without changing add behavior. |
| `src/presentation/components/ModalForm/ModalForm.tsx` | Modify | Consume shared modal/button styling hooks/classes if needed for consistency. |

## Interfaces / Contracts

```ts
type HomeModuleKey =
  | "universidades"
  | "crowfunding"
  | "capitalVentures"
  | "Plataformas"
  | "Organismos estados"
  | "Eventos"
  | "Incubadoras";

interface HomeModuleConfig {
  key: HomeModuleKey;
  label: string;
  render: () => React.ReactNode;
}

interface ConfirmActionProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Module metadata rendering and confirmation state transitions | Add component-level tests only if a runner is introduced later; otherwise keep logic small and reviewable. |
| Integration | `Home` shell composition and universidades confirmation wiring | Validate manually plus `npm run build` and `npm run lint`; no automated integration runner exists today. |
| E2E | Login → Home → universidades delete cancel/confirm | Manual QA only for this slice; no E2E framework is installed. |

## Migration / Rollout

No migration required. Roll out as a single UI slice behind the existing authenticated `Home` entry point.

## Open Questions

- [ ] Should the new internal shell primitives live in `src/presentation/components/internal-shell/` or a flatter `src/presentation/components/InternalPortal/` naming scheme?
- [ ] Should the pilot confirmation surface be a modal dialog or an inline confirmation panel near the selected card, given the current mobile layout?
