import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ICategoria } from "../data/categorias";
import { IProducto } from "../data/productos";
import clienteAxios from "../config/axios";

const QuioscoContext = createContext({});

interface IContext {
  children: ReactNode;
}

export type ContexType = {
  categorias: Array<ICategoria>;
  categoriaActual: ICategoria;
  handleClickCategoria: (categ: ICategoria) => void;
  handleClickModal: () => void;
  modal: boolean;
  handleSetProducto: (producto: IProducto) => void;
  producto: IProducto;
  pedido: Array<IProducto>;
  handleAgregarPedido: (producto: IProducto) => void;
  handleEditarCantidad: (id: number) => void;
  handleEliminarProducto: (id: number) => void;
  total: number;
  handleSubmitNuevaOrden: (logout: () => void) => void;
  handleClickCompletarPedido: (id: number) => void;
  handleClickProductoAgotado: (id: number) => void;
};

export const QuioscoProvider = ({ children }: IContext) => {
  const [categorias, setCategorias] = useState<Array<ICategoria>>([]);
  const [categoriaActual, setCategoriaActual] = useState<ICategoria>({
    icono: "",
    id: 0,
    nombre: "",
  });
  const [modal, setModal] = useState<boolean>(false);
  const [producto, setProducto] = useState<IProducto>({
    categoria_id: 0,
    id: 0,
    imagen: "",
    nombre: "",
    precio: 0,
  });
  const [pedido, setPedido] = useState<Array<IProducto>>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (total, producto) => producto.precio * producto.cantidad! + total,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);

  const ObtenerCategorias = async () => {
    try {
      const { data } = await clienteAxios.get("categorias", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
      setCategorias(data.data);
      setCategoriaActual(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ObtenerCategorias();
  }, []);

  const handleClickCategoria = (categ: ICategoria) => {
    setCategoriaActual(categ);
  };

  const handleClickModal = () => {
    setModal(!modal);
  };
  const handleSetProducto = (producto: IProducto) => {
    setProducto(producto);
  };

  const handleAgregarPedido = ({ categoria_id, ...producto }: IProducto) => {
    if (pedido.some((pedidoState) => pedidoState.id === producto.id)) {
      const pedidoActualizado = pedido.map((pedidoState) =>
        pedidoState.id === producto.id ? producto : pedidoState
      );
      setPedido(pedidoActualizado);
      toast.info(`Actualizaste la cantidad de ${producto.nombre} en el pedido`);
    } else {
      setPedido([...pedido, producto]);
      toast.success(`Agregaste ${producto.nombre} al pedido`);
    }
  };

  const handleEditarCantidad = (id: number) => {
    const productoaActualizar = pedido.filter(
      (pedidoState) => pedidoState.id === id
    )[0];
    setProducto(productoaActualizar);
    setModal(!modal);
  };
  const handleEliminarProducto = (id: number) => {
    const pedidoActualizado = pedido.filter(
      (pedidoState) => pedidoState.id !== id
    );
    setPedido(pedidoActualizado);
    toast.error(`Eliminaste ${producto.nombre} del pedido`);
  };

  const handleSubmitNuevaOrden = async (logout: () => void) => {
    try {
      const { data } = await clienteAxios.post(
        "pedidos",
        {
          total,
          productos: pedido.map((producto) => {
            return {
              id: producto.id,
              cantidad: producto.cantidad,
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          },
        }
      );
      toast.success(data.message);
      setTimeout(() => {
        setPedido([]);
      }, 1000);

      setTimeout(() => {
        localStorage.removeItem("AUTH_TOKEN");
        logout();
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickCompletarPedido = async (id: number) => {
    try {
      const { data } = await clienteAxios.put(`productos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickProductoAgotado = async (id: number) => {
    try {
      const { data } = await clienteAxios.put(`pedidos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <QuioscoContext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        handleClickModal,
        modal,
        handleSetProducto,
        producto,
        pedido,
        handleAgregarPedido,
        handleEditarCantidad,
        handleEliminarProducto,
        total,
        handleSubmitNuevaOrden,
        handleClickCompletarPedido,
        handleClickProductoAgotado,
      }}
    >
      {children}
    </QuioscoContext.Provider>
  );
};

export default QuioscoContext;
