import React, { useState } from "react";
import ReactModal from "react-modal";
import clienteAxios from "../config/axios";
import { IProducto } from "../data/productos";
import { toast } from "react-toastify";

interface SubirImagenModalProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: number;
  onUpdate: () => void;
}

const SubirImagenModal = ({
  isOpen,
  onClose,
  productoId,
  onUpdate,
}: SubirImagenModalProps) => {
  const [imagen, setImagen] = useState<File | null>(null);

  const token = localStorage.getItem("AUTH_TOKEN");

  const subirImagen = async () => {
    const formData = new FormData();
    if (imagen) {
      formData.append("imagen", imagen);

      try {
        await clienteAxios.post(`/productos/${productoId}/imagen`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success('Imagen subida correctamente');
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error subiendo la imagen", error);
        toast.error('Hubo un error al subir la imagen');
      }
    }
  };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto relative"overlayClassName="fixed inset-0 bgmodales bg-opacity-50 flex items-center justify-center z-50">
      <h2 className="text-xl font-bold mb-4">Subir Imagen</h2>
      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
          className="p-2 border rounded"
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
          onClick={subirImagen}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subir Imagen
        </button>
      </div>
    </ReactModal>
  );
};

export default SubirImagenModal;
