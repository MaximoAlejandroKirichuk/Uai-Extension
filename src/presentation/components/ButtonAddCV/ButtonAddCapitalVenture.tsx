import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";
import { useModalForm } from "../../../hooks/useModalForm";
import { ModalForm } from "../ModalForm/ModalForm";
import { useTimedMessage } from "../../../hooks/useTimedMessage";

export const ButtonAddCapitalVentures = () => {
  const { isOpen, open, close } = useModalForm();
  const { message, showMessage, clearMessage } = useTimedMessage();
  const [pending, setPending] = useState(false);

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
    if (pending) {
      return;
    }

    setPending(true);

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
      showMessage({ type: "success", text: "¡Capital Venture guardado con éxito!" });
    } catch (error) {
      console.error("Error al guardar capital venture:", error);
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
        title="Agregar nuevo Capital Venture"
        isOpen={isOpen}
        message={message}
        pending={pending}
        onClose={handleClose}
        onSubmit={handleSubmit}
        pendingLabel="Guardando..."
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
