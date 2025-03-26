import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Register from "./views/Register";
import AdminLayout from "./layouts/AdminLayout";
import Ordenes from "./views/Ordenes";
import Productos from "./views/Productos";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="registro" element={<Register />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Ordenes />} />
          <Route path="productos" element={<Productos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
