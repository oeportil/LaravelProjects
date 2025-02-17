import useSWR from "swr";
import Producto from "../components/Producto";
import { ContexType } from "../context/QuioscoProvider";
import useQuiosco from "../hooks/userQuiosco";
import clienteAxios from "../config/axios";
import { IProducto } from "../data/productos";
const Inicio = () => {
  const { categoriaActual } = useQuiosco() as ContexType;

  //Consulta SWR
  const fetcher = () => clienteAxios("productos").then((data) => data.data);
  const { data, error, isLoading } = useSWR("productos", fetcher, {
    refreshInterval: 1000,
  });

  if (isLoading) return "Cargando...";
  const productos = data.data.filter(
    (producto: IProducto) => producto.categoria_id === categoriaActual.id
  );
  return (
    <>
      <h1 className="text-4xl font-black">{categoriaActual.nombre}</h1>

      <p className="my-10 text-2xl">
        Elige y personaliza tu pedido a continuación
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productos.map((producto: IProducto) => (
          <Producto key={producto.id} {...producto} />
        ))}
      </div>
    </>
  );
};

export default Inicio;
