import { useState } from "react";
import { database, ref, push } from '../../../firebase/firebaseConfig';
import "./ButtonAdd.css";

export const ButtonAdd = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    contacto: "",
    linkedin: "",
    instagram: "",
    x: ""
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Estructuramos el objeto como la interfaz Universidad
    const universidadData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      contacto: formData.contacto,
      redes: {
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        x: formData.x
      }
    };

    try {
      await push(ref(database, "universidades"), universidadData);
      setFormData({
        nombre: "",
        descripcion: "",
        contacto: "",
        linkedin: "",
        instagram: "",
        x: ""
      });
      setIsOpen(false);
      alert("¡Guardado con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los datos.");
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
            <h2 className="mb-5 text-center">Agregar nueva universidad</h2>
            <form onSubmit={handleSubmit}>
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
                value={formData.linkedin}
                onChange={handleChange}
              />
              <input
                type="url"
                name="instagram"
                placeholder="Instagram (opcional)"
                value={formData.instagram}
                onChange={handleChange}
              />
              <input
                type="url"
                name="x"
                placeholder="X (Twitter) (opcional)"
                value={formData.x}
                onChange={handleChange}
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
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
