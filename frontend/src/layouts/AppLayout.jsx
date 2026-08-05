import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Sprout, Calendar, GitCompare, BookOpen, Sparkles, CreditCard, ShieldCheck, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FeedbackButton from '../components/FeedbackButton';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/cultivos', label: 'Cultivos', icon: Sprout },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
  { to: '/comparador', label: 'Comparador', icon: GitCompare },
  { to: '/conocimiento', label: 'Base de conocimiento', icon: BookOpen },
  { to: '/ia', label: 'Diagnóstico IA', icon: Sparkles },
  { to: '/planes', label: 'Planes', icon: CreditCard },
];

function FullNav({ onNavigate }) {
  const { user, logout } = useAuth();
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
              `nav-glow flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium ${
                isActive ? 'bg-surface2 text-text' : 'text-textDim hover:bg-surfaceHover'
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
              `nav-glow mt-2 flex items-center gap-2.5 rounded-lg border-t border-borderDim px-2.5 pt-3 pb-2 text-[13.5px] font-medium ${
                isActive ? 'text-resin' : 'text-textDim'
              }`
            }
          >
            <ShieldCheck size={16} strokeWidth={1.8} className="flex-shrink-0" />
            Panel Admin
          </NavLink>
        )}
      </nav>

      <div className="mt-auto border-t border-borderDim pt-3 text-xs text-textFaint">
        <div className="mb-2.5 truncate px-1">{user?.email}</div>
        <div className="mb-2">
          <FeedbackButton />
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-borderStrong bg-surface2 px-3 py-2.5 text-[13px] font-medium text-textDim transition hover:border-danger/50 hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Cerrar sesión
        </button>
        <div className="mt-3 flex justify-center gap-3 border-t border-borderDim pt-2.5 text-[10.5px]">
          <a href="https://instagram.com/growtrackpro" target="_blank" rel="noopener noreferrer" className="hover:text-textDim">Instagram</a>
          <a href="mailto:growtrackpro@hotmail.com" className="hover:text-textDim">Contacto</a>
        </div>
      </div>
    </>
  );
}

// Riel angosto de mobile: solo visual, ningún ícono navega — todo el riel es un botón que despliega el menú real.
function CompactRail({ onOpen, user }) {
  const location = useLocation();
  return (
    <button
      onClick={onOpen}
      className="sticky top-0 z-30 flex h-screen w-14 flex-shrink-0 flex-col items-center gap-4 border-r border-borderDim bg-bg py-4 md:hidden"
      aria-label="Abrir menú de navegación"
    >
      <Menu size={17} strokeWidth={1.8} className="text-textDim" />
      <Logo size={18} />
      <div className="mt-2 flex flex-col items-center gap-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <span
              key={item.to}
              className={`nav-glow-icon flex h-8 w-8 items-center justify-center rounded-lg ${
                isActive ? 'bg-surface2 text-text' : 'text-textDim'
              }`}
            >
              <item.icon size={16} strokeWidth={1.8} />
            </span>
          );
        })}
      </div>
    </button>
  );
}

export default function AppLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar completa — solo desktop, siempre expandida */}
      <aside className="sticky top-0 hidden h-screen w-[232px] flex-shrink-0 flex-col gap-6 border-r border-borderDim p-3.5 md:flex">
        <FullNav />
      </aside>

      {/* Riel angosto — solo mobile, siempre visible, se toca para desplegar */}
      <CompactRail onOpen={() => setOpen(true)} user={user} />

      {/* Overlay: sidebar completa desplegada — tocar la pantalla central la cierra */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col gap-6 border-r border-borderDim bg-bg p-3.5 md:hidden"
            >
              <FullNav onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
