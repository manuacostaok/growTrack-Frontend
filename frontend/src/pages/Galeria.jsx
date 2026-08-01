import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenerCultivo } from '../api/cultivos';
import { obtenerGaleria } from '../api/seguimientos';

export default function Galeria() {
  const { id } = useParams();
  const { data: cultivo } = useQuery({ queryKey: ['cultivo', id], queryFn: () => obtenerCultivo(id) });
  const { data: fotos } = useQuery({ queryKey: ['galeria', id], queryFn: () => obtenerGaleria(id) });
  const [slider, setSlider] = useState(50);

  const ordenadas = [...(fotos || [])].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const primera = ordenadas[0];
  const ultima = ordenadas[ordenadas.length - 1];
  const hayComparacion = primera && ultima && primera.url !== ultima.url;

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-8 py-4 backdrop-blur">
        <div className="font-display text-[19px] font-semibold tracking-tight">Galería</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">{cultivo?.nombre || 'Cargando…'}</div>
      </div>

      <div className="max-w-[1180px] p-8">
        <Link to={`/cultivos/${id}`} className="mb-4 inline-block text-[12.5px] text-textDim hover:text-text">
          ← Volver al cultivo
        </Link>

        {hayComparacion && (
          <div className="mb-8">
            <div className="mb-3 font-display text-[14.5px] font-semibold">Antes / después</div>
            <div className="relative aspect-video w-full overflow-hidden rounded-card border border-borderDim select-none">
              <img src={ultima.url} alt="Foto más reciente" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
                <img src={primera.url} alt="Foto inicial" className="h-full w-full object-cover" style={{ width: `${10000 / slider}%`, maxWidth: 'none' }} />
              </div>
              <div className="absolute inset-y-0 w-0.5 bg-resin" style={{ left: `${slider}%` }} />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10.5px]">
                {new Date(primera.fecha).toLocaleDateString('es-AR')}
              </span>
              <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10.5px]">
                {new Date(ultima.fecha).toLocaleDateString('es-AR')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="mt-3 w-full accent-resin"
            />
          </div>
        )}

        <div className="mb-3 font-display text-[14.5px] font-semibold">Todas las fotos</div>
        {!fotos || fotos.length === 0 ? (
          <div className="text-[12.5px] text-textFaint">
            Todavía no hay fotos. Subilas desde el formulario de seguimiento diario.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {fotos.map((f) => (
              <div key={f.cloudinaryId || f.url} className="overflow-hidden rounded-lg border border-borderDim bg-surface1">
                <img src={f.url} alt="Foto del cultivo" className="aspect-square w-full object-cover" />
                <div className="p-2 font-mono text-[10.5px] text-textFaint">
                  {new Date(f.fecha).toLocaleDateString('es-AR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
