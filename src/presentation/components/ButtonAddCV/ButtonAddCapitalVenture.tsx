import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";

export const ButtonAddCapitalVentures = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<CapitalVentures>({
    nombre: "",
    sitioWeb: "",
    contacto: "",
    region: "",
    tipoInversion: "",
    foco: "",
    etapa: "",
    montoPromedio: "",
    perfilBuscado: "",
    convocatoria: "",
    comentario: "",
    algoritmo: "",
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setMessage(null);
  };

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
      await push(ref(database, "capitalVentures"), formData);
      setFormData({
        nombre: "",
        sitioWeb: "",
        contacto: "",
        region: "",
        tipoInversion: "",
        foco: "",
        etapa: "",
        montoPromedio: "",
        perfilBuscado: "",
        convocatoria: "",
        comentario: "",
        algoritmo: "",
      });
      setIsOpen(false);
      setMessage({ type: "success", text: "¡Capital Venture guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar capital venture:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={toggleModal}>
        +
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
  <div className="modal" onClick={(e) => e.stopPropagation()}>
    <h2 className="mb-5 text-center">Agregar nuevo Capital Venture</h2>

    {message && (
      <div className={`feedback-message ${message.type}`}>
        {message.text}
      </div>
    )}

    {/* CONTENEDOR CON SCROLL */}
    <div className="form-scroll-container">
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="sitioWeb" placeholder="Sitio Web" value={formData.sitioWeb} onChange={handleChange} required />
        <input type="text" name="contacto" placeholder="Contacto (opcional)" value={formData.contacto} onChange={handleChange} />
        <input type="text" name="region" placeholder="Región" value={formData.region} onChange={handleChange} required />
        <input type="text" name="tipoInversion" placeholder="Tipo de inversión" value={formData.tipoInversion} onChange={handleChange} required />
        <input type="text" name="foco" placeholder="Foco" value={formData.foco} onChange={handleChange} required />
        <input type="text" name="etapa" placeholder="Etapa" value={formData.etapa} onChange={handleChange} required />
        <input type="text" name="montoPromedio" placeholder="Monto promedio" value={formData.montoPromedio} onChange={handleChange} required />
        <input type="text" name="perfilBuscado" placeholder="Perfil buscado" value={formData.perfilBuscado} onChange={handleChange} required />
        <input type="text" name="convocatoria" placeholder="Convocatoria" value={formData.convocatoria} onChange={handleChange} required />
        <textarea name="comentario" placeholder="Comentario" value={formData.comentario} onChange={handleChange} required />
        <input type="text" name="algoritmo" placeholder="Algoritmo" value={formData.algoritmo} onChange={handleChange} required />
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
