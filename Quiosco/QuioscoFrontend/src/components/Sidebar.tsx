import Logo from "/img/logo.svg";
import useQuiosco from "../hooks/userQuiosco";
import Categoria from "./Categoria";
import { ContexType } from "../context/QuioscoProvider";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { categorias } = useQuiosco() as ContexType;
  const { logout, user } = useAuth({ middleware: "auth" });
  const navigate = useNavigate();

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

      <div className="px-5 my-5">
        <button
          type="button"
          className="w-full p-3 mb-3 font-bold text-center text-white truncate bg-blue-500 cursor-pointer hover:bg-blue-700"
          onClick={() => navigate("/historial-pedidos")}
        >
          Ver Pedidos Pasados
        </button>
        <button
          type="button"
          className="w-full p-3 font-bold text-center text-white truncate bg-red-500 cursor-pointer"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
