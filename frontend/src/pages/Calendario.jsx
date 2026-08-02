import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listarEventos, crearEvento } from '../api/eventos';
import { listarCultivos } from '../api/cultivos';

const DOW = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const TIPOS = [
  { value: 'riego', label: 'Riego' },
  { value: 'fertilizacion', label: 'Fertilización' },
  { value: 'poda', label: 'Poda' },
  { value: 'lst', label: 'LST' },
  { value: 'hst', label: 'HST' },
  { value: 'defoliacion', label: 'Defoliación' },
  { value: 'lavado_raices', label: 'Lavado de raíces' },
  { value: 'cosecha', label: 'Cosecha' },
  { value: 'custom', label: 'Otro' },
];

function toKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function Calendario() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(toKey(today));
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const desde = new Date(year, month, 1).toISOString();
  const hasta = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data: eventos } = useQuery({
    queryKey: ['eventos', year, month],
    queryFn: () => listarEventos({ desde, hasta }),
  });
  const { data: cultivosData } = useQuery({ queryKey: ['cultivos', 'todos'], queryFn: () => listarCultivos({ limit: 100 }) });
  const cultivos = cultivosData?.cultivos || [];

  const crearMutation = useMutation({
    mutationFn: crearEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', year, month] });
      setShowForm(false);
    },
  });

  const eventosPorDia = useMemo(() => {
    const map = {};
    (eventos || []).forEach((e) => {
      const key = e.fecha.slice(0, 10);
      (map[key] = map[key] || []).push(e);
    });
    return map;
  }, [eventos]);

  function shift(delta) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  }

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toKey(today);

  const eventosDelDia = eventosPorDia[selected] || [];

  function onSubmitEvento(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    crearMutation.mutate({
      cultivo: form.get('cultivo'),
      tipo: form.get('tipo'),
      titulo: form.get('titulo'),
      fecha: selected,
      notas: form.get('notas'),
    });
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-borderDim bg-bg/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
        <div className="font-display text-[19px] font-semibold tracking-tight">Calendario</div>
        <div className="mt-0.5 text-[12.5px] text-textDim">Actividad registrada y programada en todos tus cultivos</div>
      </div>

      <div className="max-w-[1180px] p-4 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => shift(-1)} className="rounded-lg border border-borderStrong px-3 py-1.5 text-[13px]">← Mes anterior</button>
          <div className="font-display text-base font-semibold">{MONTH_NAMES[month]} {year}</div>
          <button onClick={() => shift(1)} className="rounded-lg border border-borderStrong px-3 py-1.5 text-[13px]">Mes siguiente →</button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="grid grid-cols-7 gap-1.5">
              {DOW.map((d) => (
                <div key={d} className="pb-1 text-center font-mono text-[11px] text-textFaint">{d}</div>
              ))}
              {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const dateObj = new Date(year, month, d);
                const key = toKey(dateObj);
                const evs = eventosPorDia[key] || [];
                const isToday = key === todayKey;
                const isSelected = key === selected;
                return (
                  <div
                    key={key}
                    onClick={() => { setSelected(key); setShowForm(false); }}
                    className={`flex aspect-[1/0.85] cursor-pointer flex-col justify-between rounded-lg border p-1.5 ${
                      isSelected ? 'border-resin bg-surface2' : isToday ? 'border-chloro bg-surface1' : 'border-borderDim bg-surface1 hover:border-borderStrong'
                    }`}
                  >
                    <span className="font-mono text-xs text-textDim">{d}</span>
                    <span className="flex flex-wrap gap-0.5">
                      {evs.slice(0, 4).map((_, idx) => <span key={idx} className="h-1.5 w-1.5 rounded-full bg-chloro" />)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky top-20 rounded-card border border-borderDim bg-surface1 p-4">
            <div className="mb-2.5 font-display text-sm font-semibold">
              {new Date(selected + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>

            {eventosDelDia.length === 0 ? (
              <div className="mb-3 text-[12.5px] text-textFaint">Sin eventos este día.</div>
            ) : (
              <div className="mb-3 flex flex-col gap-2">
                {eventosDelDia.map((ev) => (
                  <div key={ev._id} className="rounded-lg border border-borderDim bg-surface2 p-2.5">
                    <div className="text-[13px] font-medium">{ev.titulo}</div>
                    <div className="mt-0.5 text-[11.5px] text-textDim">{ev.cultivo?.nombre} · {ev.tipo}</div>
                  </div>
                ))}
              </div>
            )}

            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="w-full rounded-lg border border-borderStrong px-3 py-1.5 text-[12.5px] text-textDim hover:bg-surfaceHover">
                + Agregar evento
              </button>
            ) : (
              <form onSubmit={onSubmitEvento} className="flex flex-col gap-2">
                <select name="cultivo" required className="field">
                  <option value="">Cultivo</option>
                  {cultivos.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                </select>
                <select name="tipo" className="field" defaultValue="riego">
                  {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input name="titulo" required placeholder="Título" className="field" />
                <textarea name="notas" placeholder="Notas (opcional)" className="field min-h-[50px]" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-borderStrong px-3 py-1.5 text-[12.5px]">Cancelar</button>
                  <button disabled={crearMutation.isPending} className="flex-1 rounded-lg bg-chloro px-3 py-1.5 text-[12.5px] font-semibold text-[#0B140D]">Guardar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
