import clsx from "clsx";

export function StatCard({ label, value, sub, delta, accentBorder, valueColor, className = "" }) {
  const deltaPositive = delta > 0;
  return (
    <div className={clsx(
      "bg-gray-900 border rounded p-4",
      accentBorder ? "border-accent/60" : "border-gray-800",
      className
    )}>
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">{label}</div>
      <div className={clsx("font-display text-[42px] font-black leading-none", valueColor || "text-white")}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-gray-500 mt-1.5">{sub}</div>}
      {delta !== undefined && (
        <div className={clsx("text-xs font-bold mt-2", deltaPositive ? "text-green" : "text-red")}>
          {deltaPositive ? `▲ +${delta}` : `▼ ${delta}`}
        </div>
      )}
    </div>
  );
}
