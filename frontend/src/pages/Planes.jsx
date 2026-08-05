import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { crearSuscripcion, cancelarSuscripcion, obtenerMiSuscripcion } from '../api/pagos';

const PLANES = [
  {
    id: 'pro',
    nombre: 'Pro',
    precio: '$15.000/mes',
    features: ['Cultivos y fotos ilimitados', 'Calendario inteligente', 'Estadísticas y comparador', 'Exportar PDF y Excel'],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '$30.000/mes',
    features: ['Todo lo de Pro', 'Diagnóstico por imagen', 'Plan de riego sugerido', 'Predicción de cosecha'],
  },
];

export default function Planes() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');
  const estado = params.get('estado');
  const queryClient = useQueryClient();

  const { data: suscripcion } = useQuery({ queryKey: ['mi-suscripcion'], queryFn: obtenerMiSuscripcion });

  const cancelarMutation = useMutation({
    mutationFn: cancelarSuscripcion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mi-suscripcion'] }),
  });

  async function elegirPlan(planId) {
    setError('');
    setLoadingPlan(planId);
    try {
      const { initPoint } = await crearSuscripcion(planId);
      window.location.href = initPoint;
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar la suscripción.');
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Planes</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Tu plan actual: {user?.plan || 'free'}</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        {estado === 'exito' && (
          <div className="mb-5 rounded-lg border border-chloro/30 bg-chloro/10 px-4 py-3 text-[13px] text-[#8FCF9F]">
            Suscripción autorizada. Tu plan se actualiza en unos segundos (esperá la confirmación del webhook).
          </div>
        )}
        {error && <div className="mb-5 text-[13px] text-danger">{error}</div>}

        {suscripcion?.estado === 'activa' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-borderDim bg-surface1 px-4 py-3">
            <div className="text-[13px] text-textDim">
              Suscripción <b className="text-text">{suscripcion.plan}</b> activa — cobro mensual automático (${suscripcion.monto?.toLocaleString('es-AR')} ARS).
            </div>
            <button
              onClick={() => cancelarMutation.mutate()}
              disabled={cancelarMutation.isPending}
              className="rounded-lg border border-danger/40 px-3 py-1.5 text-[12.5px] text-danger hover:bg-danger/10"
            >
              {cancelarMutation.isPending ? 'Cancelando…' : 'Cancelar suscripción'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANES.map((plan) => (
            <div key={plan.id} className="flex flex-col rounded-2xl border border-borderDim bg-surface1 p-6">
              <div className="font-display text-base font-semibold">{plan.nombre}</div>
              <div className="mt-1 mb-1 font-display text-2xl font-semibold">{plan.precio}</div>
              <div className="mb-4 text-[11.5px] text-textFaint">Cobro automático todos los meses, cancelás cuando quieras</div>
              <ul className="mb-5 flex flex-1 flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-textDim">
                    <span className="text-chloro">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => elegirPlan(plan.id)}
                disabled={loadingPlan === plan.id || user?.plan === plan.id}
                className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60"
              >
                {user?.plan === plan.id ? 'Plan actual' : loadingPlan === plan.id ? 'Redirigiendo…' : `Suscribirme a ${plan.nombre}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
