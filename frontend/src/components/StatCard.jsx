export default function StatCard({ label, value }) {
  return (
    <div className="grow-card rounded-card border border-borderDim bg-surface1 p-4">
      <div className="font-display text-[26px] font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[12.5px] text-textDim">{label}</div>
    </div>
  );
}
