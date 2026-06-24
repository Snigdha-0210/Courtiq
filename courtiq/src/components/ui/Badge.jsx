import clsx from "clsx";

const VARIANTS = {
  elite: "bg-green/10 text-green",
  good:  "bg-accent/10 text-accent",
  avg:   "bg-gray-700/60 text-gray-400",
  poor:  "bg-red/10 text-red",
  out:   "bg-red/10 text-red",
  ques:  "bg-orange-500/10 text-orange-400",
  prob:  "bg-green/10 text-green",
};

export function Badge({ label, variant = "avg" }) {
  return (
    <span className={clsx("inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-[0.06em] uppercase", VARIANTS[variant])}>
      {label}
    </span>
  );
}
