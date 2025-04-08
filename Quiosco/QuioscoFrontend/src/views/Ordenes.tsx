import useSWR from "swr";
import clienteAxios from "../config/axios";
import { formatearDinero } from "../helpers";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Ordenes = () => {
  const token = localStorage.getItem("AUTH_TOKEN");

  const fetcher = () =>
    clienteAxios("pedidos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  const { data, isLoading, mutate } = useSWR("pedidos", fetcher, {
    refreshInterval: 1000,
  });

  const completarPedido = async (id: number) => {
    try {
      const resultado = await Swal.fire({
        title: "¿Completar Pedido?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, completarlo",
        cancelButtonText: "No",
      });

      if (resultado.isConfirmed) {
        await clienteAxios.put(
          `/pedidos/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Completado", "El pedido ha sido completado.", "success");
        mutate(); // Actualiza la lista de pedidos
      }
    } catch (error) {
      console.error("Error al completar el pedido:", error);
      Swal.fire("Error", "No se pudo completar el pedido.", "error");
    }
  };

  const cancelarPedido = async (id: number) => {
    const resultado = await Swal.fire({
      title: "¿Cancelar Pedido?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelarlo",
      cancelButtonText: "No",
    });

    if (resultado.isConfirmed) {
      try {
        await clienteAxios.delete(`/pedidos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Cancelado", "El pedido ha sido cancelado.", "success");
        mutate(); // Actualiza la lista de pedidos
      } catch (error) {
        console.error("Error al cancelar el pedido:", error);
        Swal.fire("Error", "No se pudo cancelar el pedido.", "error");
      }
    }
  };

  if (isLoading) return "Cargando...";

  return (
    <div>
      <h1 className="text-4xl font-black">Órdenes</h1>
      <p className="my-10 text-2xl">Administra las órdenes desde aquí</p>
      <div className="grid grid-cols-2 gap-5">
        {data?.data.data.map((pedido) => (
          <div key={pedido.id} className="p-5 space-y-2 bg-white shadow">
            <p className="text-xl font-bold text-slate-600">
              Contenido del Pedido
            </p>
            {pedido.productos.map((producto) => (
              <div
                key={producto.id}
                className="border-b border-b-sla200 last-of-type:border-none"
              >
                <p className="text-sm">ID: {producto.id}</p>
                <p>{producto.nombre}</p>
                <p>
                  Cantidad:{" "}
                  <span className="font-bold">{producto.pivot.cantidad}</span>
                </p>
              </div>
            ))}
            <p className="text-lg font-bold text-slate-600">
              Cliente: <span className="font-normal">{pedido.user.name}</span>
            </p>
            <p className="text-lg font-bold text-amber-600">
              Total a Pagar:{" "}
              <span className="font-normal text-slate-500">
                {formatearDinero(pedido.total)}
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              <button
                type="button"
                className="w-full px-5 py-2 font-bold text-white uppercase bg-indigo-600 rounded hover:bg-indigo-800"
                onClick={() => completarPedido(pedido.id)}
              >
                Completar
              </button>

              {pedido.estado === false && (
                <button
                  onClick={() => cancelarPedido(pedido.id)}
                  className="w-full px-5 py-2 font-bold text-center text-white uppercase bg-red-600 rounded mt-2"
                >
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ordenes;