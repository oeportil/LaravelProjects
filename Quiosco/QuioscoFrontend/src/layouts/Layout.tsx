import { Outlet } from "react-router-dom";
import Modal from "react-modal";
import Sidebar from "../components/Sidebar";
import Resumen from "../components/Resumen";
import ModalProducto from "../components/ModalProducto";
import { ToastContainer } from "react-toastify";

Modal.setAppElement("#root");

const Layout = () => {
  return (
    <>
      <div className="md:flex">
        <Sidebar />

        <main className="flex-1 h-screen p-3 overflow-y-scroll bg-gray-100">
          <Outlet />
        </main>
        <Resumen />
      </div>
      <ModalProducto />

      <ToastContainer />
    </>
  );
};

export default Layout;
