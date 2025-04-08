import { useState } from "react";
import useSWR from "swr";
import Producto from "../components/Producto";
import { ContexType } from "../context/QuioscoProvider";
import useQuiosco from "../hooks/userQuiosco";
import clienteAxios from "../config/axios";
import { IProducto } from "../data/productos";

const Inicio = () => {
  const { categoriaActual } = useQuiosco() as ContexType;
  const [busqueda, setBusqueda] = useState<string>(""); 

  // Consulta SWR
  const fetcher = () =>
    clienteAxios("productos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
      },
    }).then((data) => data.data);

  const { data, isLoading } = useSWR("productos", fetcher, {
    refreshInterval: 1000,
  });

  if (isLoading) return "Cargando...";

  const productos = data.data.filter(
    (producto: IProducto) =>
      producto.categoria_id === categoriaActual.id &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h1 className="text-4xl font-black">{categoriaActual?.nombre}</h1>

      <p className="my-10 text-2xl">
        Elige y personaliza tu pedido a continuación
      </p>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productos.length > 0 ? (
          productos.map((producto: IProducto) => (
            <Producto key={producto.id} {...producto} />
          ))
        ) : (
          <p className="text-xl text-gray-600">No se encontraron productos.</p>
        )}
      </div>
    </>
  );
};

export default Inicio;