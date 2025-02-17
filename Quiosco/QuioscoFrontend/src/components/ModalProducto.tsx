import Modal from "react-modal";
import { ContexType } from "../context/QuioscoProvider";
import useQuiosco from "../hooks/userQuiosco";
import { formatearDinero } from "../helpers";
import { useState, useEffect } from "react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalProducto = () => {
  const { modal, handleClickModal, producto, handleAgregarPedido, pedido } =
    useQuiosco() as ContexType;
  const [cantidad, setCantidad] = useState<number>(1);
  const [edicion, setEdicion] = useState<boolean>(false);

  useEffect(() => {
    if (pedido.some((pedidoState) => pedidoState.id === producto.id)) {
      const productoEdiciion = pedido.filter(
        (pedidoState) => pedidoState.id === producto.id
      )[0];
      setCantidad(productoEdiciion.cantidad!);
      setEdicion(true);
    }
  }, [pedido]);

  return (
    <Modal
      isOpen={modal}
      onRequestClose={handleClickModal}
      style={customStyles}
      contentLabel="Quiosco"
    >
      <div className="gap-10 md:flex">
        <div className="md:w-1/3">
          <img
            src={`/img/${producto.imagen}.jpg`}
            alt={`Producto ${producto.nombre}`}
          />
        </div>

        <div className="md:w-2/3">
          <div className="flex justify-end">
            <button onClick={handleClickModal} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <h1 className="mt-5 text-3xl font-bold">{producto.nombre}</h1>
          <p className="mt-5 text-5xl font-black text-amber-500">
            {formatearDinero(producto.precio)}
          </p>

          <div className="flex gap-4 mt-5">
            <button
              type="button"
              onClick={() => {
                if (cantidad <= 1) return;
                setCantidad(cantidad - 1);
              }}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>

            <p className="text-3xl">{cantidad}</p>

            <button
              type="button"
              onClick={() => {
                if (cantidad >= 5) return;
                setCantidad(cantidad + 1);
              }}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              handleAgregarPedido({ ...producto, cantidad });
              handleClickModal();
            }}
            type="button"
            className="px-5 py-2 mt-5 font-bold text-white uppercase bg-indigo-600 rounded cursor-pointer hover:bg-indigo-800"
          >
            {edicion ? "Guardar Cambios" : "Añadir al Pedido"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProducto;
