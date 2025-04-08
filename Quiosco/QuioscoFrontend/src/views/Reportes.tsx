import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import clienteAxios from "../config/axios";
import { format, endOfDay, startOfDay, addDays } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const tabs = ["Días Populares", "Horarios Populares", "Top Productos", "Top Categorías", "Reporte Financiero"];

const Reportes = () => {
  const [desdeInput, setDesdeInput] = useState<string>(format(startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), "yyyy-MM-dd"));
  const [hastaInput, setHastaInput] = useState<string>(format(new Date(Date.now()), "yyyy-MM-dd"));
  const [activeTab, setActiveTab] = useState("Días Populares");
  const [diasPopulares, setDiasPopulares] = useState([]);
  const [horariosPopulares, setHorariosPopulares] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [topCategorias, setTopCategorias] = useState([]);
  const [reporteFinanciero, setReporteFinanciero] = useState({ total_ventas: 0, ventas_diarias: [] });

  const fetchData = async () => {
    const desde = format(startOfDay(new Date(desdeInput)), "yyyy-MM-dd HH:mm:ss");
    const hasta = format(endOfDay(addDays(new Date(hastaInput),1)), "yyyy-MM-dd HH:mm:ss");
    console.log("Fechas:", desde, hasta);
    console.log("FechasInput:", desdeInput, hastaInput);
    console.log(new Date())
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}` };

      const [diasRes, horariosRes, productosRes, categoriasRes, financieroRes] = await Promise.all([
        clienteAxios.get(`/reportes/dias-populares?desde=${desde}&hasta=${hasta}`, { headers }),
        clienteAxios.get(`/reportes/horas-populares?desde=${desde}&hasta=${hasta}`, { headers }),
        clienteAxios.get(`/reportes/top-productos?desde=${desde}&hasta=${hasta}`, { headers }),
        clienteAxios.get(`/reportes/top-categorias?desde=${desde}&hasta=${hasta}`, { headers }),
        clienteAxios.get(`/reportes/reporte-financiero?desde=${desde}&hasta=${hasta}`, { headers }),
      ]);

      //console.logs
        console.log("Días Populares:", diasRes.data);
        console.log("Horarios Populares:", horariosRes.data);
        console.log("Top Productos:", productosRes.data);
        console.log("Top Categorías:", categoriasRes.data);
        console.log("Reporte Financiero:", financieroRes.data);
         
      setDiasPopulares(diasRes.data);
      setHorariosPopulares(horariosRes.data);
      setTopProductos(productosRes.data);
      setTopCategorias(categoriasRes.data);
      setReporteFinanciero(financieroRes.data);
    } catch (error) {
      console.error("Error al obtener los datos de los reportes:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [desdeInput, hastaInput]);

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      {/* Filtros de fecha */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold mb-1">Desde</label>
          <input
            type="date"
            value={desdeInput}
            onChange={(e) => setDesdeInput(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Hasta</label>
          <input
            type="date"
            value={hastaInput}
            onChange={(e) => setHastaInput(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>


      <div className="mb-6">
        <div className="flex space-x-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>


      {activeTab === "Días Populares" && (
        <div className="mb-8">
          <Bar
            data={{
              labels: diasPopulares.map((dia) => dia.dia),
              datasets: [
                {
                  label: "Pedidos",
                  data: diasPopulares.map((dia) => dia.total),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        </div>
      )}

      {activeTab === "Horarios Populares" && (
        <div className="mb-8">
          <Bar
            data={{
              labels: horariosPopulares.map((hora) => `${hora.hora}:00`),
              datasets: [
                {
                  label: "Pedidos",
                  data: horariosPopulares.map((hora) => hora.total),
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
              ],
            }}
          />
        </div>
      )}

        {activeTab === "Top Productos" && (
        <div className="mb-8 flex justify-center">
            <div className="w-1/2">
            <Pie
                data={{
                labels: topProductos.map((producto) => producto.nombre),
                datasets: [
                    {
                    label: "Cantidad Vendida",
                    data: topProductos.map((producto) => producto.total_vendidos),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                    ],
                    },
                ],
                }}
                options={{
                plugins: {
                    legend: {
                    position: "bottom",
                    },
                },
                }}
            />
            </div>
        </div>
        )}

      {activeTab === "Top Categorías" && (
        <div className="mb-8">
          <Bar
            data={{
              labels: topCategorias.map((categoria) => categoria.categoria_nombre),
              datasets: [
                {
                  label: "Cantidad Vendida",
                  data: topCategorias.map((categoria) => categoria.total_vendidos),
                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                },
              ],
            }}
          />
        </div>
      )}

      {activeTab === "Reporte Financiero" && (
        <div className="mb-8">
          <p className="mb-4 font-bold">Total Ventas: ${reporteFinanciero.total_ventas}</p>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Fecha</th>
                <th className="border border-gray-300 px-4 py-2">Total Diario</th>
              </tr>
            </thead>
            <tbody>
              {reporteFinanciero.ventas_diarias.map((venta) => (
                <tr key={venta.fecha}>
                  <td className="border border-gray-300 px-4 py-2">{venta.fecha}</td>
                  <td className="border border-gray-300 px-4 py-2">${venta.total_diario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Reportes;