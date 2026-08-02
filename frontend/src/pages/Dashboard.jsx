import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { obtenerResumenDashboard, listarCultivos } from '../api/cultivos';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import CultivoCard from '../components/CultivoCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: resumen } = useQuery({ queryKey: ['dashboard-resumen'], queryFn: obtenerResumenDashboard });
  const { data: cultivosData } = useQuery({ queryKey: ['cultivos', 'preview'], queryFn: () => listarCultivos({ limit: 3 }) });

  const conteos = resumen?.conteos || { total: 0, vegetativo: 0, floracion: 0, listosParaCosecha: 0 };
  const actividad = resumen?.actividadReciente || [];
  const cultivos = cultivosData?.cultivos || [];

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div>
          <div className="font-display text-[19px] font-semibold tracking-tight">Dashboard</div>
          <div className="mt-0.5 text-[12.5px] text-textDim">Resumen de todos tus cultivos activos</div>
        </div>
        <span className="rounded-full border border-resin/30 bg-resin/10 px-2.5 py-1 font-mono text-[11px] text-resin">
          PLAN {(user?.plan || 'free').toUpperCase()}
        </span>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Cultivos totales" value={conteos.total} />
          <StatCard label="En vegetativo" value={conteos.vegetativo} />
          <StatCard label="En floración" value={conteos.floracion} />
          <StatCard label="Listos para cosecha" value={conteos.listosParaCosecha} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-3 font-display text-[14.5px] font-semibold">Actividad reciente</div>
            {actividad.length === 0 ? (
              <div className="text-[12.5px] text-textFaint">
                Los registros de seguimiento diario van a aparecer acá.
              </div>
            ) : (
              actividad.map((a) => (
                <div key={a._id} className="flex gap-3 border-b border-borderDim py-2.5 last:border-none">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chloro" />
                  <div>
                    <div className="text-[13px]">
                      <b>{a.cultivo?.nombre}</b> — registro de seguimiento ({a.estado || 'sin estado'})
                    </div>
                    <div className="mt-0.5 font-mono text-[11.5px] text-textFaint">
                      {new Date(a.fecha).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-[14.5px] font-semibold">Tus cultivos</div>
          <Link to="/cultivos" className="text-[12px] text-textDim hover:text-text">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {cultivos.map((c) => (
            <CultivoCard key={c._id} cultivo={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
