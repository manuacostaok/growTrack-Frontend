const STAGES = ['germinacion', 'vegetativo', 'floracion', 'secado', 'curado'];
export const STAGE_LABELS = {
  germinacion: 'Germinación',
  vegetativo: 'Vegetativo',
  floracion: 'Floración',
  secado: 'Secado',
  curado: 'Curado',
};

export default function StageBar({ etapa, size = 'sm' }) {
  const idx = STAGES.indexOf(etapa);
  const height = size === 'lg' ? 'h-[7px]' : 'h-[5px]';

  return (
    <div className="flex gap-1">
      {STAGES.map((s, i) => (
        <div
          key={s}
          className={`flex-1 rounded-full ${height} ${
            i < idx ? 'bg-chloro' : i === idx ? 'bg-resin' : 'bg-borderDim'
          }`}
        />
      ))}
    </div>
  );
}

export { STAGES };
