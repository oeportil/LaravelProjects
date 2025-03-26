import useSWR from "swr";
import clienteAxios from "../config/axios";
import { formatearDinero } from "../helpers";
import useQuiosco from "../hooks/userQuiosco";
import { ContexType } from "../context/QuioscoProvider";
const Ordenes = () => {
  const token = localStorage.getItem("AUTH_TOKEN");
  const { handleClickCompletarPedido } = useQuiosco() as ContexType;
  const fetcher = () =>
    clienteAxios("pedidos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  const { data, isLoading } = useSWR("pedidos", fetcher, {
    refreshInterval: 1000,
  });

  if (isLoading) return "Cargando...";
  return (
    <div>
      <h1 className="text-4xl font-black">Ordenes</h1>
      <p className="my-10 text-2xl">Administra las ordenes desde aqui</p>
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
                  Cantidad: {""}
                  <span className="font-bold">{producto.pivot.cantidad}</span>
                </p>
              </div>
            ))}
            <p className="text-lg font-bold text-slate-600">
              Cliente:{""}
              <span className="font-normal">{pedido.user.name}</span>
            </p>
            <p className="text-lg font-bold text-amber-600">
              Total a Pagar:{""}
              <span className="font-normal text-slate-500">
                {formatearDinero(pedido.total)}
              </span>
            </p>

            <button
              type="submit"
              className="w-full px-5 py-2 font-bold text-center text-white uppercase bg-indigo-600 rounded "
              onClick={() => handleClickCompletarPedido(pedido.id)}
            >
              Completar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ordenes;
