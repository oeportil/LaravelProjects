import { ContexType } from "../context/QuioscoProvider"
import { ICategoria } from "../data/categorias"
import useQuiosco from "../hooks/userQuiosco"

const Categoria = (categoria: ICategoria) => {
  const {handleClickCategoria, categoriaActual} = useQuiosco() as ContexType
    const { icono, nombre, id } = categoria
  return (
    <button className={`${categoriaActual.id === id ? 'bg-amber-400' : 'bg-white'} flex items-center w-full gap-4 p-3 border-gray-200 cursor-pointer border-y hover:bg-amber-400`}
        onClick={() => handleClickCategoria(categoria)}>
        <img src={`/img/icono_${icono}.svg`} alt="Imagen Icono" className="w-12"/>
        <p className="text-lg font-bold truncate cursor-pointer">{nombre}</p>
    </button>
  )
}

export default Categoria