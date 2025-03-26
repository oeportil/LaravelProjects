import { AxiosError } from "axios";
import clienteAxios from "../config/axios";
import useSWR from "swr";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthHookProps = {
    middleware?: string,
    url?: string
}   

interface datos {
    email?: FormDataEntryValue,
    password?: FormDataEntryValue,
    name?: FormDataEntryValue,
    password_confirmation?: FormDataEntryValue,
}
export const useAuth = ({middleware, url}: AuthHookProps) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();
    
    const {data: user, error, mutate} = useSWR('/user', () => 
        clienteAxios('/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data)
        .catch(error => {
            throw Error(error.response.data.errors)
        })
    );

    const login = async(datos: datos, setErrores: (errores: string[]) => void) => {
        try {
            const { data } = await clienteAxios.post("login", datos);
            localStorage.setItem("AUTH_TOKEN", data.token);
            setErrores([]);
            await mutate()
          } catch (error: unknown) {
            const err = error as AxiosError<{ errors: { [key: string]: string } }>;
            console.error(err);
            setErrores(Object.values(err.response?.data?.errors ?? {}));
          }
    }
    const logout = async() => {
        try {
            await clienteAxios.post('logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('AUTH_TOKEN');
            await mutate(undefined);
        } catch (error) {
            throw Error(error.response.data.errors)
        }
    }
    const register = async(datos: datos, setErrores: (errores: string[])  => void) => {
        try {
            const {data} = await clienteAxios.post("register", datos);
            localStorage.setItem("AUTH_TOKEN", data.token);
            setErrores([]);
            await mutate()
          } catch (error: unknown) {
            const err = error as AxiosError<{ errors: { [key: string]: string } }>;
            console.error(err);
            setErrores(Object.values(err.response?.data?.errors ?? {}));
          }
    }
    const isAdmin = () => user.admin

    useEffect(() => {
        if(middleware === 'guest' && url && user){
            navigate(url);
        }
        if(middleware === 'guest' && user && user.admin) navigate('/admin');
        
        if(middleware === 'admin' && user && !user.admin)
            navigate('/');
        
        if(middleware === 'auth' && error) {
            navigate('/auth');
        }
    }, [user, error])   

    return {
        login,
        logout,
        register,
        user,
        error,
        isAdmin
    }
}