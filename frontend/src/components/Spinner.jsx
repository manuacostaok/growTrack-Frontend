export default function Spinner({ size = 28, label }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-textDim">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: '0.9s' }}
      >
        <circle cx="12" cy="12" r="9" stroke="#242B20" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="#D8A84E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="text-[12.5px]">{label}</span>}
    </div>
  );
}
