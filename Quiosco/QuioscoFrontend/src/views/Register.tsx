import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import { useAuth } from "../hooks/useAuth";
const Register = () => {
  const [errores, setErrores] = useState<string[]>([]);
  const { register } = useAuth({ middleware: "guest", url: "/" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") ?? "";
    const email = formData.get("email") ?? "";
    const password = formData.get("password") ?? "";
    const password_confirmation = formData.get("password_confirmation") ?? "";
    const datos = {
      name,
      email,
      password,
      password_confirmation,
    };
    console.log(datos);
    register(datos, setErrores);
  };

  return (
    <>
      <h1 className="text-4xl font-black">Crea tu Cuenta</h1>
      <p>Crea tu Cuenta llenando el formulario</p>

      <div className="px-5 py-10 mt-10 bg-white rounded-md shadow-sm">
        <form action="" onSubmit={handleSubmit} noValidate>
          {errores &&
            errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)}

          <div className="mb-4">
            <label htmlFor="name" className="text-slate-800">
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3 mt-2 bg-gray-50"
              placeholder="Tu Nombre"
            />
          </div>

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

          <div className="mb-4">
            <label htmlFor="password_confirmation" className="text-slate-800">
              Repetir Password:
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className="w-full p-3 mt-2 bg-gray-50"
              placeholder="Tu Password Repetido"
            />
          </div>
          <input
            type="submit"
            value={"Crear Cuenta"}
            className="w-full p-3 mt-5 text-sm font-bold text-white uppercase transition-colors ease-in bg-indigo-800 cursor-pointer hover:bg-indigo-600"
          />
        </form>
      </div>

      <nav className="mt-5">
        <Link to={"/auth"}>¿No tienes cuenta? Crea una</Link>
      </nav>
    </>
  );
};

export default Register;
