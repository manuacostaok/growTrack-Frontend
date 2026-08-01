import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { diagnosticarFoto } from '../api/ia';

const ESTADO_LABELS = {
  optimo: 'Óptimo',
  bueno: 'Bueno',
  con_estres: 'Con estrés',
  con_problemas: 'Con problemas',
};

export default function DiagnosticoIA() {
  const { user, actualizarUsuarioParcial } = useAuth();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const esPlanPago = user?.plan === 'pro' || user?.plan === 'premium';
  const gratisUsados = user?.diagnosticosGratisUsados ?? 0;
  const gratisDisponible = !esPlanPago && gratisUsados < 1;
  const puedeUsar = esPlanPago || gratisDisponible;

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
    setResultado(null);
    setError('');
  }

  async function analizar() {
    if (!archivo) return;
    setCargando(true);
    setError('');
    try {
      const data = await diagnosticarFoto(archivo);
      setResultado(data.diagnostico);
      if (data.diagnosticosGratisUsados !== undefined) {
        actualizarUsuarioParcial({ diagnosticosGratisUsados: data.diagnosticosGratisUsados });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo analizar la imagen.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-8 py-4 backdrop-blur">
        <div className="font-display text-[19px] font-semibold tracking-tight">Diagnóstico por IA</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Subí una foto y recibí una estimación de posibles problemas</div>
      </div>

      <div className="max-w-[720px] p-8">
        {!esPlanPago && (
          <div className={`mb-5 rounded-card border p-4 text-[13px] ${
            gratisDisponible
              ? 'border-resin/30 bg-resin/10 text-resin'
              : 'border-borderDim bg-surface1 text-textDim'
          }`}>
            {gratisDisponible
              ? 'Tenés 1 diagnóstico gratis disponible. Después de usarlo, vas a necesitar el plan Pro o Premium.'
              : <>Ya usaste tu diagnóstico gratis. <Link to="/planes" className="underline text-resin">Pasate a Pro para diagnósticos ilimitados →</Link></>}
          </div>
        )}

        {puedeUsar && (
          <>
            <label className="mb-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-borderStrong bg-surface1 p-8 text-center">
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              {preview ? (
                <img src={preview} alt="Vista previa" className="max-h-64 rounded-lg object-contain" />
              ) : (
                <span className="text-[13px] text-textDim">Hacé click para elegir una foto de tu planta</span>
              )}
            </label>

            <button
              onClick={analizar}
              disabled={!archivo || cargando}
              className="mb-6 rounded-lg bg-chloro px-4 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60"
            >
              {cargando ? 'Analizando…' : 'Analizar foto'}
            </button>
          </>
        )}

        {error && <div className="mb-5 text-[13px] text-danger">{error}</div>}

        {resultado && (
          <div className="rounded-card border border-borderDim bg-surface1 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[12px] text-textDim">Estado general:</span>
              <span className="rounded-md bg-chloro/10 px-2 py-0.5 font-mono text-[12px] text-[#8FCF9F]">
                {ESTADO_LABELS[resultado.estadoGeneral] || resultado.estadoGeneral}
              </span>
            </div>

            {resultado.hallazgos?.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-[12.5px] font-semibold text-textDim">Hallazgos</div>
                <div className="flex flex-col gap-2">
                  {resultado.hallazgos.map((h, i) => (
                    <div key={i} className="rounded-lg border border-borderDim bg-surface2 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium">{h.tipo}</span>
                        <span className="font-mono text-[10.5px] text-textFaint">confianza {h.confianza}</span>
                      </div>
                      <div className="mt-1 text-[12.5px] text-textDim">{h.descripcion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.recomendaciones?.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-[12.5px] font-semibold text-textDim">Recomendaciones</div>
                <ul className="flex flex-col gap-1.5">
                  {resultado.recomendaciones.map((r, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-textDim">
                      <span className="text-chloro">→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultado.aclaracion && (
              <div className="border-t border-borderDim pt-3 text-[11.5px] text-textFaint">{resultado.aclaracion}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
