import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  useAuth({ middleware: "admin" });
  return (
    <div className="md:flex">
      <AdminSidebar />

      <main className="flex-1 h-screen p-3 overflow-y-scroll bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
