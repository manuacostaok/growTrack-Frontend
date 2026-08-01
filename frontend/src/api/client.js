import axios from 'axios';

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

export default api;
