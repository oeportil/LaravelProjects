import clienteAxios from "../config/axios";
import { toast } from "react-toastify";


const ProductoAdminCard = ({
  producto,
  onUpdate,
  onEdit,
  onDescuento,
  onImagen,
}: {
  producto: any;
  onUpdate: () => void;
  onEdit: () => void;
  onDescuento: () => void;
  onImagen: () => void;
}) => {
  const toggleDisponibilidad = async () => {
    try {
      await clienteAxios.put(
        `/productos/${producto.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          },
        }
      );
      toast.success("Disponibilidad actualizada");
      onUpdate();
    } catch (error) {
      toast.error("Error actualizando disponibilidad");
    }
  };

  return (
    <div className="bg-white p-4 shadow border rounded flex flex-col justify-between">
      {/* Imagen del producto */}
      <img
        src={`${import.meta.env.VITE_API_URL}/productos/${producto.id}/imagen`}
        alt={producto.nombre}
        className="w-full h-40 object-cover"
      />

      {/* Información del producto */}
      <h2 className="text-xl font-bold mt-2">{producto.nombre}</h2>
      <p className="text-gray-600">{producto.descripcion}</p>
      <p className="font-bold text-amber-600 text-lg">${producto.precio}</p>

      {/* Categoría */}
      <p className="text-gray-500 text-sm">
        Categoría: {producto.categoria?.nombre || "Sin categoría"}
      </p>

      {/* Descuento activo */}
      {producto.descuento_activo && (
        <p className="text-green-600 text-sm">
          Descuento: {producto.descuento_activo.porcentaje}%
        </p>
      )}

      {/* Cantidad vendida en el día */}
      <p className="text-blue-600 text-sm">
        Vendidos hoy: {producto.cantidad_vendida || 0}
      </p>

      {/* Estado de disponibilidad */}
      <p
        className={`text-sm font-bold ${
          producto.disponible ? "text-green-600" : "text-red-600"
        }`}
      >
        {producto.disponible ? "Disponible" : "Agotado"}
      </p>

      {/* Botones de acción */}
      <div className="mt-4 space-y-2">
        <button
          onClick={toggleDisponibilidad}
          className={`w-full py-2 font-bold rounded ${
            producto.disponible ? "bg-red-600" : "bg-green-600"
          } text-white`}
        >
          {producto.disponible ? "Marcar como Agotado" : "Marcar como Disponible"}
        </button>

        <button
          onClick={onEdit}
          className="w-full py-2 font-bold rounded bg-yellow-500 text-white"
        >
          Editar Producto
        </button>

        <button
          onClick={onDescuento}
          className="w-full py-2 font-bold rounded bg-indigo-600 text-white"
        >
          Ver/Editar Descuento
        </button>

        <button
          onClick={onImagen}
          className="w-full py-2 font-bold rounded bg-purple-600 text-white"
        >
          Subir Imagen
        </button>
      </div>
    </div>
  );
};

export default ProductoAdminCard;