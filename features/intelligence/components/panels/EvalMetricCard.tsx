"use client";

import { useRef } from "react";

let sparkUid = 0;

function MiniSparkline({ trend }: { trend: number[] }) {
  const id = useRef(`eval-spark-${sparkUid++}`);
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const w = 48;
  const h = 16;
  const pts = trend.map((v, i) => ({
    x: (i / (trend.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;
  const color = "rgb(16,185,129)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-3 w-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id.current} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id.current})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const cardClass =
  "flex min-w-0 flex-col gap-1 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 text-left";

export function EvalMetricCard({
  label,
  value,
  trend,
  suffix,
  onClick,
}: {
  label: string;
  value: string;
  trend?: number[];
  suffix?: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      <div className="flex w-full items-start justify-between gap-2">
        <span className="min-w-0 text-[11px] leading-tight text-muted-foreground">{label}</span>
        {trend && trend.length > 1 && <MiniSparkline trend={trend} />}
      </div>
      <div className="flex min-w-0 items-baseline gap-1">
        <span className="truncate text-[13px] font-semibold text-foreground">{value}</span>
        {suffix && <span className="shrink-0 text-[11px] text-muted-foreground">{suffix}</span>}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cardClass} transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]`}
      >
        {body}
      </button>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
