import { useState } from "react";
import Modal from "react-modal";
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import { ICategoria } from "../data/categorias";

// Establece el elemento raíz para el modal
Modal.setAppElement("#root");

const CrearProductoModal = ({
  isOpen,
  onClose,
  onRefresh,
  categorias,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  categorias: ICategoria[];
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //nombre de imagen es categoría_nombre + id de producto
    const imagen = `${categoriaId}_${nombre}`;
    const disponible = true;
    try {
      await clienteAxios.post(
        "/productos",
        { nombre, descripcion, precio, categoria_id: categoriaId, imagen, disponible },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` },
        }
      );
      toast.success("Producto creado correctamente");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Error al crear producto");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto relative"
      overlayClassName="fixed inset-0 bgmodales flex items-center justify-center z-50"
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          className="w-full p-2 border rounded"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            Guardar
          </button>
          <button
            type="button"
            className="bg-gray-300 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CrearProductoModal;