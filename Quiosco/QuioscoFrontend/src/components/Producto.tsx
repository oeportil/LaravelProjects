import { ContexType } from '../context/QuioscoProvider';
import { IProducto } from '../data/productos'
import { formatearDinero } from '../helpers'
import useQuiosco from '../hooks/userQuiosco';

const Producto = (producto: IProducto) => {
  const { handleClickModal, handleSetProducto  } = useQuiosco() as ContexType;
    const {imagen, nombre, precio} = producto
  return (
    <div className='p-3 bg-white border border-gray-300 shadow'>
        <img src={`/img/${imagen}.jpg`} alt={`Imagen de ${nombre}`} className='w-full'/>
        <div className='p-5 '>
            <h3 className='text-2xl font-bold'>{nombre}</h3>
            <p className='mt-5 text-4xl font-black text-amber-500'>{formatearDinero(precio)}</p>
            <button onClick={() => {
              handleClickModal();
              handleSetProducto(producto)
            }} type='button' 
              className='w-full p-3 mt-5 font-bold text-white uppercase bg-indigo-600 cursor-pointer hover:bg-indigo-800'>
                Agregar
            </button>
        </div>
    </div>
  )
}

export default Producto