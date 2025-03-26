import Logo from "/img/logo.svg";
import useQuiosco from "../hooks/userQuiosco";
import Categoria from "./Categoria";
import { ContexType } from "../context/QuioscoProvider";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { categorias } = useQuiosco() as ContexType;
  const { logout, user } = useAuth({ middleware: "auth" });
  return (
    <aside className="md:w-72">
      <div className="p-4">
        <img src={Logo} alt="" />
      </div>
      <p className="my-10 text-xl text-center">Hola: {user?.name}</p>
      <div className="mt-10">
        {categorias.map((categoria) => (
          <Categoria key={categoria.id} {...categoria} />
        ))}
      </div>

      <div className="px-5 my-5 ">
        <button
          type="button"
          className="w-full p-3 font-bold text-center text-white truncate bg-red-500 cursor-pointer"
          onClick={logout}
        >
          Cancelar Orden
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
