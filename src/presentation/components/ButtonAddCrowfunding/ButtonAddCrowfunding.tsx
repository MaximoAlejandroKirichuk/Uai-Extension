import { useState } from "react";
import { database, ref, push } from "../../../firebase/firebaseConfig";
import "../ButtonAdd/ButtonAdd.css";
import { Crowfunding } from "../../../core/entities/crowfunding.entity";

export const ButtonAddCrowfunding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<Crowfunding>({
    nombrePlataforma: "",
    descripcion: "",
    contacto: "",
    facilidadUso: "",
    comisiones: "",
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
      await push(ref(database, "crowfundings"), formData);
      setFormData({
        nombrePlataforma: "",
        descripcion: "",
        contacto: "",
        facilidadUso: "",
        comisiones: "",
        algoritmo: "",
      });
      setIsOpen(false);
      setMessage({ type: "success", text: "¡Crowfunding guardado con éxito!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al guardar crowfunding:", error);
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
            <h2 className="mb-5 text-center">Agregar nuevo crowdfunding</h2>

            {message && (
              <div className={`feedback-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
              <button type="submit" className="modal-submit">Guardar</button>
            </form>

            <button onClick={toggleModal} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
