export default function Logo({ size = 20 }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br from-chloro to-resin"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18.5V9" stroke="#0B140D" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 13c-3.2-0.6-5.4-2.8-5.6-6.4 3.4 0.2 5.6 2.2 6.4 5.2" fill="#0B140D" />
        <path d="M12 11.2c3.2-0.6 5.4-2.8 5.6-6.4-3.4 0.2-5.6 2.2-6.4 5.2" fill="#0B140D" />
        <ellipse cx="12" cy="19" rx="3.3" ry="4" fill="#0B140D" />
      </svg>
    </div>
  );
}
