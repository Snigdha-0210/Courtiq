import clsx from "clsx";

export function Tabs({ tabs, active, onChange, className = "" }) {
  return (
    <div className={clsx("flex border-b border-gray-800 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={clsx(
            "px-4 py-2.5 text-[11px] font-bold tracking-[0.09em] uppercase whitespace-nowrap border-b-2 -mb-px transition-all duration-150",
            active === t.key
              ? "text-white border-accent"
              : "text-gray-500 border-transparent hover:text-gray-300"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
