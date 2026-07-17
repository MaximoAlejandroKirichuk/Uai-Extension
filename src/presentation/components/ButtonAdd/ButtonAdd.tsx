import { useState } from "react";
import "./ButtonAdd.css";
import { Universidad } from "../../../core/entities/universidad.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";
import { useTimedMessage } from "../../../hooks/useTimedMessage";
import { createRealtimeRecord } from "../../../firebase/realtimeRepository";

export const ButtonAdd = () => {
  const { isOpen, open, close } = useModalForm();
  const { message, showMessage, clearMessage } = useTimedMessage();
  const [pending, setPending] = useState(false);

  const [formData, setFormData] = useState<Universidad>({
    nombre: "",
    descripcion: "",
    contacto: "",
    redes: {
      linkedin: "",
      instagram: "",
      x: ""
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (["linkedin", "instagram", "x"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        redes: {
          ...prev.redes,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) {
      return;
    }

    setPending(true);

    const universidadData: Universidad = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      contacto: formData.contacto,
      redes: {
        linkedin: formData.redes?.linkedin,
        instagram: formData.redes?.instagram,
        x: formData.redes?.x
      }
    };

    try {
      await createRealtimeRecord("universidades", universidadData);
      setFormData({
        nombre: "",
        descripcion: "",
        contacto: "",
        redes: {
          linkedin: "",
          instagram: "",
          x: ""
        }
      });
      showMessage({ type: "success", text: "¡Guardado con éxito!" });
    } catch (error) {
      console.error("Error al guardar:", error);
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

  return (
    <>
      <button className="floating-button" onClick={handleOpen}>
        +
      </button>
      <ModalForm
        title="Agregar nueva universidad"
        isOpen={isOpen}
        message={message}
        pending={pending}
        onClose={handleClose}
        onSubmit={handleSubmit}
        pendingLabel="Guardando..."
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre universidad"
          value={formData.nombre}
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
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn (opcional)"
          value={formData.redes?.linkedin}
          onChange={handleChange}
        />
        <input
          type="url"
          name="instagram"
          placeholder="Instagram (opcional)"
          value={formData.redes?.instagram}
          onChange={handleChange}
        />
        <input
          type="url"
          name="x"
          placeholder="X (Twitter) (opcional)"
          value={formData.redes?.x}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </ModalForm>
    </>
  );
};
