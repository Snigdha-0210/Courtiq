import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const monthlyData = [
  { month: "Oct", pts: 23.4, xpts: 21.8 },
  { month: "Nov", pts: 25.1, xpts: 22.4 },
  { month: "Dec", pts: 24.8, xpts: 23.1 },
  { month: "Jan", pts: 27.2, xpts: 24.0 },
  { month: "Feb", pts: 28.9, xpts: 25.2 },
  { month: "Mar", pts: 26.4, xpts: 24.1 },
  { month: "Apr", pts: 27.8, xpts: 25.0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-3 text-xs">
      <p className="text-gray-400 font-bold tracking-wider mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data = monthlyData }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -24, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#666", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} domain={["auto","auto"]} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2A2A", strokeWidth: 1 }} />
        <ReferenceLine y={26.4} stroke="#444" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="pts"  name="Actual PPG"   stroke="#E8FF47" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#E8FF47" }} />
        <Line type="monotone" dataKey="xpts" name="Expected PPG" stroke="#666"    strokeWidth={1.5} dot={false} strokeDasharray="4 2" activeDot={{ r: 4, fill: "#666" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
