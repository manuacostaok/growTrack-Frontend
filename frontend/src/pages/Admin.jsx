import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listarUsuariosAdmin, cambiarPlanUsuarioAdmin, obtenerMetricasAdmin } from '../api/admin';

const PLANES = ['free', 'pro', 'premium'];

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: metricas } = useQuery({ queryKey: ['admin-metricas'], queryFn: obtenerMetricasAdmin });
  const { data: usuariosData } = useQuery({ queryKey: ['admin-usuarios'], queryFn: () => listarUsuariosAdmin() });

  const cambiarPlan = useMutation({
    mutationFn: ({ id, plan }) => cambiarPlanUsuarioAdmin(id, plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] }),
  });

  const porPlan = Object.fromEntries((metricas?.usuariosPorPlan || []).map((p) => [p._id, p.total]));

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Panel Admin</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Usuarios, planes y métricas globales</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Usuarios totales" value={metricas?.totalUsuarios ?? '—'} />
          <Stat label="Free" value={porPlan.free ?? 0} />
          <Stat label="Pro" value={porPlan.pro ?? 0} />
          <Stat label="Premium" value={porPlan.premium ?? 0} />
          <Stat label="Cultivos activos" value={metricas?.totalCultivos ?? '—'} />
        </div>
        <div className="mb-8 rounded-card border border-borderDim bg-surface1 p-4">
          <div className="text-[12px] text-textDim">MRR estimado (suscripciones activas)</div>
          <div className="font-display text-2xl font-semibold">${metricas?.mrrEstimadoArs?.toLocaleString('es-AR') ?? 0} ARS</div>
        </div>

        <div className="mb-3 font-display text-[14.5px] font-semibold">Usuarios</div>
        <div className="overflow-hidden rounded-card border border-borderDim">
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr] border-b border-borderDim bg-surface1 p-3 text-[12px] font-semibold text-textDim">
            <div>Nombre</div><div>Email</div><div>Plan</div><div>Cambiar plan</div>
          </div>
          {(usuariosData?.usuarios || []).map((u) => (
            <div key={u._id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr] items-center border-b border-borderDim p-3 text-[13px] last:border-none">
              <div>{u.nombre}</div>
              <div className="text-textDim">{u.email}</div>
              <div className="font-mono text-[11.5px]">{u.plan}</div>
              <select
                value={u.plan}
                onChange={(e) => cambiarPlan.mutate({ id: u._id, plan: e.target.value })}
                className="field"
              >
                {PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-card border border-borderDim bg-surface1 p-4">
      <div className="font-display text-[22px] font-semibold leading-none">{value}</div>
      <div className="mt-1.5 text-[12px] text-textDim">{label}</div>
    </div>
  );
}
