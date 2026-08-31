"use client";

import { useState, useRef, useCallback, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, FunnelSimple, List, SquaresFour, X, Plus } from "@phosphor-icons/react";
import { PanelHeader } from "../panels/PanelHeader";

interface Experiment {
  id: string;
  name: string;
  model: string;
  dataset: string;
  clarity: number;
  efficiency: number;
  accuracy: number;
  examples: number;
  errors: number;
  duration: string;
  cost: string;
  date: string;
}

const mockExperiments: Experiment[] = [
  { id: "exp_01", name: "Prompt v3 + RAG", model: "Claude 4 Sonnet", dataset: "support-golden-v2", clarity: 96.2, efficiency: 84.1, accuracy: 93.8, examples: 120, errors: 0, duration: "4m 12s", cost: "$2.41", date: "2h ago" },
  { id: "exp_02", name: "Prompt v3 baseline", model: "GPT 4.1", dataset: "support-golden-v2", clarity: 91.5, efficiency: 88.3, accuracy: 87.2, examples: 120, errors: 2, duration: "3m 48s", cost: "$3.12", date: "4h ago" },
  { id: "exp_03", name: "Few-shot + CoT", model: "GPT mini", dataset: "support-golden-v2", clarity: 82.1, efficiency: 92.4, accuracy: 79.6, examples: 120, errors: 0, duration: "2m 05s", cost: "$0.84", date: "6h ago" },
  { id: "exp_04", name: "System prompt v2", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 88.7, efficiency: 81.2, accuracy: 90.1, examples: 100, errors: 1, duration: "3m 55s", cost: "$2.18", date: "1d ago" },
  { id: "exp_05", name: "Temperature sweep 0.3", model: "GPT 4.1", dataset: "support-golden-v2", clarity: 93.1, efficiency: 86.5, accuracy: 88.9, examples: 120, errors: 0, duration: "3m 41s", cost: "$3.08", date: "1d ago" },
  { id: "exp_06", name: "Temperature sweep 0.7", model: "GPT 4.1", dataset: "support-golden-v2", clarity: 89.4, efficiency: 87.1, accuracy: 85.3, examples: 120, errors: 3, duration: "3m 52s", cost: "$3.15", date: "2d ago" },
  { id: "exp_07", name: "Chunk size 512", model: "Claude 4 Sonnet", dataset: "retrieval-bench", clarity: 90.2, efficiency: 79.8, accuracy: 94.5, examples: 80, errors: 0, duration: "5m 18s", cost: "$1.92", date: "2d ago" },
  { id: "exp_08", name: "Chunk size 1024", model: "Claude 4 Sonnet", dataset: "retrieval-bench", clarity: 91.8, efficiency: 76.3, accuracy: 95.1, examples: 80, errors: 0, duration: "6m 02s", cost: "$2.34", date: "3d ago" },
  { id: "exp_09", name: "No system prompt", model: "GPT mini", dataset: "support-golden-v1", clarity: 71.3, efficiency: 94.8, accuracy: 68.2, examples: 100, errors: 5, duration: "1m 42s", cost: "$0.61", date: "3d ago" },
  { id: "exp_10", name: "Prompt v2 + RAG", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 85.6, efficiency: 82.1, accuracy: 88.4, examples: 100, errors: 1, duration: "4m 01s", cost: "$2.05", date: "4d ago" },
  { id: "exp_11", name: "Structured output", model: "GPT mini", dataset: "extraction-set", clarity: 78.9, efficiency: 91.2, accuracy: 82.7, examples: 60, errors: 0, duration: "1m 28s", cost: "$0.52", date: "4d ago" },
  { id: "exp_12", name: "Tool use v2", model: "GPT mini", dataset: "tool-use-bench", clarity: 80.4, efficiency: 89.6, accuracy: 84.1, examples: 50, errors: 2, duration: "2m 11s", cost: "$0.73", date: "5d ago" },
  { id: "exp_13", name: "Baseline no tools", model: "GPT mini", dataset: "tool-use-bench", clarity: 76.2, efficiency: 93.1, accuracy: 72.8, examples: 50, errors: 0, duration: "1m 05s", cost: "$0.38", date: "5d ago" },
  { id: "exp_14", name: "Prompt v1 + RAG", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 82.3, efficiency: 80.5, accuracy: 86.7, examples: 100, errors: 2, duration: "4m 22s", cost: "$2.28", date: "6d ago" },
  { id: "exp_15", name: "Guardrails test", model: "Claude 4 Sonnet", dataset: "safety-set", clarity: 88.1, efficiency: 74.2, accuracy: 91.3, examples: 200, errors: 0, duration: "8m 45s", cost: "$4.12", date: "6d ago" },
  { id: "exp_16", name: "Max tokens 256", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 79.5, efficiency: 96.1, accuracy: 81.2, examples: 100, errors: 0, duration: "2m 30s", cost: "$1.45", date: "1w ago" },
  { id: "exp_17", name: "Max tokens 1024", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 92.4, efficiency: 78.3, accuracy: 89.8, examples: 100, errors: 0, duration: "5m 10s", cost: "$2.81", date: "1w ago" },
  { id: "exp_18", name: "Initial baseline", model: "Claude 4 Sonnet", dataset: "support-golden-v1", clarity: 75.8, efficiency: 83.7, accuracy: 78.4, examples: 100, errors: 4, duration: "3m 55s", cost: "$2.02", date: "1w ago" },
];

interface MetricSeries {
  label: string;
  color: string;
  data: number[];
}

const comparisonMetrics: MetricSeries[] = [
  { label: "Clarity", color: "#eab308", data: [72, 68, 74, 71, 78, 82, 76, 85, 81, 88, 84, 91, 87, 94, 96, 98] },
  { label: "Efficiency", color: "#f43f5e", data: [95, 92, 94, 88, 91, 86, 89, 84, 87, 90, 85, 83, 88, 86, 82, 84] },
  { label: "Accuracy", color: "#22c55e", data: [30, 38, 42, 50, 46, 55, 62, 58, 66, 72, 68, 78, 82, 86, 90, 94] },
];

const months = ["May", "Jun", "Jul", "Aug"];

function OverviewChart({ metrics, activeMetrics, onDotClick }: { metrics: MetricSeries[]; activeMetrics: Set<string>; onDotClick?: (dotIndex: number) => void }) {
  const uid = useId();
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const visible = metrics.filter((m) => activeMetrics.has(m.label));

  const w = 800;
  const h = 140;
  const py = 8;
  const xCount = 16;
  const dotIndices = [0, 5, 10, 15];

  function toX(i: number) { return (i / (xCount - 1)) * w; }
  function toY(v: number) { return h - py - (v / 100) * (h - py * 2); }

  return (
    <div className="relative h-full w-full">
      {/* Chart area */}
      <div className="absolute left-0 right-0 top-0 bottom-6">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            {visible.map((series) => (
              <linearGradient key={series.label} id={`${uid}-grad-${series.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.06" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {[0, 50, 100].map((v) => (
            <line key={v} x1={0} y1={toY(v)} x2={w} y2={toY(v)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}

          {/* Area fills + lines */}
          {visible.map((series) => {
            const pts = series.data.map((v, i) => ({ x: toX(i), y: toY(v) }));
            const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
            const areaPath = `${linePath} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;
            return (
              <g key={series.label}>
                <path d={areaPath} fill={`url(#${uid}-grad-${series.label})`} />
                <path d={linePath} fill="none" stroke={series.color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </svg>

        {/* Interactive dots */}
        {visible.map((series) =>
          dotIndices.map((i) => {
            const xPct = (i / (xCount - 1)) * 100;
            const yPct = (py + (1 - series.data[i] / 100) * (h - py * 2)) / h * 100;
            const dotKey = `${series.label}-${i}`;
            const isHovered = hoveredDot === dotKey;
            return (
              <div
                key={dotKey}
                className="absolute cursor-pointer"
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredDot(dotKey)}
                onMouseLeave={() => setHoveredDot(null)}
                onClick={() => onDotClick?.(i)}
              >
                {/* Invisible hit area for easier mouse targeting */}
                <div className="absolute -inset-3" />
                <div
                  className="rounded-full transition-all duration-150"
                  style={{
                    background: series.color,
                    width: isHovered ? 10 : 6,
                    height: isHovered ? 10 : 6,
                    transform: isHovered ? "translate(-2px, -2px)" : "translate(0, 0)",
                    boxShadow: isHovered ? `0 0 8px ${series.color}60` : "none",
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* X-axis labels */}
      <div className="absolute left-0 right-0 bottom-0 flex justify-between">
        {months.map((m) => (
          <span key={m} className="text-[9px] text-muted-foreground">{m}</span>
        ))}
      </div>
    </div>
  );
}

function ComparisonPill({ label, color, onRemove }: { label: string; color: string; onRemove: () => void }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
      <X size={9} weight="bold" className="cursor-pointer opacity-40 hover:opacity-100" onClick={onRemove} />
    </span>
  );
}

const ease = [0.32, 0.72, 0, 1] as const;
const transition = { duration: 0.35, ease };

function ExperimentDetailPanel({ experiment, onClose, isFromChart }: { experiment: Experiment | null; onClose: () => void; isFromChart?: boolean }) {
  if (!experiment) return null;

  const traceInput = "What is your return policy for electronics purchased more than 30 days ago?";
  const traceOutput = "Our standard return window is 30 days for electronics. However, items purchased with an extended warranty may be eligible for returns up to 90 days. Would you like me to check if your purchase qualifies?";
  const referenceOutput = "Electronics purchased more than 30 days ago are not eligible for standard returns. Extended warranty holders have a 90-day window. Refer customer to warranty lookup tool.";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader onClose={onClose} title={isFromChart ? "Trace Detail" : experiment.name} subtitle={isFromChart ? experiment.name : `${experiment.examples} examples · ${experiment.dataset}`} />
      <div className="dark-scrollbar flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-5">

          {/* Run metadata */}
          <div className="rounded-lg bg-white/[0.02] px-3 py-3">
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground/80">{experiment.model}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dataset</span><span className="text-foreground/80">{experiment.dataset}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground/80">{experiment.duration}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Examples</span><span className="text-foreground/80">{experiment.examples}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Errors</span><span className="text-foreground/80">{experiment.errors}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Cost</span><span className="text-foreground/80">{experiment.cost}</span></div>
            </div>
          </div>

          {/* Scores */}
          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Scores</span>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Clarity</span><span className="text-yellow-400">{experiment.clarity.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Efficiency</span><span className="text-red-400">{experiment.efficiency.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Accuracy</span><span className="text-emerald-400">{experiment.accuracy.toFixed(1)}%</span></div>
            </div>
          </div>

          {/* Trace detail (Input / Output / Reference) */}
          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Input</span>
            <pre className="dark-scrollbar overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-foreground/70">
              {traceInput}
            </pre>
          </div>

          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Output</span>
            <pre className="dark-scrollbar overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-foreground/70">
              {traceOutput}
            </pre>
          </div>

          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Reference Output</span>
            <pre className="dark-scrollbar overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-muted-foreground">
              {referenceOutput}
            </pre>
          </div>

          {/* Evaluator reasoning */}
          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Evaluator Reasoning</span>
            <div className="flex flex-col gap-2">
              <div className="rounded-lg bg-white/[0.02] px-3 py-2.5">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[11px] font-medium text-foreground/80">Clarity</span>
                  <span className="font-mono text-[10px] text-yellow-400">{experiment.clarity.toFixed(1)}%</span>
                </div>
                <p className="text-[11px] leading-[1.5] text-muted-foreground">Response is well-structured and easy to follow. The conditional statement about extended warranty is clear. Minor deduction for not proactively offering the warranty lookup.</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] px-3 py-2.5">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[11px] font-medium text-foreground/80">Accuracy</span>
                  <span className="font-mono text-[10px] text-emerald-400">{experiment.accuracy.toFixed(1)}%</span>
                </div>
                <p className="text-[11px] leading-[1.5] text-muted-foreground">Core policy facts are correct. The 30-day and 90-day windows match the reference. Slight deviation: model offers to check eligibility rather than directing to the warranty lookup tool as specified.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pb-4">
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Actions</span>
            <div className="flex flex-col gap-2">
              <button className="flex h-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[11px] font-medium text-foreground/80 transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]">
                Add to Dataset
              </button>
              <button className="flex h-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[11px] font-medium text-foreground/80 transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]">
                Share Results
              </button>
              <button className="flex h-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[11px] font-medium text-foreground/80 transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]">
                View Full Trace
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function ExperimentsContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(comparisonMetrics.map((m) => m.label)));
  const hasInteracted = useRef(false);

  if (selectedId) hasInteracted.current = true;

  const hasL2 = selectedId !== null;
  const selectedExperiment = selectedId ? mockExperiments.find((e) => e.id === selectedId) ?? null : null;
  const shouldAnimate = hasInteracted.current;

  const [isFromChart, setIsFromChart] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setIsFromChart(false);
  }, []);

  const handleDotClick = useCallback(() => {
    const randomExp = mockExperiments[Math.floor(Math.random() * mockExperiments.length)];
    setSelectedId(randomExp.id);
    setIsFromChart(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  const toggleMetric = useCallback((label: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <motion.div
        initial={false}
        animate={{ width: hasL2 ? "50%" : "100%" }}
        transition={shouldAnimate ? transition : { duration: 0 }}
        className="h-full shrink-0 overflow-hidden pr-1"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
          {/* Hero chart */}
          <div className="shrink-0 px-4 pt-4 pb-3">
            <div className="mb-3">
              <span className="text-[13px] font-semibold text-foreground">Trends</span>
            </div>
            <div className="h-[160px] w-full">
              <OverviewChart metrics={comparisonMetrics} activeMetrics={activeMetrics} onDotClick={handleDotClick} />
            </div>
            <div className="flex items-center gap-2 pt-3">
              {comparisonMetrics.map((m) => (
                <ComparisonPill
                  key={m.label}
                  label={m.label}
                  color={m.color}
                  onRemove={() => toggleMetric(m.label)}
                />
              ))}
              <button className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-white/[0.08] px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground">
                <Plus size={10} weight="bold" />
                Compare
              </button>
              <button className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-white/[0.08] px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground">
                <Plus size={10} weight="bold" />
                Create Experiment
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="shrink-0 px-4 pt-3 pb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <button className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-white/[0.08] px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground">
                <FunnelSimple size={11} />
                Add Filter
              </button>
              <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">{mockExperiments.length} Experiments</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex h-7 items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 transition-colors hover:border-white/[0.12]">
                  <MagnifyingGlass size={12} className="text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Search</span>
                </div>
                <div className="flex h-7 items-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                  <button className="flex h-full items-center rounded-l-lg bg-white/[0.06] px-2 text-foreground">
                    <List size={13} />
                  </button>
                  <button className="flex h-full items-center rounded-r-lg px-2 text-muted-foreground transition-colors hover:text-foreground">
                    <SquaresFour size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative flex-1 overflow-hidden">
            <div className="dark-scrollbar h-full overflow-auto px-4">
              <table className="w-full min-w-[700px] text-[12px]">
                <thead className="sticky top-0 z-10 bg-[hsl(var(--panel-surface))]">
                  <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
                    <th className="whitespace-nowrap py-2 pl-3 pr-3 font-medium">Name</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Model</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Clarity</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Efficiency</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Accuracy</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Examples</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Errors</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Cost</th>
                    <th className="w-8 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockExperiments.map((exp, i) => {
                    const isActive = selectedId === exp.id;
                    const prevActive = i > 0 && selectedId === mockExperiments[i - 1].id;
                    const hideTopBorder = isActive || prevActive;
                    return (
                      <tr
                        key={exp.id}
                        onClick={() => handleSelect(exp.id)}
                        className={`cursor-pointer transition-colors ${
                          hideTopBorder ? "border-t border-transparent" : "border-t border-white/[0.04]"
                        } table-row-interactive`}
                        style={{
                          borderRadius: 8,
                          ...(isActive ? {
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.03)",
                          } : {}),
                        }}
                      >
                        <td className="whitespace-nowrap py-2 pl-3 pr-3 font-medium text-foreground">{exp.name}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{exp.model}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-yellow-400">{exp.clarity.toFixed(1)}%</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-red-400">{exp.efficiency.toFixed(1)}%</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-emerald-400">{exp.accuracy.toFixed(1)}%</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{exp.examples}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{exp.errors}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{exp.cost}</td>
                        <td className="whitespace-nowrap py-2 text-center">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground [tr:hover_&]:opacity-100"
                          >
                            &middot;&middot;&middot;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-white/[0.04] cursor-pointer table-row-interactive transition-colors" style={{ borderRadius: 8 }}>
                    <td colSpan={9} className="py-2 pl-3 pr-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
                        <Plus size={11} weight="bold" />
                        Create new experiment
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasL2 && (
          <motion.div
            key="exp-l2"
            initial={{ x: "100%", width: "50%" }}
            animate={{ x: 0, width: "50%" }}
            exit={{ x: "100%" }}
            transition={transition}
            className="h-full shrink-0 overflow-hidden px-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              <ExperimentDetailPanel experiment={selectedExperiment} onClose={handleClose} isFromChart={isFromChart} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
