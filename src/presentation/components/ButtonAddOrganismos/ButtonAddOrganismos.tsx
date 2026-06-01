import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";

export const ButtonAddOrganismoEstado = () => {
  const { isOpen, message, setMessage, open, close } = useModalForm();

  const [formData, setFormData] = useState<OrganismoEstado>({
    nombre: "",
    area: "",
    descripcion: "",
    programas: "",
    tiposFinanciamiento: "",
    fechasRelevantes: "",
    requisitosAcceso: "",
    contacto: "",
    enlaces: "",
    estadoSeguimiento: "",
    beneficiarios: "",
    alianzas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await push(ref(database, "organismosEstado"), formData);
      setFormData({
        nombre: "",
        area: "",
        descripcion: "",
        programas: "",
        tiposFinanciamiento: "",
        fechasRelevantes: "",
        requisitosAcceso: "",
        contacto: "",
        enlaces: "",
        estadoSeguimiento: "",
        beneficiarios: "",
        alianzas: "",
      });
      close({ clearMessage: false });
      setMessage({ type: "success", text: "¡Organismo guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar organismo:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={open}>+</button>

      <ModalForm
        title="Agregar nuevo Organismo del Estado"
        isOpen={isOpen}
        message={message}
        onClose={close}
        onSubmit={handleSubmit}
        scroll
      >
        <input
          name="nombre"
          placeholder="Nombre del organismo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="area"
          placeholder="Área o dependencia"
          value={formData.area}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción general"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <textarea
          name="programas"
          placeholder="Programas o líneas de apoyo"
          value={formData.programas}
          onChange={handleChange}
        />
        <input
          name="tiposFinanciamiento"
          placeholder="Tipos de financiamiento"
          value={formData.tiposFinanciamiento}
          onChange={handleChange}
        />
        <input
          name="fechasRelevantes"
          placeholder="Fechas relevantes"
          value={formData.fechasRelevantes}
          onChange={handleChange}
        />
        <textarea
          name="requisitosAcceso"
          placeholder="Requisitos para acceder"
          value={formData.requisitosAcceso}
          onChange={handleChange}
        />
        <input
          name="contacto"
          placeholder="Contacto oficial"
          value={formData.contacto}
          onChange={handleChange}
        />
        <input
          name="enlaces"
          placeholder="Enlaces útiles"
          value={formData.enlaces}
          onChange={handleChange}
        />
        <input
          name="estadoSeguimiento"
          placeholder="Estado / seguimiento"
          value={formData.estadoSeguimiento}
          onChange={handleChange}
        />
        <input
          name="beneficiarios"
          placeholder="Beneficiarios objetivo"
          value={formData.beneficiarios}
          onChange={handleChange}
        />
        <input
          name="alianzas"
          placeholder="Alianzas o colaboraciones"
          value={formData.alianzas}
          onChange={handleChange}
        />
      </ModalForm>
    </>
  );
};
