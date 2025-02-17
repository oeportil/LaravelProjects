import Logo from '/img/logo.svg';
import useQuiosco from '../hooks/userQuiosco';
import Categoria from './Categoria';
import { ContexType } from '../context/QuioscoProvider';

const Sidebar = () => {
    const { categorias } = useQuiosco() as ContexType;
  return (
    <aside className="md:w-72">
        <div className="p-4">
            <img src={Logo} alt="" />
        </div>

        <div className='mt-10'>
            {categorias.map(categoria => 
                <Categoria 
                    key={categoria.id}
                    {...categoria}
                />
            )}
        </div>

        <div className='px-5 my-5 '>
            <button type='button' className='w-full p-3 font-bold text-center text-white truncate bg-red-500'>Cancelar Orden</button>
        </div>
    </aside>
  )
}

export default Sidebar