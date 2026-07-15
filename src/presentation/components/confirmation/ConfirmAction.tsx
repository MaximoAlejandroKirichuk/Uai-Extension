import { useEffect } from "react";

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

export const ConfirmAction = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmActionProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel, pending]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      onClick={pending ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        aria-describedby="confirm-action-description"
        className="w-full max-w-md rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
              Confirmación requerida
            </p>
          <h3 id="confirm-action-title" className="text-xl font-semibold tracking-tight text-[color:var(--color-text)]">
            {title}
          </h3>
          <p id="confirm-action-description" className="text-sm leading-6 text-[color:var(--color-text-muted)]">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-text)] transition hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
