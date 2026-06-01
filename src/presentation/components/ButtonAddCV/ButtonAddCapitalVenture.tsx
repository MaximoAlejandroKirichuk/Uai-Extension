import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";

export const ButtonAddCapitalVentures = () => {
  const { isOpen, message, setMessage, open, close } = useModalForm();

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
      close({ clearMessage: false });
      setMessage({ type: "success", text: "¡Capital Venture guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar capital venture:", error);
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };

  return (
    <>
      <button className="floating-button" onClick={open}>
        +
      </button>
      <ModalForm
        title="Agregar nuevo Capital Venture"
        isOpen={isOpen}
        message={message}
        onClose={close}
        onSubmit={handleSubmit}
        scroll
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sitioWeb"
          placeholder="Sitio Web"
          value={formData.sitioWeb}
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
          name="region"
          placeholder="Región"
          value={formData.region}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tipoInversion"
          placeholder="Tipo de inversión"
          value={formData.tipoInversion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="foco"
          placeholder="Foco"
          value={formData.foco}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="etapa"
          placeholder="Etapa"
          value={formData.etapa}
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
          name="perfilBuscado"
          placeholder="Perfil buscado"
          value={formData.perfilBuscado}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="convocatoria"
          placeholder="Convocatoria"
          value={formData.convocatoria}
          onChange={handleChange}
          required
        />
        <textarea
          name="comentario"
          placeholder="Comentario"
          value={formData.comentario}
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
