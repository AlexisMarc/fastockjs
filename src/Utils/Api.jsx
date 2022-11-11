import Cookies from 'universal-cookie';
const baseUrl = "http://localhost:8083/api/";
const cookies = new Cookies();

export const Sesion = () => {
    if (!cookies.get('token')) {
        window.location.href = "./login";
    }
}
export const CerrarSesion = () => {
        cookies.remove('token', { path: "/" });
        window.location.href = "./login";
}

const autorizacion = { headers: {"Authorization" : `Bearer ${cookies.get('token')}`} };

export { baseUrl, autorizacion};