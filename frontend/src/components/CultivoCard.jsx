import { useNavigate } from 'react-router-dom';
import StageBar, { STAGE_LABELS } from './StageBar';

const BADGE_CLASSES = {
  germinacion: 'bg-surface2 text-textDim border border-borderStrong',
  vegetativo: 'bg-chloro/10 text-[#8FCF9F]',
  floracion: 'bg-resin/10 text-resin',
  secado: 'bg-danger/10 text-[#E0947C]',
  curado: 'bg-danger/10 text-[#E0947C]',
};

function diasDesde(fecha) {
  if (!fecha) return 0;
  const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  return diff < 0 ? 0 : diff;
}

export default function CultivoCard({ cultivo }) {
  const navigate = useNavigate();
  const dias = diasDesde(cultivo.fechaGerminacion);

  return (
    <div
      onClick={() => navigate(`/cultivos/${cultivo._id}`)}
      className="cursor-pointer rounded-card border border-borderDim bg-surface1 p-4 transition hover:border-borderStrong hover:-translate-y-0.5"
    >
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="font-display text-[15px] font-semibold">{cultivo.nombre}</div>
            {cultivo.tipoCultivo === 'sala' && (
              <span className="rounded-md bg-surface2 px-1.5 py-0.5 font-mono text-[9.5px] text-textDim">
                sala · {cultivo.cantidadPlantas} plantas
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-textDim">{cultivo.variedad || 'Sin variedad'}</div>
        </div>
        <span className={`whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10.5px] ${BADGE_CLASSES[cultivo.etapa]}`}>
          {STAGE_LABELS[cultivo.etapa]}
        </span>
      </div>
      <div className="my-2.5">
        <StageBar etapa={cultivo.etapa} />
      </div>
      <div className="flex justify-between font-mono text-[11.5px] text-textFaint">
        <span>Día {dias}</span>
        <span>{cultivo.seguimientos?.length ?? 0} registros</span>
      </div>
    </div>
  );
}
