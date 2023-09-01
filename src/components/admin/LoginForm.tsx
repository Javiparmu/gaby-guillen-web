import { type FC, type FormEvent, useState } from 'react';
import {toast, Toaster} from 'sonner';
import { toastDuration } from '../../utils/constants';
import { setCookie } from '../../utils/helpers';

const LoginForm: FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();

        if (username === "admin" && password === "admin12345") {
            setCookie("session", JSON.stringify({
                username,
                password
            }), 30);

            window.location.href = "/admin/dashboard";
        } else {
            showToast();
            
            setUsername("");
            setPassword("");
        }
    };

    const showToast = () => {
        toast.error('Usuario o contraseña incorrectos', {
            duration: toastDuration,
        });            
    };

    return (
        <>
            <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Inicia sesión en tu cuenta
                        </h1>
                        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 md:space-y-6" autoComplete="off">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre de usuario" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Iniciar sesión</button>
                        </form>
                    </div>
                </div>
            </section>
            <Toaster position='bottom-right' closeButton />
        </>
    );
};

export default LoginForm;

