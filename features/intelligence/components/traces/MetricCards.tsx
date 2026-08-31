"use client";

import { useRef, useState, useEffect } from "react";
import { mockMetrics } from "../../lib/mock-data";

let sparkUid = 0;
function SparklineSvg({ trend, positive }: { trend: number[]; positive: boolean }) {
  const id = useRef(`spark-grad-${sparkUid++}`);
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const color = positive ? "rgb(16,185,129)" : "rgb(248,113,113)";
  const pts = trend.map((v, i) => ({
    x: (i / (trend.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-5 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id.current} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id.current})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SparklineCard({ label, value, trend, positive }: typeof mockMetrics[number]) {
  return (
    <div data-targetable="metric" data-target-label={`${label}: ${value}`} className="flex min-w-[180px] flex-1 flex-col gap-1 rounded-lg bg-white/[0.03] p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="shrink-0 text-lg font-semibold text-foreground">{value}</span>
        <div className="min-w-0 pb-0.5" style={{ width: "45%" }}>
          <SparklineSvg trend={trend} positive={positive} />
        </div>
      </div>
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
      <div ref={scrollRef} className="dark-scrollbar flex gap-2 overflow-x-auto p-3 pb-2 scrollbar-none">
        {mockMetrics.map((metric) => (
          <SparklineCard key={metric.label} {...metric} />
        ))}
      </div>
      {isOverflowing && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{ background: "linear-gradient(to left, hsl(var(--panel-surface)) 0%, transparent 100%)" }} />
      )}
    </div>
  );
}
