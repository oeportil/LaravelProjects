import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import clienteAxios from "../config/axios";
import { useAuth } from "../hooks/useAuth"; 
import Swal from 'sweetalert2';

interface ProductoPivot {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  descuento: number | null;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  pivot: ProductoPivot;
}

interface Pedido {
  id: number;
  total: number;
  created_at: string;
  estado: boolean;
  productos: Producto[];
}

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const { data } = await clienteAxios.get(`/reportes/historial-cliente/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          },
        });
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        toast.error("No se pudieron cargar los pedidos.");
      }
    };

    if (user?.id) {
      obtenerPedidos();
    }
    
  }, [user]);
  console.log(pedidos);
  const descargarTicket = async (id: number) => {
    try {
      const response = await clienteAxios.get(`/reportes/ticket/${id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_pedido_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el ticket:", error);
      toast.error("No se pudo descargar el ticket.");
    }
  };

  const eliminarPedido = async (id: number) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar Pedido?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (!resultado.isConfirmed) return;
  
    try {
      await clienteAxios.delete(`/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
  
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
      Swal.fire('¡Eliminado!', 'El pedido ha sido eliminado.', 'success');
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      Swal.fire('Error', 'No se pudo eliminar el pedido.', 'error');
    }
  };
  
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Historial de Pedidos</h1>

      <div className="mt-5 space-y-6">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="p-5 bg-white border border-gray-300 shadow-md rounded"
            >
              <div className="mb-4">
                <p><strong>ID Pedido:</strong> {pedido.id}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleString()}</p>
                <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
              </div>

              {/* ... previous code remains the same ... */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Productos</h3>
                <ul className="space-y-2">
                  {pedido.productos.map((producto) => (
                    <li key={producto.id} className="border-b border-gray-200 pb-2">
                      <p><strong>Nombre:</strong> {producto.nombre}</p>
                      <p><strong>Descripción:</strong> {producto.descripcion}</p>
                      <p><strong>Precio unitario:</strong> ${producto.precio.toFixed(2)}</p>
                      <p><strong>Cantidad:</strong> {producto.pivot.cantidad}</p>
                      {producto.pivot.descuento && (
                        <p><strong>Descuento:</strong> ${producto.pivot.descuento}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ... the rest of the component remains the same ... */}

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => descargarTicket(pedido.id)}
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                  Descargar Ticket
                </button>
                {pedido.estado === false && (
                  <button
                    onClick={() => eliminarPedido(pedido.id)}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                  >
                    Eliminar Pedido
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hay pedidos disponibles.</p>
        )}
      </div>

      <div className="mt-5">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
        >
          Regresar al Inicio
        </button>
      </div>
    </div>
  );
};

export default HistorialPedidos;
