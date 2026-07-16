# Design: Production Quick Wins

## Technical Approach

Implement the quick wins as a small ownership cleanup, not a feature rewrite. `useTimedMessage` will own transient feedback lifecycle and timer cleanup, `useModalForm` will keep modal visibility only, `ModalForm` will become pending-aware, and login will submit through one form path backed by `useAuth` loading/error state. This follows the proposal, preserves Firebase usage in `src/firebase/`, and keeps form/timer state local instead of adding Redux.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|---|---|---|---|
| Timed modal feedback ownership | Keep timers inside each `ButtonAdd*`; move timers to a shared hook | Create `src/hooks/useTimedMessage.ts` | Current `setTimeout` logic is duplicated and never cleaned up. A hook centralizes reset, restart, and unmount cleanup without changing Firebase writes. |
| Modal hook scope | Keep `useModalForm` as visibility + message state; slim it to visibility only | Slim `useModalForm` | Visibility is reusable UI state; feedback timing is separate behavior. Splitting responsibilities reduces coupling and matches the repo rule to avoid side effects in generic UI helpers. |
| Pending UX in modal forms | Let each caller disable controls; make `ModalForm` own the shell behavior | Add `pending`, `pendingLabel`, and disabled close/submit handling to `ModalForm` | The risk is duplicate submit during save. Centralizing the shell behavior keeps every `ButtonAdd*` flow consistent and prevents partial adoption. |
| Login submit ownership | Keep current form + dead button handler; move submit into button click | Keep `<form onSubmit>` as the only live path | `Login.tsx` already has a form. One submit path is simpler, keyboard-safe, and easier to guard with `loading` and `error` state in `useAuth`. |

## Data Flow

`ButtonAdd*` submit flow:

    ButtonAdd* form ──submit──> Firebase push
           │                     │
           │ success/error       │
           └──> useTimedMessage <┘
                    │
               ModalForm message + pending state

`Login` flow:

    Login <form onSubmit> ──> useAuth.onSubmit ──> Firebase Auth signIn
              │                    │                     │
              └── input change ───> formData       success -> dispatch + navigate
                                   loading/error   failure -> inline error

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useTimedMessage.ts` | Create | Store `message`, expose `showMessage`/`clearMessage`, restart timeout on new success message, and clear timeout on unmount. |
| `src/hooks/useModalForm.ts` | Modify | Remove `message`, `setMessage`, and `CloseOptions`; keep `isOpen`, `open`, `close`, `toggle`. |
| `src/presentation/components/ModalForm/ModalForm.tsx` | Modify | Accept `pending`, `pendingLabel`, `closeLabel?`, and disable overlay close, close button, and submit button while pending. |
| `src/presentation/components/ButtonAdd*/ButtonAdd*.tsx` | Modify | Replace direct timers with `useTimedMessage`, add local `pending` state around `push`, and pass pending props into `ModalForm`. |
| `src/hooks/useAuth.ts` | Modify | Expose `{ formData, loading, error, onSubmit, onInputChange }`, ignore duplicate submits while loading, keep Firebase auth + Redux dispatch + navigation unchanged. |
| `src/presentation/screens/Login.tsx` | Modify | Remove dead button click path, render loading/error state from `useAuth`, and use a semantic submit button path only. |
| `src/presentation/components/Pressable.tsx` | Modify | Support `type="submit"` and `disabled` so login can reuse the existing button component without click-driven submit logic. |

## Interfaces / Contracts

```ts
type TimedMessage = { type: "success" | "error"; text: string };

type UseTimedMessageResult = {
  message: TimedMessage | null;
  showMessage: (message: TimedMessage, durationMs?: number) => void;
  clearMessage: () => void;
};

interface ModalFormProps {
  pending?: boolean;
  submitLabel?: string;
  pendingLabel?: string;
}
```

`useAuth` remains local-state based; no Redux is added for form state.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useTimedMessage` cleanup/restart behavior; `useAuth` loading/error guard | Vitest + fake timers for the hook; mock Firebase auth for submit state transitions if tests are added. |
| Integration | `ModalForm` pending-safe shell; `Login` single submit path | RTL tests for disabled submit/close behavior and for form submit triggering only one auth attempt. |
| E2E | N/A | No E2E layer is configured in this repo; cover with manual QA. |

## Migration / Rollout

No migration required. Roll out as one small PR slice. Rollback by reverting `useTimedMessage`, restoring existing `useModalForm` message ownership, removing pending props from `ModalForm`, and returning login to its current alert-driven handling.

## Open Questions

- [ ] None.
