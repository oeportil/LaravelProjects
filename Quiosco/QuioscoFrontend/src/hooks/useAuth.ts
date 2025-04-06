import { AxiosError } from "axios";
import clienteAxios from "../config/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthHookProps = {
    middleware?: 'guest' | 'auth' | 'admin';
    url?: string;
}

interface User {
    id?: number;
    name?: string;
    email?: string;
    admin?: boolean;
    [key: string]: any;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface ErrorResponse {
    errors: Record<string, string[]>;
}

export const useAuth = ({ middleware, url }: AuthHookProps = {}) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('USER');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [error, setError] = useState<string[]>([]);
    const navigate = useNavigate();

    const updateUserStorage = (userData: User | null, token?: string) => {
        if (userData && token) {
            localStorage.setItem("AUTH_TOKEN", token);
            localStorage.setItem("USER", JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem('AUTH_TOKEN');
            localStorage.removeItem('USER');
            setUser(null);
        }
    };

    const login = async (datos: { email: string; password: string }, setErrores?: (errores: string[]) => void) => {
        try {
            const { data } = await clienteAxios.post<AuthResponse>("login", datos);
            updateUserStorage(data.user, data.token);
            setError([]);
            if (setErrores) setErrores([]);
            return data;
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessages = Object.values(err.response?.data?.errors ?? {}).flat();
            setError(errorMessages);
            if (setErrores) setErrores(errorMessages);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await clienteAxios.post('logout', null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`
                }
            });
            updateUserStorage(null);
            navigate('/auth');
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessages = Object.values(err.response?.data?.errors ?? {}).flat();
            setError(errorMessages);
            throw errorMessages;
        }
    };

    const register = async (datos: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string
    }, setErrores?: (errores: string[]) => void) => {
        try {
            const { data } = await clienteAxios.post<AuthResponse>("register", datos);
            updateUserStorage(data.user, data.token);
            setError([]);
            if (setErrores) setErrores([]);
            return data;
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const errorMessages = Object.values(err.response?.data?.errors ?? {}).flat();
            setError(errorMessages);
            if (setErrores) setErrores(errorMessages);
            throw error;
        }
    };

    const isAdmin = () => user?.admin || false;

    useEffect(() => {
        if (middleware === 'guest' && url && user) {
            navigate(url);
        }
        if (middleware === 'guest' && user?.admin) {
            navigate('/admin');
        }
        if (middleware === 'admin' && !user?.admin) {
            navigate('/');
        }
        if (middleware === 'auth' && !user) {
            navigate('/auth');
        }
    }, [user, middleware, url, navigate]);

    return {
        login,
        logout,
        register,
        user,
        error,
        isAdmin,
        setUser
    };
};