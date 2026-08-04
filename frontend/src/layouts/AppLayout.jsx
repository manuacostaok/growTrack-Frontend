import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Sprout, Calendar, GitCompare, BookOpen, Sparkles, CreditCard, ShieldCheck, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import LineSidebar from '../components/LineSidebar';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/cultivos', label: 'Cultivos', icon: Sprout },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
  { to: '/comparador', label: 'Comparador', icon: GitCompare },
  { to: '/conocimiento', label: 'Base de conocimiento', icon: BookOpen },
  { to: '/ia', label: 'Diagnóstico IA', icon: Sparkles },
  { to: '/planes', label: 'Planes', icon: CreditCard },
];

function useNavItemsForUser(user) {
  const items = [...NAV_ITEMS];
  if (user?.rol === 'admin') {
    items.push({ to: '/admin', label: 'Panel Admin', icon: ShieldCheck });
  }
  return items;
}

function activeIndexFor(items, pathname) {
  const idx = items.findIndex((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  );
  return idx === -1 ? 0 : idx;
}

function FullNav({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = useNavItemsForUser(user);

  function handleItemClick(index) {
    navigate(items[index].to);
    onNavigate?.();
  }

  return (
    <>
      <div className="flex items-center gap-2.5 px-2">
        <Logo size={20} />
        <span className="font-display text-[15px] font-semibold tracking-tight">GrowTrack Pro</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        <LineSidebar
          items={items.map((i) => i.label)}
          accentColor="#D8A84E"
          textColor="#93A08C"
          markerColor="#333C2C"
          showIndex
          showMarker
          proximityRadius={90}
          maxShift={10}
          falloff="smooth"
          markerLength={22}
          markerGap={8}
          tickScale={0.5}
          scaleTick
          itemGap={16}
          fontSize={0.92}
          smoothing={110}
          defaultActive={activeIndexFor(items, location.pathname)}
          onItemClick={handleItemClick}
        />
      </div>

      <div className="border-t border-borderDim pt-3 text-xs text-textFaint">
        <div className="mb-2.5 truncate px-1">{user?.email}</div>
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
  const items = useNavItemsForUser(user);
  return (
    <button
      onClick={onOpen}
      className="sticky top-0 z-30 flex h-screen w-14 flex-shrink-0 flex-col items-center gap-4 border-r border-borderDim bg-bg py-4 md:hidden"
      aria-label="Abrir menú de navegación"
    >
      <Menu size={17} strokeWidth={1.8} className="text-textDim" />
      <Logo size={18} />
      <div className="mt-2 flex flex-col items-center gap-3">
        {items.map((item) => {
          const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <span
              key={item.to}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
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
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-shrink-0 flex-col gap-4 border-r border-borderDim p-3.5 md:flex">
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
              className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col gap-4 border-r border-borderDim bg-bg p-3.5 md:hidden"
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
