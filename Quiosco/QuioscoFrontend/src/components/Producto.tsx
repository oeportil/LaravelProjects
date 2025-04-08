import { ContexType } from "../context/QuioscoProvider";
import { IProducto } from "../data/productos";
import { formatearDinero } from "../helpers";
import { useAuth } from "../hooks/useAuth";
import useQuiosco from "../hooks/userQuiosco";

const Producto = (producto: IProducto) => {
  const { handleClickModal, handleSetProducto, handleClickProductoAgotado, urlImagenProducto } =
    useQuiosco() as ContexType;
  const { nombre, precio, descuento_activo } = producto;
  const { isAdmin } = useAuth({});
  const admin = isAdmin();

  // Calcular el precio con descuento
  const descuento = descuento_activo
    ? precio * (descuento_activo.porcentaje / 100)
    : 0;
  const precioConDescuento = precio - descuento;

  return (
    <div className="p-3 bg-white border border-gray-300 shadow">
      <img
        src={urlImagenProducto(producto)}
        alt={`Imagen de ${nombre}`}
        className="w-full"
      />
      <div className="p-5">
        <h3 className="text-2xl font-bold">{nombre}</h3>
        {producto.descripcion && (
          <p className="mt-2 text-gray-600">{producto.descripcion}</p>
        )}
        <p className="mt-5 text-4xl font-black text-amber-500">
          {formatearDinero(precio)}
        </p>
        {descuento_activo && (
          <>
            <p className="mt-2 text-lg font-semibold text-green-600">
              Descuento: {descuento_activo.porcentaje}%
            </p>
            <p className="mt-2 text-2xl font-bold text-green-500">
              Oferta: {formatearDinero(precioConDescuento)}
            </p>
          </>
        )}
        {!admin ? (
          <button
            onClick={() => {
              handleClickModal();
              handleSetProducto(producto);
            }}
            type="button"
            className="w-full p-3 mt-5 font-bold text-white uppercase bg-indigo-600 cursor-pointer hover:bg-indigo-800"
          >
            Agregar
          </button>
        ) : (
          <button
            type="button"
            className="w-full p-3 mt-5 font-bold text-white uppercase bg-indigo-600 cursor-pointer hover:bg-indigo-800"
            onClick={() => handleClickProductoAgotado(producto.id)}
          >
            Producto Agotado
          </button>
        )}
      </div>
    </div>
  );
};

export default Producto;
