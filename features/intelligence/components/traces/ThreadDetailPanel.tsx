"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CaretDown, Copy, ShareNetwork, Plus } from "@phosphor-icons/react";
import { usePanels } from "../../lib/panel-context";
import { mockThreads, type EvalMetric } from "../../lib/mock-data";
import { ChatMessage } from "./ChatMessage";
import { PanelHeader, ScoreBadge } from "../panels/PanelHeader";

function StatusDot({ status }: { status: string }) {
  const color =
    status === "completed" ? "bg-emerald-400" :
    status === "failed" ? "bg-red-400" :
    "bg-yellow-400";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className="truncate text-[11px] text-foreground/80">{children}</span>
    </div>
  );
}

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

function EvalMetricCard({ metric, onClick }: { metric: EvalMetric; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-w-0 flex-col gap-1 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 text-left transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="truncate text-[11px] text-muted-foreground">{metric.label}</span>
        <MiniSparkline trend={metric.trend} />
      </div>
      <span className="text-[13px] font-semibold text-foreground">{metric.score.toFixed(2)}</span>
    </button>
  );
}

function AddMenu({ onClose, onAddNote }: { onClose: () => void; onAddNote: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    { label: "Add to dataset", action: onClose },
    { label: "Flag", action: onClose },
    { label: "Add note", action: () => { onAddNote(); onClose(); } },
  ];

  return (
    <div ref={ref} className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-white/[0.06] bg-[hsl(var(--panel-surface))] py-1 shadow-xl">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="flex w-full items-center px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function ThreadDetailPanel() {
  const { state, closeThread, openRun } = usePanels();
  const [evalOpen, setEvalOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [localNotes, setLocalNotes] = useState<string[]>([]);
  const thread = mockThreads.find((t) => t.id === state.threadId);

  useEffect(() => {
    if (thread) setLocalNotes(thread.notes);
  }, [thread?.id]);

  if (!thread) return null;

  const allNotes = localNotes;
  const hasNotes = allNotes.length > 0;

  const statusLabel = thread.status === "completed" ? "Pass" : thread.status === "failed" ? "Fail" : "Running";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        onClose={closeThread}
        title={thread.user}
        leading={<ScoreBadge score={thread.score} />}
        subtitle={
          <span className="inline-flex items-center gap-1 font-mono">
            {thread.traceId}
          </span>
        }
        trailing={
          <div className="relative flex items-center gap-0.5">
            <button
              onClick={() => navigator.clipboard.writeText(thread.traceId)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <Copy size={13} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <ShareNetwork size={13} />
            </button>
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <Plus size={13} />
            </button>
            {addMenuOpen && <AddMenu onClose={() => setAddMenuOpen(false)} onAddNote={() => {
              setLocalNotes((prev) => [...prev, ""]);
              setNotesOpen(true);
            }} />}
          </div>
        }
      />

      <div className="dark-scrollbar flex-1 overflow-y-auto px-3 py-1">
        {/* Metadata section */}
        <div className="mb-3 rounded-lg bg-white/[0.02] px-3 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            <MetaRow label="Status">
              <span className="inline-flex items-center gap-1.5">
                <StatusDot status={thread.status} />
                {statusLabel}
              </span>
            </MetaRow>
            <MetaRow label="Metric">{thread.metric}</MetaRow>
            <MetaRow label="Score">{thread.score.toFixed(2)}</MetaRow>
            <MetaRow label="Trace ID">{thread.traceId}</MetaRow>
            <MetaRow label="Latency">{thread.duration}</MetaRow>
            <MetaRow label="Thread ID">{thread.threadId}</MetaRow>
            <MetaRow label="Environment">{thread.environment.toLowerCase()}</MetaRow>
            <MetaRow label="User ID">{thread.userId}</MetaRow>
            <MetaRow label="Properties">{thread.properties}</MetaRow>
            <MetaRow label="Model">{thread.model}</MetaRow>
            <MetaRow label="Turns">{thread.turns}</MetaRow>
            <MetaRow label="Tokens">{thread.totalTokens.toLocaleString()}</MetaRow>
            <MetaRow label="Cost">{thread.totalCost}</MetaRow>
          </div>
        </div>

        {/* Evaluator Metrics */}
        <div className="mb-5 mt-5">
          <button
            onClick={() => setEvalOpen(!evalOpen)}
            className="mb-2 flex w-full items-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Evaluator Metrics
            <CaretDown
              size={11}
              weight="bold"
              className={`transition-transform ${evalOpen ? "" : "-rotate-90"}`}
            />
          </button>

          {evalOpen && (
            <div className="grid grid-cols-3 gap-2">
              {thread.evalMetrics.map((em) => (
                <EvalMetricCard
                  key={em.id}
                  metric={em}
                  onClick={() => {
                    if (em.evaluatorId) openRun(`eval_${em.evaluatorId}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Notes (optional, collapsible) */}
        {hasNotes && (
          <div className="mb-5">
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className="mb-2 flex w-full items-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Notes
              <CaretDown
                size={11}
                weight="bold"
                className={`transition-transform ${notesOpen ? "" : "-rotate-90"}`}
              />
            </button>

            {notesOpen && (
              <div className="flex flex-col gap-2">
                {allNotes.map((note, i) => (
                  <pre key={i} className="dark-scrollbar whitespace-pre-wrap rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-foreground/70">
                    {note || "New note..."}
                  </pre>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversation */}
        <div className="mb-2">
          <span className="text-[13px] font-semibold text-muted-foreground">Conversation</span>
        </div>
        <div>
          {thread.messages.map((msg, i) => (
            <ChatMessage key={msg.id} message={msg} prevRole={i > 0 ? thread.messages[i - 1].role : undefined} nextRole={i < thread.messages.length - 1 ? thread.messages[i + 1].role : undefined} />
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}
