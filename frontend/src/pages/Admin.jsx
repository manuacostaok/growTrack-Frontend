import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listarUsuariosAdmin, cambiarPlanUsuarioAdmin, obtenerMetricasAdmin } from '../api/admin';
import { listarFeedbackAdmin } from '../api/feedback';

const PLANES = ['free', 'pro', 'premium'];

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: metricas } = useQuery({ queryKey: ['admin-metricas'], queryFn: obtenerMetricasAdmin });
  const { data: usuariosData } = useQuery({ queryKey: ['admin-usuarios'], queryFn: () => listarUsuariosAdmin() });
  const { data: feedback } = useQuery({ queryKey: ['admin-feedback'], queryFn: listarFeedbackAdmin });

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
        <div className="mb-8 overflow-hidden rounded-card border border-borderDim">
          <div className="hidden border-b border-borderDim bg-surface1 p-3 text-[12px] font-semibold text-textDim sm:grid sm:grid-cols-[1.5fr_1.5fr_1fr_1fr]">
            <div>Nombre</div><div>Email</div><div>Plan</div><div>Cambiar plan</div>
          </div>
          {(usuariosData?.usuarios || []).map((u) => (
            <div
              key={u._id}
              className="flex flex-col gap-2 border-b border-borderDim p-3 text-[13px] last:border-none sm:grid sm:grid-cols-[1.5fr_1.5fr_1fr_1fr] sm:items-center sm:gap-0"
            >
              <div className="flex items-center justify-between sm:block">
                <span className="font-medium">{u.nombre}</span>
                <span className="font-mono text-[11px] text-textFaint sm:hidden">{u.plan}</span>
              </div>
              <div className="truncate text-textDim">{u.email}</div>
              <div className="hidden font-mono text-[11.5px] sm:block">{u.plan}</div>
              <select
                value={u.plan}
                onChange={(e) => cambiarPlan.mutate({ id: u._id, plan: e.target.value })}
                className="field w-full sm:w-auto"
              >
                {PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="mb-3 font-display text-[14.5px] font-semibold">Feedback recibido</div>
        <div className="flex flex-col gap-2.5">
          {(feedback || []).length === 0 && (
            <div className="text-[12.5px] text-textFaint">Todavía no llegó ningún comentario.</div>
          )}
          {(feedback || []).map((f) => (
            <div key={f._id} className="rounded-lg border border-borderDim bg-surface1 p-3.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12.5px] font-medium">{f.usuario?.nombre} <span className="text-textFaint">({f.usuario?.email})</span></span>
                <span className="font-mono text-[10.5px] text-textFaint">{new Date(f.createdAt).toLocaleDateString('es-AR')}</span>
              </div>
              <div className="text-[13px] text-textDim">{f.mensaje}</div>
              {f.pagina && <div className="mt-1 font-mono text-[10.5px] text-textFaint">desde {f.pagina}</div>}
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
