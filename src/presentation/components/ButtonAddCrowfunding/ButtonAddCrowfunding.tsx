import { useState } from "react";
import "../ButtonAdd/ButtonAdd.css";
import { Crowfunding } from "../../../core/entities/crowfunding.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";
import { useTimedMessage } from "../../../hooks/useTimedMessage";
import { createRealtimeRecord } from "../../../firebase/realtimeRepository";

interface ButtonAddCrowfundingProps {
  canWrite?: boolean;
}

export const ButtonAddCrowfunding = ({ canWrite = true }: ButtonAddCrowfundingProps) => {
  const { isOpen, open, close } = useModalForm();
  const { message, showMessage, clearMessage } = useTimedMessage();
  const [pending, setPending] = useState(false);

  const [formData, setFormData] = useState<Crowfunding>({
    nombrePlataforma: "",
    descripcion: "",
    contacto: "",
    facilidadUso: "",
    comisiones: "",
    algoritmo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) {
      return;
    }

    setPending(true);

    try {
      await createRealtimeRecord("crowfundings", formData, { canWrite });
      setFormData({
        nombrePlataforma: "",
        descripcion: "",
        contacto: "",
        facilidadUso: "",
        comisiones: "",
        algoritmo: "",
      });
      showMessage({ type: "success", text: "¡Crowfunding guardado con éxito!" });
    } catch (error) {
      console.error("Error al guardar crowfunding:", error);
      showMessage({ type: "error", text: "Error al guardar los datos." });
    } finally {
      setPending(false);
    }
  };

  const handleOpen = () => {
    clearMessage();
    open();
  };

  const handleClose = () => {
    clearMessage();
    close();
  };

  if (!canWrite) {
    return null;
  }

  return (
    <>
      <button className="floating-button" onClick={handleOpen}>
        +
      </button>
      <ModalForm
        title="Agregar nuevo crowdfunding"
        isOpen={isOpen}
        message={message}
        pending={pending}
        onClose={handleClose}
        onSubmit={handleSubmit}
        pendingLabel="Guardando..."
      >
        <input
          type="text"
          name="nombrePlataforma"
          placeholder="Nombre de la plataforma"
          value={formData.nombrePlataforma}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contacto"
          placeholder="Contacto (opcional)"
          value={formData.contacto}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="facilidadUso"
          placeholder="Facilidad de uso"
          value={formData.facilidadUso}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="comisiones"
          placeholder="Comisiones"
          value={formData.comisiones}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="algoritmo"
          placeholder="Algoritmos"
          value={formData.algoritmo}
          onChange={handleChange}
          required
        />
      </ModalForm>
    </>
  );
};
