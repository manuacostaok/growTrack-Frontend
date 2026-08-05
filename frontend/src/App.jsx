import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cultivos from './pages/Cultivos';
import CultivoDetail from './pages/CultivoDetail';
import Galeria from './pages/Galeria';
import Planes from './pages/Planes';
import Estadisticas from './pages/Estadisticas';
import Comparador from './pages/Comparador';
import Calendario from './pages/Calendario';
import Conocimiento from './pages/Conocimiento';
import DiagnosticoIA from './pages/DiagnosticoIA';
import Admin from './pages/Admin';
import RequireAdmin from './components/RequireAdmin';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#12160F',
              color: '#EDF1E8',
              border: '1px solid #333C2C',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '10px',
              boxShadow: '0 10px 32px -12px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#5C9B6C', secondary: '#0B140D' } },
            error: { iconTheme: { primary: '#C97456', secondary: '#0B140D' } },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cultivos" element={<Cultivos />} />
                <Route path="/cultivos/:id" element={<CultivoDetail />} />
                <Route path="/cultivos/:id/galeria" element={<Galeria />} />
                <Route path="/planes" element={<Planes />} />
                <Route path="/cultivos/:id/estadisticas" element={<Estadisticas />} />
                <Route path="/comparador" element={<Comparador />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/conocimiento" element={<Conocimiento />} />
                <Route path="/ia" element={<DiagnosticoIA />} />

                <Route element={<RequireAdmin />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
