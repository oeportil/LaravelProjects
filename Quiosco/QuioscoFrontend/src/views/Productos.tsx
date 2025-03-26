import useSWR from "swr";
import clienteAxios from "../config/axios";
import Producto from "../components/Producto";
import { IProducto } from "../data/productos";

const Productos = () => {
  const token = localStorage.getItem("AUTH_TOKEN");

  const fetcher = () =>
    clienteAxios("productos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((datos) => datos.data);

  const { data, error, isLoading } = useSWR("productos", fetcher, {
    refreshInterval: 10000,
  });

  if (isLoading) return "Cargando...";
  return (
    <div>
      <h1 className="text-4xl font-black">Productos</h1>
      <p className="my-10 text-2xl">Maneja la disponibilidad desde aqui</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.data.map((producto: IProducto) => (
          <Producto key={producto.id} {...producto} />
        ))}
      </div>
    </div>
  );
};

export default Productos;
