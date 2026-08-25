"use client";

import { useRef, useState, useEffect } from "react";
import { mockMetrics } from "../../lib/mock-data";

function SparklineSvg({ trend, positive }: { trend: number[]; positive: boolean }) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const points = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-5 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#10b981" : "#f87171"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SparklineCard({ label, value, trend, change, positive }: typeof mockMetrics[number]) {
  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-1.5 rounded-lg bg-white/[0.03] p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className={`text-[11px] font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}>
          {change}
        </span>
      </div>
      <SparklineSvg trend={trend} positive={positive} />
    </div>
  );
}

export function MetricCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setIsOverflowing(el.scrollWidth > el.clientWidth + 2);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative shrink-0 overflow-hidden">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto p-3 pb-2 scrollbar-none">
        {mockMetrics.map((metric) => (
          <SparklineCard key={metric.label} {...metric} />
        ))}
      </div>
      {isOverflowing && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[hsl(var(--panel-surface))] to-transparent" />
      )}
    </div>
  );
}
