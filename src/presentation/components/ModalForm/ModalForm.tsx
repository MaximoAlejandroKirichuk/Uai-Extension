import type { FormEvent, ReactNode } from "react";
import type { ModalMessage } from "../../../hooks/useModalForm";

interface ModalFormProps {
  title: string;
  isOpen: boolean;
  message: ModalMessage | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel?: string;
  scroll?: boolean;
}

export const ModalForm = ({
  title,
  isOpen,
  message,
  onClose,
  onSubmit,
  children,
  submitLabel = "Guardar",
  scroll = false,
}: ModalFormProps) => {
  if (!isOpen) {
    return null;
  }

  const form = (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit" className="modal-submit">
        {submitLabel}
      </button>
    </form>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="mb-5 text-center">{title}</h2>

        {message && (
          <div className={`feedback-message ${message.type}`}>{message.text}</div>
        )}

        {scroll ? <div className="form-scroll-container">{form}</div> : form}

        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
};
