import { BrowserRouter, Routes, Route  } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Register from "./views/Register";

const Router = () => {
  return (
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout/>}>
              <Route index element={<Inicio/>} />
          </Route>
          <Route path="auth" element={<AuthLayout/>}>
              <Route index element={<Login/>} />
              <Route path="registro" element={<Register/>} />
          </Route>
      </Routes>
  </BrowserRouter>
  )
}
export default Router