import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { crearCultivo, listarCultivos } from '../api/cultivos';
import CultivoCard from '../components/CultivoCard';

export default function Cultivos() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['cultivos'], queryFn: () => listarCultivos() });
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({ defaultValues: { tipoCultivo: 'planta' } });
  const tipoCultivo = watch('tipoCultivo');

  const mutation = useMutation({
    mutationFn: crearCultivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cultivos'] });
      reset();
      setOpen(false);
    },
  });

  function onSubmit(values) {
    mutation.mutate({
      nombre: values.nombre,
      tipoCultivo: values.tipoCultivo,
      cantidadPlantas: values.tipoCultivo === 'sala' ? Number(values.cantidadPlantas) || 2 : 1,
      variedad: values.variedad,
      banco: values.banco,
      fotoperiodo: values.fotoperiodo,
      fechaGerminacion: values.fechaGerminacion || undefined,
      maceta: { litros: Number(values.litros) || undefined, sustrato: values.sustrato },
      ubicacion: values.ubicacion,
      notas: values.notas,
    });
  }

  const cultivos = data?.cultivos || [];

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div>
          <div className="font-display text-[19px] font-semibold tracking-tight">Cultivos</div>
          <div className="mt-0.5 text-[12.5px] text-textDim">Gestioná cada cultivo desde germinación hasta curado</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D] hover:bg-[#6BAE7C]"
        >
          + Nuevo cultivo
        </button>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        {cultivos.length === 0 ? (
          <div className="rounded-card border border-dashed border-borderStrong p-10 text-center text-textDim">
            Todavía no creaste ningún cultivo.
            <div className="mt-3.5">
              <button onClick={() => setOpen(true)} className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D]">
                + Crear tu primer cultivo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {cultivos.map((c) => (
              <CultivoCard key={c._id} cultivo={c} />
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-5 py-[6vh]">
          <div className="w-full max-w-[560px] rounded-2xl border border-borderStrong bg-surface1 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-base font-semibold">Nuevo cultivo</div>
              <button onClick={() => setOpen(false)} className="text-textDim hover:text-text">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nombre del cultivo" full>
                <input {...register('nombre', { required: true })} placeholder="Carpa A - Planta 1" className="field" />
              </Field>
              <Field label="Tipo de cultivo">
                <select {...register('tipoCultivo')} className="field">
                  <option value="planta">Planta individual</option>
                  <option value="sala">Sala (varias plantas, misma genética)</option>
                </select>
              </Field>
              {tipoCultivo === 'sala' && (
                <Field label="Cantidad de plantas">
                  <input type="number" min="2" {...register('cantidadPlantas')} placeholder="8" className="field" />
                </Field>
              )}
              <Field label="Variedad">
                <input {...register('variedad')} placeholder="Gorilla Glue #4" className="field" />
              </Field>
              <Field label="Banco de semillas">
                <input {...register('banco')} placeholder="Fast Buds" className="field" />
              </Field>
              <Field label="Fotoperíodo">
                <select {...register('fotoperiodo')} className="field">
                  <option value="fotoperiodo">Fotoperíodo</option>
                  <option value="autofloreciente">Autofloreciente</option>
                </select>
              </Field>
              <Field label="Fecha de germinación">
                <input type="date" {...register('fechaGerminacion')} className="field" />
              </Field>
              <Field label="Maceta (litros)">
                <input type="number" {...register('litros')} placeholder="11" className="field" />
              </Field>
              <Field label="Sustrato">
                <input {...register('sustrato')} placeholder="Coco + perlita" className="field" />
              </Field>
              <Field label="Ubicación">
                <select {...register('ubicacion')} className="field">
                  <option value="carpa">Indoor - Carpa</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </Field>
              <Field label="Notas iniciales" full>
                <textarea {...register('notas')} placeholder="Objetivo, genética, plan general..." className="field min-h-[56px] resize-y" />
              </Field>

              {mutation.isError && (
                <div className="col-span-full text-[12.5px] text-danger">
                  {mutation.error?.response?.data?.error || 'No se pudo crear el cultivo.'}
                </div>
              )}

              <div className="col-span-full mt-1 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-borderStrong px-3.5 py-2 text-[13px]">
                  Cancelar
                </button>
                <button
                  disabled={isSubmitting}
                  className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60"
                >
                  {isSubmitting ? 'Creando…' : 'Crear cultivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
