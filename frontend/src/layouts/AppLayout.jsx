import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/cultivos', label: 'Cultivos' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/comparador', label: 'Comparador' },
  { to: '/conocimiento', label: 'Base de conocimiento' },
  { to: '/ia', label: 'Diagnóstico IA' },
  { to: '/planes', label: 'Planes' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-[232px] flex-shrink-0 flex-col gap-6 border-r border-borderDim p-3.5">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-[5px] bg-gradient-to-br from-chloro to-resin" />
          <span className="font-display text-[15px] font-semibold tracking-tight">GrowTrack Pro</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 pt-2.5 text-[11px] uppercase tracking-wider text-textFaint">
            Espacio de trabajo
          </div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-surface2 text-text' : 'text-textDim hover:bg-surfaceHover hover:text-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user?.rol === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `mt-2 rounded-lg border-t border-borderDim px-2.5 pt-3 pb-2 text-[13.5px] font-medium transition ${
                  isActive ? 'text-resin' : 'text-textDim hover:text-text'
                }`
              }
            >
              Panel Admin
            </NavLink>
          )}
        </nav>

        <div className="mt-auto border-t border-borderDim pt-2.5 text-xs text-textFaint">
          <div className="mb-2 truncate">{user?.email}</div>
          <button onClick={logout} className="text-textDim hover:text-text">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
