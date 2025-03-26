import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
  const [errores, setErrores] = useState<string[]>([]);
  const { login } = useAuth({ middleware: "guest", url: "/" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") ?? "";
    const password = formData.get("password") ?? "";
    const datos = {
      email,
      password,
    };
    login(datos, setErrores);
  };

  return (
    <>
      <h1 className="text-4xl font-black">Iniciar Sesión</h1>
      <p>Crea tu Pedido</p>
      <div className="px-5 py-10 mt-10 bg-white rounded-md shadow-sm">
        <form action="" onSubmit={handleSubmit} noValidate>
          {errores &&
            errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}
          <div className="mb-4">
            <label htmlFor="email" className="text-slate-800">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 mt-2 bg-gray-50"
              placeholder="Tu Email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="text-slate-800">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 mt-2 bg-gray-50"
              placeholder="Tu Password"
            />
          </div>
          <input
            type="submit"
            value={"Iniciar Sesión"}
            className="w-full p-3 mt-5 text-sm font-bold text-white uppercase transition-colors ease-in bg-indigo-800 cursor-pointer hover:bg-indigo-600"
          />
        </form>
      </div>

      <nav className="mt-5">
        <Link to={"registro"}>¿No tienes cuenta? Crea una</Link>
      </nav>
    </>
  );
};

export default Login;
