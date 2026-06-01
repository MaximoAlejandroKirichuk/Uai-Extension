import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { Plataforma } from "../../../core/entities/plataformas.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";

export const ButtonAddPlataformas = () => {
  const { isOpen, message, setMessage, open, close } = useModalForm();

  const [formData, setFormData] = useState<Plataforma>({
    nombrePlataforma: "",
    descripcion: "",
    contacto: "",
    tipoPlataforma: "",
    industria: "",
    etapaCubre: "",
    montoPromedio: "",
    requisitosAcceso: "",
    costoComision: "",
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

    try {
      await push(ref(database, "plataformas"), formData);
      setFormData({
        nombrePlataforma: "",
        descripcion: "",
        contacto: "",
        tipoPlataforma: "",
        industria: "",
        etapaCubre: "",
        montoPromedio: "",
        requisitosAcceso: "",
        costoComision: "",
        algoritmo: "",
      });
      close({ clearMessage: false });
      setMessage({ type: "success", text: "¡Plataforma guardada con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar plataforma:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={open}>
        +
      </button>
      <ModalForm
        title="Agregar nueva Plataforma"
        isOpen={isOpen}
        message={message}
        onClose={close}
        onSubmit={handleSubmit}
        scroll
      >
        <input
          type="text"
          name="nombrePlataforma"
          placeholder="Nombre de la plataforma"
          value={formData.nombrePlataforma}
          onChange={handleChange}
          required
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
          name="contacto"
          placeholder="Contacto (opcional)"
          value={formData.contacto}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tipoPlataforma"
          placeholder="Tipo de plataforma"
          value={formData.tipoPlataforma}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="industria"
          placeholder="Industria"
          value={formData.industria}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="etapaCubre"
          placeholder="Etapa que cubre"
          value={formData.etapaCubre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="montoPromedio"
          placeholder="Monto promedio"
          value={formData.montoPromedio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="requisitosAcceso"
          placeholder="Requisitos de acceso"
          value={formData.requisitosAcceso}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="costoComision"
          placeholder="Costo/Comisión"
          value={formData.costoComision}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="algoritmo"
          placeholder="Algoritmo"
          value={formData.algoritmo}
          onChange={handleChange}
          required
        />
      </ModalForm>
    </>
  );
};
