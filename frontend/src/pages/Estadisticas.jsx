import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { obtenerEstadisticas } from '../api/estadisticas';
import { actualizarCultivo } from '../api/cultivos';
import { STAGE_LABELS } from '../components/StageBar';

export default function Estadisticas() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: stats, isLoading } = useQuery({ queryKey: ['estadisticas', id], queryFn: () => obtenerEstadisticas(id) });
  const [peso, setPeso] = useState('');

  const guardarPeso = useMutation({
    mutationFn: () => actualizarCultivo(id, { pesoFinalGramos: Number(peso) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estadisticas', id] });
      setPeso('');
    },
  });

  if (isLoading || !stats) {
    return <div className="p-8 text-textDim">Cargando…</div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Estadísticas</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">{stats.cultivo.nombre}</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <Link to={`/cultivos/${id}`} className="mb-5 inline-block text-[12.5px] text-textDim hover:text-text">
          ← Volver al cultivo
        </Link>

        {!stats.pesoFinalGramos && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-borderDim bg-surface1 p-4">
            <span className="text-[13px] text-textDim">¿Ya cosechaste? Cargá el peso final para ver la producción por litro:</span>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="gramos"
              className="field w-28"
            />
            <button
              onClick={() => guardarPeso.mutate()}
              disabled={!peso || guardarPeso.isPending}
              className="rounded-lg bg-chloro px-3 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60"
            >
              Guardar
            </button>
          </div>
        )}

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Stat label="Registros totales" value={stats.cantidadRegistros} />
          <Stat label="Promedio PH" value={stats.promedioPh ?? '—'} />
          <Stat label="Promedio EC" value={stats.promedioEc ?? '—'} />
          <Stat label="Promedio temp." value={stats.promedioTemp ? `${stats.promedioTemp}°C` : '—'} />
          <Stat label="Promedio humedad" value={stats.promedioHumedad ? `${stats.promedioHumedad}%` : '—'} />
          <Stat label="Consumo de agua" value={`${stats.consumoAguaLitros} L`} />
          <Stat label="Peso final" value={stats.pesoFinalGramos ? `${stats.pesoFinalGramos} g` : '—'} />
          <Stat label="Producción / litro maceta" value={stats.produccionPorLitroMaceta ? `${stats.produccionPorLitroMaceta} g/L` : '—'} />
        </div>

        <div className="mb-3 font-display text-[14.5px] font-semibold">Días por etapa</div>
        <div className="flex flex-col gap-2">
          {Object.entries(stats.diasPorEtapa).length === 0 && (
            <div className="text-[12.5px] text-textFaint">Todavía no hay historial de etapas suficiente.</div>
          )}
          {Object.entries(stats.diasPorEtapa).map(([etapa, dias]) => (
            <div key={etapa} className="flex items-center gap-3">
              <span className="w-28 text-[12.5px] text-textDim">{STAGE_LABELS[etapa] || etapa}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full bg-chloro"
                  style={{ width: `${Math.min(100, dias * 4)}%` }}
                />
              </div>
              <span className="w-16 text-right font-mono text-[11.5px] text-textFaint">{dias} días</span>
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
