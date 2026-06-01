import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "./ButtonAdd.css";
import { Universidad } from "../../../core/entities/universidad.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";

export const ButtonAdd = () => {
  const { isOpen, message, setMessage, open, close } = useModalForm();

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
      await push(ref(database, "universidades"), universidadData);
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
      close({ clearMessage: false });
      setMessage({ type: "success", text: "¡Guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000); // Oculta mensaje luego de 3s
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={open}>
        +
      </button>
      <ModalForm
        title="Agregar nueva universidad"
        isOpen={isOpen}
        message={message}
        onClose={close}
        onSubmit={handleSubmit}
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
