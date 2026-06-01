import { useState } from "react";

export type ModalMessage = {
  type: "success" | "error";
  text: string;
};

interface CloseOptions {
  clearMessage?: boolean;
}

export const useModalForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<ModalMessage | null>(null);

  const open = () => {
    setIsOpen(true);
    setMessage(null);
  };

  const close = (options?: CloseOptions) => {
    setIsOpen(false);
    if (options?.clearMessage ?? true) {
      setMessage(null);
    }
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
    setMessage(null);
  };

  return {
    isOpen,
    message,
    setMessage,
    open,
    close,
    toggle,
  };
};
