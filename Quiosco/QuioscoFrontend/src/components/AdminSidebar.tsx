import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminSidebar = () => {
  const { logout } = useAuth({});
  return (
    <aside className="h-screen md:w-72">
      <div className="p-4">
        <img src="/img/logo.svg" alt="Imagen Logotip" className="w-40" />
      </div>
      <nav className="flex flex-col p-4">
        <Link to={"/admin"} className="text-lg font-bold">
          Ordenes
        </Link>
        <Link to={"/admin/productos"} className="text-lg font-bold">
          Productos
        </Link>
      </nav>
      <div className="px-5 my-5">
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

export default AdminSidebar;
