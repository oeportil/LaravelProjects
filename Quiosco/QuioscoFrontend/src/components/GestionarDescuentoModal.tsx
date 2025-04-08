import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import clienteAxios from "../config/axios";
import { IProducto } from "../data/productos";

interface GestionarDescuentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: number;
  onUpdate: () => void;
}

const GestionarDescuentoModal = ({
  isOpen,
  onClose,
  productoId,
  onUpdate,
}: GestionarDescuentoModalProps) => {
  const [porcentaje, setPorcentaje] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [descuentosHistoricos, setDescuentosHistoricos] = useState<any[]>([]);
  const [selectedDescuento, setSelectedDescuento] = useState<any | null>(null);

  const token = localStorage.getItem("AUTH_TOKEN");

  const gestionarDescuento = async () => {
    try {
      if (selectedDescuento) {
        // Si se ha seleccionado un descuento existente, actualizarlo
        const response = await clienteAxios.put(
          `/descuentos/${selectedDescuento.id}`,
          {
            porcentaje,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
      } else {
        // Si no hay descuento seleccionado, crear uno nuevo
        const response = await clienteAxios.post(
          "/descuentos",
          {
            producto_id: productoId,
            porcentaje,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error gestionando descuento", error);
    }
  };

  const obtenerDescuentosHistoricos = async () => {
    try {
      const response = await clienteAxios.get(`/productosdesc/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDescuentosHistoricos(response.data);
    } catch (error) {
      console.error("Error obteniendo descuentos históricos", error);
    }
  };

  const manejarSeleccionDescuento = (descuento: any) => {
    setSelectedDescuento(descuento);
    setPorcentaje(descuento.porcentaje);
    setFechaInicio(descuento.fecha_inicio);
    setFechaFin(descuento.fecha_fin);
  };

  useEffect(() => {
    // Reset values when modal is opened
    setPorcentaje(0);
    setFechaInicio("");
    setFechaFin("");
    if (isOpen) {
      obtenerDescuentosHistoricos();
    }
  }, [isOpen, productoId]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto relative"
      overlayClassName="fixed inset-0 bgmodales bg-opacity-50 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Gestionar Descuento</h2>

      <div className="mb-4">
        <label className="block">Seleccionar Descuento Histórico</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedDescuento ? selectedDescuento.id : ""}
          onChange={(e) => {
            const descuento = descuentosHistoricos.find(
              (d) => d.id === parseInt(e.target.value)
            );
            manejarSeleccionDescuento(descuento);
          }}
        >
          <option value="">Seleccione un descuento</option>
          {descuentosHistoricos.map((descuento) => (
            <option key={descuento.id} value={descuento.id}>
              {descuento.porcentaje}% - {descuento.fecha_inicio} a {descuento.fecha_fin}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Porcentaje</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={porcentaje}
          onChange={(e) => setPorcentaje(Number(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className="block">Fecha Inicio</label>
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Fecha Fin</label>
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
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
          onClick={gestionarDescuento}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Aplicar Descuento
        </button>
      </div>
    </ReactModal>
  );
};

export default GestionarDescuentoModal;
