import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { obtenerCultivo, cambiarEtapaCultivo } from '../api/cultivos';
import { crearSeguimiento, listarSeguimientos, subirFotosSeguimiento } from '../api/seguimientos';
import StageBar, { STAGE_LABELS, STAGES } from '../components/StageBar';
import Spinner from '../components/Spinner';

function diasDesde(fecha) {
  if (!fecha) return 0;
  const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  return diff < 0 ? 0 : diff;
}

export default function CultivoDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: cultivo } = useQuery({ queryKey: ['cultivo', id], queryFn: () => obtenerCultivo(id) });
  const { data: seguimientos } = useQuery({
    queryKey: ['seguimientos', id],
    queryFn: () => listarSeguimientos(id),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const crearMutation = useMutation({
    mutationFn: (payload) => crearSeguimiento(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguimientos', id] });
      toast.success('Registro guardado');
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'No se pudo guardar el registro.'),
  });

  const etapaMutation = useMutation({
    mutationFn: (etapa) => cambiarEtapaCultivo(id, etapa),
    onSuccess: (_, etapa) => {
      queryClient.invalidateQueries({ queryKey: ['cultivo', id] });
      toast.success(`Etapa actualizada a ${STAGE_LABELS[etapa]}`);
    },
  });

  function onSubmit(values) {
    crearMutation.mutate(
      {
        altura: values.altura ? Number(values.altura) : undefined,
        estado: values.estado,
        metrics: {
          temp: values.temp ? Number(values.temp) : undefined,
          humedad: values.humedad ? Number(values.humedad) : undefined,
          ph: values.ph ? Number(values.ph) : undefined,
          ec: values.ec ? Number(values.ec) : undefined,
        },
        notas: values.notas,
      },
      {
        onSuccess: (seguimiento) => {
          const archivos = Array.from(values.fotos || []);
          if (archivos.length > 0) {
            subirFotosSeguimiento(seguimiento._id, archivos).then(() =>
              queryClient.invalidateQueries({ queryKey: ['seguimientos', id] })
            );
          }
        },
      }
    );
  }

  if (!cultivo) return <Spinner label="Cargando cultivo…" />;
  const dias = diasDesde(cultivo.fechaGerminacion);
  const lista = [...(seguimientos || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Detalle del cultivo</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Historial completo y seguimiento diario</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <Link to="/cultivos" className="mb-4 inline-block text-[12.5px] text-textDim hover:text-text">
          ← Volver a cultivos
        </Link>
        <Link
          to={`/cultivos/${id}/galeria`}
          className="mb-4 ml-4 inline-block text-[12.5px] text-textDim hover:text-text"
        >
          Ver galería →
        </Link>
        <Link
          to={`/cultivos/${id}/estadisticas`}
          className="mb-4 ml-4 inline-block text-[12.5px] text-textDim hover:text-text"
        >
          Ver estadísticas →
        </Link>

        <div className="mb-6 rounded-2xl border border-borderDim bg-surface1 p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="font-display text-[22px] font-semibold tracking-tight">{cultivo.nombre}</div>
              <div className="mt-1 text-[13px] text-textDim">
                {cultivo.variedad || 'Sin variedad'} · {cultivo.banco || 'Banco no especificado'} · {cultivo.fotoperiodo}
              </div>
            </div>
            <div className="text-right font-mono text-xs text-textDim">
              Día de cultivo
              <div className="text-base font-medium text-text">{dias}</div>
            </div>
          </div>

          <StageBar etapa={cultivo.etapa} size="lg" />
          <div className="mt-1 flex font-mono text-[10.5px] text-textFaint">
            {STAGES.map((s) => (
              <span key={s} className="flex-1 text-center">
                {STAGE_LABELS[s]}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => etapaMutation.mutate(s)}
                className={`rounded-lg border px-2.5 py-1 text-[11.5px] ${
                  s === cultivo.etapa ? 'border-chloro text-chloro' : 'border-transparent text-textDim hover:bg-surfaceHover'
                }`}
              >
                {STAGE_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3.5 border-t border-borderDim pt-4 sm:grid-cols-4">
            <Fact label="Tipo" value={cultivo.tipoCultivo === 'sala' ? `Sala (${cultivo.cantidadPlantas} plantas)` : 'Planta individual'} />
            <Fact label="Maceta" value={`${cultivo.maceta?.litros || '-'} L`} />
            <Fact label="Sustrato" value={cultivo.maceta?.sustrato || '-'} />
            <Fact label="Ubicación" value={cultivo.ubicacion || '-'} />
            <Fact label="Germinación" value={cultivo.fechaGerminacion ? cultivo.fechaGerminacion.slice(0, 10) : '-'} />
          </div>
        </div>

        <div className="mb-3 font-display text-[14.5px] font-semibold">Registrar seguimiento de hoy</div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-7 rounded-2xl border border-borderDim bg-surface1 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Altura (cm)"><input type="number" {...register('altura')} placeholder="42" className="field" /></Field>
            <Field label="Estado general">
              <select {...register('estado')} className="field">
                <option>Óptimo</option>
                <option>Bueno</option>
                <option>Con estrés leve</option>
                <option>Con problemas</option>
              </select>
            </Field>
            <Field label="Temperatura (°C)"><input type="number" {...register('temp')} placeholder="24" className="field" /></Field>
            <Field label="Humedad (%)"><input type="number" {...register('humedad')} placeholder="55" className="field" /></Field>
            <Field label="PH"><input type="number" step="0.1" {...register('ph')} placeholder="6.2" className="field" /></Field>
            <Field label="EC"><input type="number" step="0.1" {...register('ec')} placeholder="1.4" className="field" /></Field>
            <Field label="Notas" full>
              <textarea {...register('notas')} placeholder="Riego con 1.5L, hojas verde intenso..." className="field min-h-[56px] resize-y" />
            </Field>
            <Field label="Fotos (hasta 6)" full>
              <input type="file" accept="image/*" multiple {...register('fotos')} className="field file:mr-3 file:rounded-md file:border-0 file:bg-surfaceHover file:px-2.5 file:py-1 file:text-textDim" />
            </Field>
          </div>
          <div className="mt-3 flex justify-end">
            <button disabled={isSubmitting} className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60">
              {isSubmitting ? 'Guardando…' : 'Guardar registro'}
            </button>
          </div>
        </form>

        <div className="mb-3 font-display text-[14.5px] font-semibold">Línea de tiempo</div>
        {lista.length === 0 ? (
          <div className="text-[12.5px] text-textFaint">Todavía no hay registros. Sumá el primero arriba.</div>
        ) : (
          <div className="flex flex-col">
            {lista.map((s, i) => (
              <div key={s._id} className="relative flex gap-3.5 pb-5">
                {i < lista.length - 1 && <div className="absolute left-[5px] top-4 bottom-0 w-px bg-borderDim" />}
                <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-chloro bg-surface2" />
                <div className="flex-1 rounded-lg border border-borderDim bg-surface1 p-3.5">
                  <div className="mb-1.5 font-mono text-[11.5px] text-resin">
                    {new Date(s.fecha).toLocaleString('es-AR')}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {s.altura && <Chip>Altura {s.altura} cm</Chip>}
                    {s.estado && <Chip>{s.estado}</Chip>}
                    {s.metrics?.temp && <Chip>{s.metrics.temp}°C</Chip>}
                    {s.metrics?.humedad && <Chip>HR {s.metrics.humedad}%</Chip>}
                    {s.metrics?.ph && <Chip>PH {s.metrics.ph}</Chip>}
                    {s.metrics?.ec && <Chip>EC {s.metrics.ec}</Chip>}
                  </div>
                  {s.notas && <div className="text-[12.5px] text-textDim">{s.notas}</div>}
                  {s.fotos?.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {s.fotos.map((f) => (
                        <img
                          key={f.cloudinaryId || f.url}
                          src={f.url}
                          alt="Foto de seguimiento"
                          className="h-14 w-14 rounded-md border border-borderDim object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-textFaint">{label}</div>
      <div className="mt-0.5 text-[13px] font-medium">{value}</div>
    </div>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={`flex flex-col gap-1 ${full ? 'col-span-full' : ''}`}>
      <label className="text-xs text-textDim">{label}</label>
      {children}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-md border border-borderStrong bg-surface2 px-2 py-0.5 font-mono text-[11px] text-textDim">
      {children}
    </span>
  );
}
