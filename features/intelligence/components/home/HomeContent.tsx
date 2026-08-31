"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check } from "@phosphor-icons/react";
import { PanelHeader } from "../panels/PanelHeader";

const ease = [0.32, 0.72, 0, 1] as const;
const transition = { duration: 0.35, ease };

let sparkUid = 0;
function SparklineSvg({ trend, positive }: { trend: number[]; positive: boolean }) {
  const id = useRef(`home-spark-${sparkUid++}`);
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
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: number[];
  positive: boolean;
}

const primaryMetrics: Metric[] = [
  { label: "Factuality Rate", value: "94.2%", change: "+3.2%", trend: [86, 88, 87, 90, 89, 92, 91, 93, 93.5, 94.2], positive: true },
  { label: "Clarity Score", value: "91.8", change: "+1.4", trend: [85, 87, 86, 88, 89, 88, 90, 90.5, 91, 91.8], positive: true },
  { label: "P95 Latency", value: "890ms", change: "-120ms", trend: [1100, 1050, 980, 1020, 960, 940, 920, 910, 900, 890], positive: true },
  { label: "24h Cost", value: "$42.50", change: "+$2.00", trend: [32, 35, 34, 38, 37, 39, 40, 41, 41.5, 42.5], positive: false },
];

const secondaryMetrics: Metric[] = [
  { label: "Alerts Today", value: "4", change: "+1", trend: [2, 5, 3, 6, 4, 7, 3, 5, 3, 4], positive: false },
  { label: "Critical High Risk Issues", value: "3", change: "+1", trend: [1, 2, 1, 3, 2, 4, 3, 2, 3, 3], positive: false },
  { label: "Vulnerabilities Tested", value: "6", change: "+2", trend: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6], positive: true },
];

interface DistributionCard {
  title: string;
  subtitle: string;
  bars: { label: string; pct: number; color: string }[];
}

const distributionCards: DistributionCard[] = [
  { title: "Severity Distribution", subtitle: "Last 30 days", bars: [
    { label: "High", pct: 14, color: "#f97316" },
    { label: "Medium", pct: 24, color: "#eab308" },
    { label: "Low", pct: 52, color: "#22c55e" },
  ]},
  { title: "Exploitability", subtitle: "Last 30 days", bars: [
    { label: "High", pct: 18, color: "#f97316" },
    { label: "Medium", pct: 31, color: "#eab308" },
    { label: "Low", pct: 44, color: "#22c55e" },
  ]},
  { title: "Remediation Priority", subtitle: "Last 30 days", bars: [
    { label: "High", pct: 22, color: "#f97316" },
    { label: "Medium", pct: 28, color: "#eab308" },
    { label: "Low", pct: 46, color: "#22c55e" },
  ]},
  { title: "Risk Coverage", subtitle: "Last 30 days", bars: [
    { label: "High", pct: 10, color: "#f97316" },
    { label: "Medium", pct: 20, color: "#eab308" },
    { label: "Low", pct: 62, color: "#22c55e" },
  ]},
];

const activeIssues = [
  { severity: "#f87171", label: "Promo service timeout causing fallback failures", count: "23 traces", time: "2h ago" },
  { severity: "#f87171", label: "Hallucinated tracking numbers in shipping responses", count: "8 traces", time: "4h ago" },
  { severity: "#fbbf24", label: "Slow retrieval latency exceeding 2s budget", count: "41 traces", time: "6h ago" },
  { severity: "#fbbf24", label: "Missing tool fallback for payment API", count: "5 traces", time: "1d ago" },
  { severity: "#fbbf24", label: "Token budget exceeded on multi-turn sessions", count: "12 traces", time: "1d ago" },
  { severity: "#22c55e", label: "Citation accuracy below threshold on legal docs", count: "3 traces", time: "2d ago" },
];

function HorizontalBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] font-medium text-foreground">{label}</span>
      <div className="relative h-[18px] flex-1 overflow-hidden rounded bg-white/[0.04]">
        <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] text-muted-foreground">{pct}%</span>
    </div>
  );
}

function NoteRow({ issue }: { issue: { severity: string; label: string; count: string; time: string } }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-3 border-t border-white/[0.04] py-2.5 first:border-t-0">
      <button
        onClick={() => setChecked(!checked)}
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-emerald-400/40 bg-emerald-400/10"
            : "border-white/[0.12] bg-transparent hover:border-white/[0.20]"
        }`}
      >
        {checked && <Check size={10} weight="bold" className="text-emerald-400" />}
      </button>
      <span className={`flex-1 text-[12px] transition-colors ${checked ? "text-muted-foreground line-through" : "text-foreground/80"}`}>{issue.label}</span>
      <span className="shrink-0 text-[11px] text-muted-foreground">{issue.count}</span>
      <span className="shrink-0 text-[11px] text-muted-foreground">{issue.time}</span>
    </div>
  );
}

export function HomeContent() {
  const [noteOpen, setNoteOpen] = useState(false);
  const hasInteracted = useRef(false);
  if (noteOpen) hasInteracted.current = true;
  const shouldAnimate = hasInteracted.current;

  const handleClose = useCallback(() => setNoteOpen(false), []);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <motion.div
        initial={false}
        animate={{ width: noteOpen ? "50%" : "100%" }}
        transition={shouldAnimate ? transition : { duration: 0 }}
        className="h-full shrink-0 overflow-hidden pr-1"
      >
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
          <div className="dark-scrollbar flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 p-4">

            {/* Overview header + alert badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-foreground">Overview</span>
                <span className="text-[11px] text-muted-foreground">·</span>
                <span className="text-[11px] text-muted-foreground">Project Name (V1.2)</span>
                <span className="text-[11px] text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
              <div className="flex items-center gap-2">
                {secondaryMetrics.map((m) => (
                  <span
                    key={m.label}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      m.positive
                        ? "border-white/[0.06] text-muted-foreground"
                        : "border-red-400/20 bg-red-400/5 text-red-400"
                    }`}
                  >
                    {m.label} <span className="font-semibold">{m.value}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Section 2: Primary metrics */}
            <div className="grid grid-cols-4 gap-2">
              {primaryMetrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1 rounded-lg bg-white/[0.03] p-3">
                  <span className="text-[11px] text-muted-foreground">{m.label}</span>
                  <div className="flex items-end justify-between gap-2">
                    <span className="shrink-0 text-lg font-semibold text-foreground">{m.value}</span>
                    <span className={`shrink-0 text-[11px] ${m.positive ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
                  </div>
                  <div className="mt-0.5" style={{ width: "100%" }}>
                    <SparklineSvg trend={m.trend} positive={m.positive} />
                  </div>
                </div>
              ))}
            </div>

            {/* Section 3: Abnormalities */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-foreground">Abnormalities</span>
              <div className="grid grid-cols-4 gap-2">
                {distributionCards.map((card) => (
                  <div key={card.title} className="flex flex-col gap-3 rounded-lg bg-white/[0.03] p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-muted-foreground">{card.title}</span>
                      <span className="text-[11px] text-muted-foreground">{card.subtitle}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {card.bars.map((bar) => (
                        <HorizontalBar key={bar.label} {...bar} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Project Notes */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-foreground">Project Notes</span>
              <div className="flex flex-col">
                {activeIssues.map((issue) => (
                  <NoteRow key={issue.label} issue={issue} />
                ))}
                {/* Add note row */}
                <div
                  onClick={() => setNoteOpen(true)}
                  className="flex cursor-pointer items-center gap-3 border-t border-white/[0.04] py-2.5 transition-colors table-row-interactive"
                  style={noteOpen ? { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", borderRadius: 8 } : {}}
                >
                  <Plus size={12} className="text-muted-foreground/60" />
                  <span className="text-[12px] text-muted-foreground/60">Add a note</span>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {noteOpen && (
          <motion.div
            key="note-l2"
            initial={{ x: "100%", width: "50%" }}
            animate={{ x: 0, width: "50%" }}
            exit={{ x: "100%" }}
            transition={transition}
            className="h-full shrink-0 overflow-hidden px-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              <PanelHeader onClose={handleClose} title="New Note" />
              <div className="flex flex-1 flex-col items-center justify-start px-8 pt-[15%]">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-[13px] font-semibold text-foreground">Add a note</span>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Attach observations, action items, or context to this project.<br />Coming soon.
                  </p>
                  <button disabled className="mt-2 rounded-lg bg-white/[0.06] px-4 py-1.5 text-[11px] font-medium text-muted-foreground opacity-50">
                    Save note
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
