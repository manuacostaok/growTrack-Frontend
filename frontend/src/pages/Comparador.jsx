import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listarCultivos } from '../api/cultivos';
import { compararCultivos } from '../api/estadisticas';

const FILAS = [
  { key: 'cantidadRegistros', label: 'Registros totales' },
  { key: 'promedioPh', label: 'Promedio PH' },
  { key: 'promedioEc', label: 'Promedio EC' },
  { key: 'promedioTemp', label: 'Promedio temperatura', suf: '°C' },
  { key: 'promedioHumedad', label: 'Promedio humedad', suf: '%' },
  { key: 'consumoAguaLitros', label: 'Consumo de agua', suf: ' L' },
  { key: 'pesoFinalGramos', label: 'Peso final', suf: ' g' },
  { key: 'produccionPorLitroMaceta', label: 'Producción / litro maceta', suf: ' g/L' },
];

export default function Comparador() {
  const { data } = useQuery({ queryKey: ['cultivos', 'todos'], queryFn: () => listarCultivos({ limit: 100 }) });
  const cultivos = data?.cultivos || [];
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');

  const { data: comparacion, isFetching } = useQuery({
    queryKey: ['comparar', idA, idB],
    queryFn: () => compararCultivos(idA, idB),
    enabled: Boolean(idA && idB && idA !== idB),
  });

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-8 py-4 backdrop-blur">
        <div className="font-display text-[19px] font-semibold tracking-tight">Comparador</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Comparná el rendimiento de dos cultivos</div>
      </div>

      <div className="max-w-[1180px] p-8">
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select value={idA} onChange={(e) => setIdA(e.target.value)} className="field">
            <option value="">Elegí el primer cultivo</option>
            {cultivos.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
          <select value={idB} onChange={(e) => setIdB(e.target.value)} className="field">
            <option value="">Elegí el segundo cultivo</option>
            {cultivos.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {idA && idB && idA === idB && (
          <div className="text-[13px] text-danger">Elegí dos cultivos distintos para comparar.</div>
        )}

        {isFetching && <div className="text-textDim">Comparando…</div>}

        {comparacion && (
          <div className="overflow-hidden rounded-card border border-borderDim">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-borderDim bg-surface1 p-3.5 text-[13px] font-semibold">
              <div>Métrica</div>
              <div>{comparacion.a.cultivo.nombre}</div>
              <div>{comparacion.b.cultivo.nombre}</div>
            </div>
            {FILAS.map((fila) => (
              <div key={fila.key} className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-borderDim p-3.5 text-[13px] last:border-none">
                <div className="text-textDim">{fila.label}</div>
                <div>{comparacion.a[fila.key] != null ? `${comparacion.a[fila.key]}${fila.suf || ''}` : '—'}</div>
                <div>{comparacion.b[fila.key] != null ? `${comparacion.b[fila.key]}${fila.suf || ''}` : '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
