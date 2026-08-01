import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '../api/client';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.data.accessToken);
        const { user } = await meRequest();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  async function login(email, password) {
    const { user, accessToken } = await loginRequest({ email, password });
    setAccessToken(accessToken);
    setUser(user);
  }

  async function register(nombre, email, password) {
    const { user, accessToken } = await registerRequest({ nombre, email, password });
    setAccessToken(accessToken);
    setUser(user);
  }

  async function logout() {
    await logoutRequest().catch(() => {});
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
