import { useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import ProductoAdminCard from "../components/ProductoAdminCard";
import CrearProductoModal from "../components/CrearProductoModal";
import { IProducto } from "../data/productos";
import { ICategoria } from "../data/categorias";
import EditarProductoModal from "../components/EditarProductoModal";
import GestionarDescuentoModal from "../components/GestionarDescuentoModal";
import SubirImagenModal from "../components/SubirImagenModal";

const Productos = () => {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<IProducto | null>(null);
  const [mostrarModalDescuento, setMostrarModalDescuento] = useState(false);
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);

  const token = localStorage.getItem("AUTH_TOKEN");

  const obtenerProductos = async () => {
    try {
      const { data } = await clienteAxios("/productosadmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(data.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const { data } = await clienteAxios("/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(data.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCategoria = filtroCategoria === "" || producto.categoria_id === parseInt(filtroCategoria);
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Administrar Productos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Crear Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="p-2 border rounded"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {productosFiltrados.map((producto) => (
          <ProductoAdminCard
            key={producto.id}
            producto={producto}
            onUpdate={obtenerProductos}
            onEdit={() => {
              setProductoSeleccionado(producto);
              setMostrarModalEditar(true);
            }}
            onDescuento={() => {
              setProductoSeleccionado(producto);
              setMostrarModalDescuento(true);
            }}
            onImagen={() => {
              setProductoSeleccionado(producto);
              setMostrarModalImagen(true);
            }}
          />
        ))}
      </div>

      {/* Modal Crear Producto */}
      {mostrarModal && (
        <CrearProductoModal
          onClose={() => setMostrarModal(false)}
          onRefresh={obtenerProductos}
          categorias={categorias}
          isOpen={true}
        />
      )}

      {/* Modal Editar Producto */}
      {productoSeleccionado && (
        <EditarProductoModal
          isOpen={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          producto={productoSeleccionado}
          onUpdate={obtenerProductos}
        />
      )}

      {/* Modal Gestionar Descuento */}
      {productoSeleccionado && (
        <GestionarDescuentoModal
          isOpen={mostrarModalDescuento}
          onClose={() => setMostrarModalDescuento(false)}
          productoId={productoSeleccionado.id}
          onUpdate={obtenerProductos}
        />
      )}

      {/* Modal Subir Imagen */}
      {productoSeleccionado && (
        <SubirImagenModal
          isOpen={mostrarModalImagen}
          onClose={() => setMostrarModalImagen(false)}
          productoId={productoSeleccionado.id}
          onUpdate={obtenerProductos}
        />
      )}
    </div>
  );
};

export default Productos;
