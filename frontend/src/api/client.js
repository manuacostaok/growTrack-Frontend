import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({ baseURL, withCredentials: true });

let accessToken = null;
export function setAccessToken(token) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const esLlamadaDeRefresh = original?.url?.includes('/auth/refresh');

    // Si falla el propio /auth/refresh (ej: visitante sin sesión todavía), no reintentamos
    // ni redirigimos acá — dejamos que RequireAuth decida, para no generar un loop de recargas.
    if (esLlamadaDeRefresh || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      refreshing = refreshing || api.post('/auth/refresh');
      const { data } = await refreshing;
      refreshing = null;
      setAccessToken(data.data.accessToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      refreshing = null;
      setAccessToken(null);
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  }
);

// Aviso genérico para lo que ninguna pantalla maneja puntualmente: sin conexión o error del servidor.
api.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    toast.error('No hay conexión con el servidor. Revisá tu internet.');
  } else if (error.response.status >= 500) {
    toast.error('Algo falló de nuestro lado. Probá de nuevo en un momento.');
  }
  return Promise.reject(error);
});

export default api;
