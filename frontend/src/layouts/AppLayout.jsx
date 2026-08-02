import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Sprout, Calendar, GitCompare, BookOpen, Sparkles, CreditCard, ShieldCheck, X, MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/cultivos', label: 'Cultivos', icon: Sprout },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
  { to: '/comparador', label: 'Comparador', icon: GitCompare },
  { to: '/conocimiento', label: 'Base de conocimiento', icon: BookOpen },
  { to: '/ia', label: 'Diagnóstico IA', icon: Sparkles },
  { to: '/planes', label: 'Planes', icon: CreditCard },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  function SidebarContent({ onNavigate }) {
    return (
      <>
        <div className="flex items-center gap-2.5 px-2">
          <Logo size={20} />
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
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition ${
                  isActive ? 'bg-surface2 text-text' : 'text-textDim hover:bg-surfaceHover hover:text-text'
                }`
              }
            >
              <item.icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
          {user?.rol === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onNavigate}
              className={({ isActive }) =>
                `mt-2 flex items-center gap-2.5 rounded-lg border-t border-borderDim px-2.5 pt-3 pb-2 text-[13.5px] font-medium transition ${
                  isActive ? 'text-resin' : 'text-textDim hover:text-text'
                }`
              }
            >
              <ShieldCheck size={16} strokeWidth={1.8} className="flex-shrink-0" />
              Panel Admin
            </NavLink>
          )}
        </nav>

        <div className="mt-auto border-t border-borderDim pt-2.5 text-xs text-textFaint">
          <div className="mb-2 truncate">{user?.email}</div>
          <button onClick={logout} className="text-textDim hover:text-text">
            Cerrar sesión
          </button>
          <div className="mt-3 flex gap-2.5 border-t border-borderDim pt-2.5 text-[10.5px]">
            <a href="https://github.com/manuacostaok" target="_blank" rel="noopener noreferrer" className="hover:text-textDim">GitHub</a>
            <a href="https://instagram.com/smstgrowers" target="_blank" rel="noopener noreferrer" className="hover:text-textDim">Instagram</a>
            <a href="mailto:manuacostaok@hotmail.com" className="hover:text-textDim">Contacto</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar completa — solo desktop */}
      <aside className="sticky top-0 hidden h-screen w-[232px] flex-shrink-0 flex-col gap-6 border-r border-borderDim p-3.5 md:flex">
        <SidebarContent />
      </aside>

      <main className="min-w-0 flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Barra inferior — solo mobile, con FAB central para Cultivos */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[64px] items-center justify-around border-t border-borderDim bg-bg/95 backdrop-blur md:hidden">
        <TabLink to="/" end icon={LayoutDashboard} label="Inicio" />
        <TabLink to="/calendario" icon={Calendar} label="Calendario" />

        <button
          onClick={() => navigate('/cultivos')}
          className="fab-pulse relative -top-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-chloro to-resin text-[#0B140D] shadow-lg"
          aria-label="Cultivos"
        >
          <Sprout size={22} strokeWidth={2} />
        </button>

        <TabLink to="/ia" icon={Sparkles} label="IA" />
        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center gap-1 px-2 text-[10px] text-textDim"
        >
          <MoreHorizontal size={19} strokeWidth={1.8} />
          Más
        </button>
      </nav>

      {/* Bottom sheet "Más" — el resto de las secciones + cuenta */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-borderDim bg-surface1 p-4 pb-8 md:hidden"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-borderStrong" />
              <div className="mb-1 flex items-center justify-between">
                <span className="font-display text-[15px] font-semibold">Más opciones</span>
                <button onClick={() => setSheetOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-textDim hover:bg-surfaceHover">
                  <X size={16} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setSheetOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabLink({ to, end, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-2 text-[10px] ${isActive ? 'text-resin' : 'text-textDim'}`
      }
    >
      <Icon size={19} strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}
