"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { mockMetrics } from "../../lib/mock-data";

function SparklineCard({ label, value, trend, change, positive }: typeof mockMetrics[number]) {
  const data = trend.map((v, i) => ({ i, v }));

  return (
    <div className="flex w-[220px] shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}>
          {change}
        </span>
      </div>
      <div className="h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={positive ? "#10b981" : "#f87171"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={positive ? "#10b981" : "#f87171"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={positive ? "#10b981" : "#f87171"}
              strokeWidth={1.5}
              fill={`url(#grad-${label})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MetricCards() {
  return (
    <div className="flex shrink-0 gap-3 overflow-x-auto px-5 py-4 scrollbar-none">
      {mockMetrics.map((metric) => (
        <SparklineCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
