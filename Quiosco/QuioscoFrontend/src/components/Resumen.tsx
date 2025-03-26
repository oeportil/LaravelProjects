import { ContexType } from "../context/QuioscoProvider";
import { formatearDinero } from "../helpers";
import { useAuth } from "../hooks/useAuth";
import useQuiosco from "../hooks/userQuiosco";
import ResumenPedido from "./ResumenPedido";
const Resumen = () => {
  const { pedido, total, handleSubmitNuevaOrden } = useQuiosco() as ContexType;
  const { logout } = useAuth({});
  const comprobarPedido = () => pedido.length === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSubmitNuevaOrden(logout);
  };

  return (
    <aside className="h-screen p-5 overflow-y-scroll w-72">
      <h1 className="text-4xl font-black"> </h1>
      <p className="my-5 text-lg">
        Aquí podrás ver el resumen y totales de tu pedido
      </p>

      <div className="py-10">
        {pedido.length === 0 ? (
          <p className="text-2xl text-center">
            No hay elementos en tu pedido aún
          </p>
        ) : (
          pedido.map((producto) => <ResumenPedido {...producto} />)
        )}
      </div>
      <p className="mt-10 text-xl">Total: {formatearDinero(total)}</p>

      <form action="" className="w-full" onSubmit={handleSubmit}>
        <div className="mt-5">
          <input
            type="submit"
            className={`${
              comprobarPedido()
                ? "bg-indigo-100 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-800 cursor-pointer"
            } w-full px-5 py-2 
            font-bold text-center text-white uppercase rounded`}
            value={"Confirmar Pedido"}
            disabled={comprobarPedido()}
          />
        </div>
      </form>
    </aside>
  );
};

export default Resumen;
