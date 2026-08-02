import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listarArticulos, obtenerArticulo } from '../api/conocimiento';

const CATEGORIAS = [
  { value: '', label: 'Todas' },
  { value: 'deficiencias', label: 'Deficiencias' },
  { value: 'plagas', label: 'Plagas' },
  { value: 'hongos', label: 'Hongos' },
  { value: 'ph_ec', label: 'PH y EC' },
  { value: 'secado_curado', label: 'Secado y curado' },
];

export default function Conocimiento() {
  const [buscar, setBuscar] = useState('');
  const [categoria, setCategoria] = useState('');
  const [abiertoId, setAbiertoId] = useState(null);

  const { data: articulos } = useQuery({
    queryKey: ['conocimiento', buscar, categoria],
    queryFn: () => listarArticulos({ buscar: buscar || undefined, categoria: categoria || undefined }),
  });

  const { data: articuloAbierto } = useQuery({
    queryKey: ['conocimiento-articulo', abiertoId],
    queryFn: () => obtenerArticulo(abiertoId),
    enabled: Boolean(abiertoId),
  });

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Base de conocimiento</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Deficiencias, plagas, hongos, PH/EC, secado y curado</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar (ej: magnesio, ácaros, PH)..."
            className="field flex-1"
          />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="field sm:w-52">
            {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(articulos || []).map((a) => (
            <button
              key={a._id}
              onClick={() => setAbiertoId(a._id)}
              className="rounded-card border border-borderDim bg-surface1 p-4 text-left transition hover:border-borderStrong"
            >
              <span className="mb-1.5 inline-block rounded-md bg-surface2 px-2 py-0.5 font-mono text-[10px] text-textDim">
                {a.categoria.replace('_', '/')}
              </span>
              <div className="font-display text-[14.5px] font-semibold">{a.titulo}</div>
              <div className="mt-1 text-[12.5px] text-textDim">{a.resumen}</div>
            </button>
          ))}
          {articulos?.length === 0 && (
            <div className="col-span-full text-[12.5px] text-textFaint">No encontramos artículos con esa búsqueda.</div>
          )}
        </div>
      </div>

      {abiertoId && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-5 py-[6vh]" onClick={() => setAbiertoId(null)}>
          <div className="w-full max-w-[560px] rounded-2xl border border-borderStrong bg-surface1 p-6" onClick={(e) => e.stopPropagation()}>
            {articuloAbierto ? (
              <>
                <span className="mb-2 inline-block rounded-md bg-surface2 px-2 py-0.5 font-mono text-[10px] text-textDim">
                  {articuloAbierto.categoria.replace('_', '/')}
                </span>
                <div className="mb-3 font-display text-lg font-semibold">{articuloAbierto.titulo}</div>
                <p className="text-[13.5px] leading-relaxed text-textDim">{articuloAbierto.contenido}</p>
              </>
            ) : (
              <div className="text-textDim">Cargando…</div>
            )}
            <button onClick={() => setAbiertoId(null)} className="mt-5 rounded-lg border border-borderStrong px-3.5 py-2 text-[13px]">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
