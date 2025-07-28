import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";

export const ButtonAddOrganismoEstado = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setMessage(null);
  };

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
      setIsOpen(false);
      setMessage({ type: "success", text: "¡Organismo guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar organismo:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={toggleModal}>+</button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-5 text-center">Agregar nuevo Organismo del Estado</h2>

            {message && (
              <div className={`feedback-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-scroll-container">
              <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre del organismo" value={formData.nombre} onChange={handleChange} required />
                <input name="area" placeholder="Área o dependencia" value={formData.area} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripción general" value={formData.descripcion} onChange={handleChange} required />
                <textarea name="programas" placeholder="Programas o líneas de apoyo" value={formData.programas} onChange={handleChange} />
                <input name="tiposFinanciamiento" placeholder="Tipos de financiamiento" value={formData.tiposFinanciamiento} onChange={handleChange} />
                <input name="fechasRelevantes" placeholder="Fechas relevantes" value={formData.fechasRelevantes} onChange={handleChange} />
                <textarea name="requisitosAcceso" placeholder="Requisitos para acceder" value={formData.requisitosAcceso} onChange={handleChange} />
                <input name="contacto" placeholder="Contacto oficial" value={formData.contacto} onChange={handleChange} />
                <input name="enlaces" placeholder="Enlaces útiles" value={formData.enlaces} onChange={handleChange} />
                <input name="estadoSeguimiento" placeholder="Estado / seguimiento" value={formData.estadoSeguimiento} onChange={handleChange} />
                <input name="beneficiarios" placeholder="Beneficiarios objetivo" value={formData.beneficiarios} onChange={handleChange} />
                <input name="alianzas" placeholder="Alianzas o colaboraciones" value={formData.alianzas} onChange={handleChange} />

                <button type="submit" className="modal-submit">Guardar</button>
              </form>
            </div>

            <button onClick={toggleModal} className="close-button">Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};
