"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { mockMetrics } from "../../lib/mock-data";

function SparklineCard({ label, value, trend, change, positive }: typeof mockMetrics[number]) {
  const data = trend.map((v, i) => ({ i, v }));

  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className={`text-[11px] font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}>
          {change}
        </span>
      </div>
      <div className="h-6 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={positive ? "#10b981" : "#f87171"} stopOpacity={0.25} />
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
    <div className="relative shrink-0 overflow-hidden">
      <div className="flex gap-2.5 overflow-x-auto p-4 pb-3 scrollbar-none">
        {mockMetrics.map((metric) => (
          <SparklineCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[hsl(var(--panel-surface))] to-transparent" />
    </div>
  );
}
