import type { FormEvent, ReactNode } from "react";
import type { TimedMessage } from "../../../hooks/useTimedMessage";

interface ModalFormProps {
  title: string;
  isOpen: boolean;
  message: TimedMessage | null;
  pending?: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  scroll?: boolean;
}

export const ModalForm = ({
  title,
  isOpen,
  message,
  pending = false,
  onClose,
  onSubmit,
  children,
  submitLabel = "Guardar",
  pendingLabel = "Guardando...",
  scroll = false,
}: ModalFormProps) => {
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (!pending) {
      onClose();
    }
  };

  const form = (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit" className="modal-submit" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="mb-5 text-center">{title}</h2>

        {message && (
          <div className={`feedback-message ${message.type}`}>{message.text}</div>
        )}

        {scroll ? <div className="form-scroll-container">{form}</div> : form}

        <button onClick={handleClose} className="close-button" disabled={pending}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
