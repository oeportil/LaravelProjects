import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import clienteAxios from "../config/axios";
import { IProducto } from "../data/productos";

// Configurar el elemento raíz para ReactModal
ReactModal.setAppElement("#root");

interface EditarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: IProducto;
  onUpdate: () => void;
}

const EditarProductoModal = ({
  isOpen,
  onClose,
  producto,
  onUpdate,
}: EditarProductoModalProps) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion || "");
  const [precio, setPrecio] = useState(producto.precio);

  const token = localStorage.getItem("AUTH_TOKEN");

  const actualizarProducto = async () => {
    try {
      await clienteAxios.put(
        `/productos/${producto.id}/editar-info`,
        { nombre, descripcion, precio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error actualizando el producto", error);
    }
  };

  useEffect(() => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio);
  }, [producto]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto relative"
      overlayClassName="fixed inset-0 bgmodales bg-opacity-50 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
      <div className="mb-4">
        <label className="block">Nombre</label>
        <input
          type="text"
          className="p-2 border rounded w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Descripción</label>
        <textarea
          className="p-2 border rounded w-full"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Precio</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
        >
          Cancelar
        </button>
        <button
          onClick={actualizarProducto}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar Cambios
        </button>
      </div>
    </ReactModal>
  );
};

export default EditarProductoModal;