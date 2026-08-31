"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resize, ArrowUp } from "@phosphor-icons/react";
import { PanelHeader, EmojiChip } from "../panels/PanelHeader";

interface Evaluator {
  id: string;
  name: string;
  metric: string;
  type: string;
  judgeModel: string;
  calibration: number;
  scope: "Global" | "Project";
  status: "Active" | "Inactive";
  category: "llm" | "deterministic" | "statistical" | "safety";
  iconColor: string;
  emoji: string;
}

const mockEvaluators: Evaluator[] = [
  // LLM as Judge
  { id: "ev_01", name: "Faithfulness", metric: "Groundedness score", type: "LLM as judge", judgeModel: "gpt-4o", calibration: 94.2, scope: "Global", status: "Active", category: "llm", iconColor: "#f97316", emoji: "🎯" },
  { id: "ev_02", name: "Answer_relevance", metric: "Query-response alignment", type: "LLM as judge", judgeModel: "gpt-4o", calibration: 92.8, scope: "Global", status: "Active", category: "llm", iconColor: "#f43f5e", emoji: "🧭" },
  { id: "ev_03", name: "Hallucination_detector", metric: "Hallucination rate", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", calibration: 96.1, scope: "Global", status: "Active", category: "llm", iconColor: "#22c55e", emoji: "👻" },
  { id: "ev_04", name: "Context_precision", metric: "Retrieved chunk relevance", type: "LLM as judge", judgeModel: "gpt-4o-mini", calibration: 89.7, scope: "Project", status: "Active", category: "llm", iconColor: "#a855f7", emoji: "🔬" },
  { id: "ev_05", name: "Context_recall", metric: "Coverage of gold context", type: "LLM as judge", judgeModel: "gpt-4o-mini", calibration: 91.3, scope: "Project", status: "Active", category: "llm", iconColor: "#f97316", emoji: "🔎" },
  { id: "ev_06", name: "Coherence", metric: "Logical flow score", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", calibration: 93.5, scope: "Global", status: "Active", category: "llm", iconColor: "#f43f5e", emoji: "🧩" },
  { id: "ev_07", name: "Instruction_adherence", metric: "Constraint satisfaction", type: "LLM as judge", judgeModel: "gpt-4o", calibration: 95.0, scope: "Global", status: "Active", category: "llm", iconColor: "#22c55e", emoji: "📋" },
  { id: "ev_08", name: "Conciseness", metric: "Verbosity penalty", type: "LLM as judge", judgeModel: "gpt-4o-mini", calibration: 88.6, scope: "Global", status: "Active", category: "llm", iconColor: "#a855f7", emoji: "✂️" },
  { id: "ev_09", name: "Tone_consistency", metric: "Style deviation", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", calibration: 90.2, scope: "Project", status: "Active", category: "llm", iconColor: "#f97316", emoji: "🎭" },
  { id: "ev_10", name: "Multi_turn_memory", metric: "Context retention", type: "LLM as judge", judgeModel: "gpt-4o", calibration: 87.4, scope: "Global", status: "Active", category: "llm", iconColor: "#22c55e", emoji: "🧠" },
  { id: "ev_11", name: "Citation_accuracy", metric: "Source attribution F1", type: "LLM as judge", judgeModel: "gpt-4o", calibration: 91.9, scope: "Global", status: "Active", category: "llm", iconColor: "#f43f5e", emoji: "📎" },
  { id: "ev_12", name: "Tool_use_correctness", metric: "Action success rate", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", calibration: 93.7, scope: "Project", status: "Active", category: "llm", iconColor: "#a855f7", emoji: "🛠️" },

  // Deterministic
  { id: "ev_13", name: "PII_redaction_guard", metric: "PII leak rate", type: "Regex + NER", judgeModel: "—", calibration: 99.2, scope: "Global", status: "Active", category: "deterministic", iconColor: "#22c55e", emoji: "🕵️" },
  { id: "ev_14", name: "JSON_schema_validator", metric: "Schema conformance", type: "JSON Schema", judgeModel: "—", calibration: 100.0, scope: "Global", status: "Active", category: "deterministic", iconColor: "#3b82f6", emoji: "🔗" },
  { id: "ev_15", name: "Code_syntax_checker", metric: "Syntax pass rate", type: "AST parser", judgeModel: "—", calibration: 97.8, scope: "Global", status: "Active", category: "deterministic", iconColor: "#3b82f6", emoji: "💻" },
  { id: "ev_16", name: "Latency_budget", metric: "P95 latency (ms)", type: "Threshold", judgeModel: "—", calibration: 94.6, scope: "Project", status: "Active", category: "deterministic", iconColor: "#a855f7", emoji: "⏱️" },
  { id: "ev_17", name: "Token_cost_limiter", metric: "Cost per request ($)", type: "Threshold", judgeModel: "—", calibration: 98.1, scope: "Global", status: "Active", category: "deterministic", iconColor: "#f97316", emoji: "💰" },
  { id: "ev_18", name: "Regex_format_enforcer", metric: "Pattern match rate", type: "Regex", judgeModel: "—", calibration: 99.8, scope: "Global", status: "Active", category: "deterministic", iconColor: "#22c55e", emoji: "🔣" },
  { id: "ev_19", name: "Language_detection", metric: "ISO code accuracy", type: "fastText", judgeModel: "—", calibration: 97.3, scope: "Global", status: "Active", category: "deterministic", iconColor: "#3b82f6", emoji: "🌐" },
  { id: "ev_20", name: "Max_length_enforcer", metric: "Truncation rate", type: "Char count", judgeModel: "—", calibration: 100.0, scope: "Global", status: "Active", category: "deterministic", iconColor: "#f43f5e", emoji: "📏" },

  // Statistical / Similarity
  { id: "ev_21", name: "BLEU_score", metric: "BLEU-4", type: "n-gram overlap", judgeModel: "—", calibration: 82.4, scope: "Global", status: "Active", category: "statistical", iconColor: "#3b82f6", emoji: "📊" },
  { id: "ev_22", name: "ROUGE_L", metric: "ROUGE-L F1", type: "LCS overlap", judgeModel: "—", calibration: 85.1, scope: "Global", status: "Active", category: "statistical", iconColor: "#22c55e", emoji: "📈" },
  { id: "ev_23", name: "Semantic_similarity", metric: "Cosine sim (embed)", type: "Embedding distance", judgeModel: "text-embedding-3-large", calibration: 91.6, scope: "Global", status: "Active", category: "statistical", iconColor: "#a855f7", emoji: "🧲" },
  { id: "ev_24", name: "BERTScore", metric: "BERTScore F1", type: "Token embedding", judgeModel: "deberta-xlarge", calibration: 89.3, scope: "Global", status: "Active", category: "statistical", iconColor: "#f97316", emoji: "🤖" },
  { id: "ev_25", name: "Perplexity_monitor", metric: "Mean perplexity", type: "Language model", judgeModel: "gpt-2", calibration: 78.9, scope: "Project", status: "Active", category: "statistical", iconColor: "#f43f5e", emoji: "🌡️" },
  { id: "ev_26", name: "Edit_distance", metric: "Levenshtein ratio", type: "String distance", judgeModel: "—", calibration: 93.2, scope: "Global", status: "Active", category: "statistical", iconColor: "#3b82f6", emoji: "✏️" },

  // Safety & Compliance
  { id: "ev_27", name: "Toxicity_classifier", metric: "Toxic content rate", type: "Classifier", judgeModel: "perspective-api", calibration: 96.8, scope: "Global", status: "Active", category: "safety", iconColor: "#f43f5e", emoji: "🛡️" },
  { id: "ev_28", name: "Bias_detector", metric: "Fairness delta", type: "Classifier", judgeModel: "regard-v2", calibration: 88.4, scope: "Global", status: "Active", category: "safety", iconColor: "#a855f7", emoji: "⚖️" },
  { id: "ev_29", name: "Copyright_scanner", metric: "Verbatim match rate", type: "Fingerprint", judgeModel: "—", calibration: 95.7, scope: "Global", status: "Active", category: "safety", iconColor: "#f97316", emoji: "©️" },
  { id: "ev_30", name: "Prompt_injection_shield", metric: "Injection block rate", type: "Classifier", judgeModel: "deberta-v3", calibration: 97.2, scope: "Global", status: "Active", category: "safety", iconColor: "#22c55e", emoji: "🔒" },
  { id: "ev_31", name: "NSFW_filter", metric: "NSFW flag rate", type: "Classifier", judgeModel: "openai-moderation", calibration: 99.1, scope: "Global", status: "Active", category: "safety", iconColor: "#f43f5e", emoji: "🚫" },
  { id: "ev_32", name: "Compliance_checker", metric: "Policy violation rate", type: "Rule engine", judgeModel: "—", calibration: 98.5, scope: "Project", status: "Active", category: "safety", iconColor: "#3b82f6", emoji: "📜" },
  { id: "ev_33", name: "Data_leakage_sentinel", metric: "Training data overlap", type: "Min-k%", judgeModel: "—", calibration: 94.0, scope: "Global", status: "Active", category: "safety", iconColor: "#a855f7", emoji: "🚨" },
];

const ease = [0.32, 0.72, 0, 1] as const;
const transition = { duration: 0.35, ease };

function CalibrationBadge({ value }: { value: number }) {
  const color = value >= 95 ? "text-emerald-400" : value >= 90 ? "text-yellow-400" : "text-red-400";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${color}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
      {value.toFixed(1)}%
    </span>
  );
}

function EvaluatorCard({ evaluator, isActive, onClick, cardRef }: { evaluator: Evaluator; isActive: boolean; onClick: () => void; cardRef?: (el: HTMLButtonElement | null) => void }) {
  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className={`group flex flex-col rounded-lg border px-3 pb-3.5 pt-2.5 text-left transition-colors ${
        isActive
          ? "border-white/[0.12] bg-white/[0.03]"
          : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.10] hover:bg-white/[0.03]"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[18px]">{evaluator.emoji}</span>
        <Resize size={13} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <span className="mb-2.5 text-[13px] font-medium text-foreground">{evaluator.name}</span>
      <div className="flex flex-col gap-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Metric</span>
          <span className="text-foreground/70">{evaluator.metric}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className="text-foreground/70">{evaluator.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Judge model</span>
          <span className="text-foreground/70">{evaluator.judgeModel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Calibration</span>
          <CalibrationBadge value={evaluator.calibration} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Scope</span>
          <span className="text-foreground/70">{evaluator.scope}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="text-foreground/70">{evaluator.status}</span>
        </div>
      </div>
    </button>
  );
}

/* ── Calibration history per evaluator version ── */
const calibrationHistory = [
  { version: "v1.0", score: 0.71 },
  { version: "v1.2", score: 0.74 },
  { version: "v1.5", score: 0.79 },
  { version: "v1.8", score: 0.81 },
  { version: "v2.0", score: 0.82 },
  { version: "v2.2", score: 0.84 },
];

let calChartUid = 0;
function CalibrationChart({ history }: { history: { version: string; score: number }[] }) {
  const gradId = useRef(`cal-grad-${calChartUid++}`);
  const w = 200;
  const h = 64;
  const py = 6;
  const min = Math.min(...history.map((d) => d.score)) - 0.03;
  const max = Math.max(...history.map((d) => d.score)) + 0.02;
  const points = history.map((d, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - py - ((d.score - min) / (max - min)) * (h - py * 2);
    return { x, y, ...d };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId.current} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(74,222,128)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(74,222,128)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId.current})`} />
        <path d={line} fill="none" stroke="rgb(74,222,128)" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {points.map((p) => (
          <circle key={p.version} cx={p.x} cy={p.y} r={2.5} fill="rgb(74,222,128)" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flex justify-between text-[9px] text-muted-foreground">
        {history.map((d) => (
          <span key={d.version}>{d.version}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Vibe-coded slider ── */
function VibeSlider({
  value,
  min = 0,
  max = 100,
  suffix = "",
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  suffix?: string;
  onChange?: (value: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={`relative h-7 w-full overflow-hidden rounded-lg border bg-white/[0.015] ${onChange ? "border-white/[0.10]" : "border-white/[0.06]"}`}>
      <div className="absolute inset-y-0 left-0 bg-white/[0.06]" style={{ width: `${pct}%` }} />
      <div
        className="absolute top-[4px] bottom-[4px] w-[4px] rounded-[2px] bg-white/40"
        style={{ left: `calc(${pct}% - 2px)` }}
      />
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-foreground/80">
        {value}{suffix}
      </span>
      {onChange && (
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      )}
    </div>
  );
}

/* ── Segmented control ── */
function SegmentedControl({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={`flex h-7 items-center overflow-hidden rounded-lg border bg-white/[0.015] ${onChange ? "border-white/[0.10]" : "border-white/[0.06]"}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange?.(opt)}
          className={`flex h-full flex-1 items-center justify-center px-3 text-[11px] font-medium transition-colors ${
            opt === active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── Read-only select (viewer) ── */
function ReadOnlySelect({ value }: { value: string }) {
  return (
    <div className="flex h-7 items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 text-[11px] text-foreground/80">
      <span className="truncate">{value}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-muted-foreground">
        <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function EditableSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-full appearance-none rounded-lg border border-white/[0.10] bg-white/[0.015] px-2.5 pr-6 text-[11px] text-foreground/80 outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[hsl(var(--panel-surface))]">
            {opt}
          </option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const PROMPT_LINE = 20;
const PROMPT_PAD = 12;

function PromptEditor({
  value,
  onChange,
  textareaRef,
}: {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [caretLine, setCaretLine] = useState(1);
  const [format, setFormat] = useState("Text");
  const lines = value.length === 0 ? 1 : value.split("\n").length;
  const gutterWidth = Math.max(2, String(lines).length);
  const editorHeight = Math.max(280, lines * PROMPT_LINE + PROMPT_PAD * 2);

  const syncCaret = () => {
    const el = textareaRef.current;
    if (!el) return;
    setCaretLine(value.slice(0, el.selectionStart).split("\n").length || 1);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.12] bg-[#111111]">
      <div className="flex h-8 items-center border-b border-white/[0.06] px-1.5">
        <div className="relative">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="h-6 appearance-none rounded-md bg-transparent pl-2 pr-5 text-[11px] text-muted-foreground outline-none hover:bg-white/[0.04] hover:text-foreground"
          >
            <option value="Text" className="bg-[hsl(var(--panel-surface))]">Text</option>
            <option value="Markdown" className="bg-[hsl(var(--panel-surface))]">Markdown</option>
          </select>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground">
            <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="dark-scrollbar relative max-h-[420px] overflow-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bg-blue-500/[0.08]"
          style={{ top: PROMPT_PAD + (caretLine - 1) * PROMPT_LINE, height: PROMPT_LINE }}
        />
        <div className="relative flex" style={{ minHeight: editorHeight }}>
          <div
            aria-hidden
            className="select-none border-r border-white/[0.06] bg-white/[0.02] pt-3 text-right font-mono text-[11px] leading-5"
            style={{ width: `${gutterWidth + 2.25}ch` }}
          >
            {Array.from({ length: lines }, (_, i) => (
              <div
                key={i}
                className={`px-2 ${i + 1 === caretLine ? "text-foreground/55" : "text-muted-foreground/40"}`}
                style={{ height: PROMPT_LINE }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={syncCaret}
            onKeyDown={syncCaret}
            onClick={syncCaret}
            onSelect={syncCaret}
            onFocus={syncCaret}
            wrap="off"
            spellCheck={false}
            className="flex-1 resize-none overflow-x-auto whitespace-pre bg-transparent px-3 py-3 font-mono text-[11px] leading-5 text-foreground/85 outline-none caret-blue-400"
            style={{ height: editorHeight }}
          />
        </div>
      </div>
    </div>
  );
}

const AGENT_MODELS = ["ChatGPT", "Sonnet 4.0", "GPT-4o", "Gemini 2.5"];

function PromptAgent() {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [model, setModel] = useState(AGENT_MODELS[0]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resizeInput = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    resizeInput(inputRef.current);
  }, [input]);

  const reply = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes("strict") || lower.includes("threshold") || lower.includes("harsh")) {
      return "This prompt is moderately strict: it fails the whole output on a single contradiction. If you want fewer false negatives, require two unsupported claims before scoring 0.0, and keep the rest of the CoT steps.";
    }
    if (lower.includes("suggest") || lower.includes("improve") || lower.includes("change") || lower.includes("rewrite")) {
      return "I'd add one constraint: every claim must quote a supporting span from RETRIEVED CONTEXT. That usually lifts groundedness without changing the rest of the recipe. I can draft that into the prompt if you want.";
    }
    if (lower.includes("what") || lower.includes("does") || lower.includes("explain")) {
      return "This judge extracts claims from MODEL OUTPUT, checks each against RETRIEVED CONTEXT, and scores 0.0 if any claim contradicts. The CoT block is required before the numeric score so you can audit failures.";
    }
    return "I can explain this prompt, suggest a rewrite, or tighten a step. Ask about a specific line, or tell me the failure mode you're seeing.";
  };

  const send = () => {
    const q = input.trim();
    if (!q || waiting) return;
    setInput("");
    requestAnimationFrame(() => resizeInput(inputRef.current));
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setWaiting(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", content: reply(q) }]);
      setWaiting(false);
    }, 500);
  };

  const hasThread = messages.length > 0 || waiting;

  return (
    <div className="flex flex-col gap-1.5">
      {hasThread && (
        <div className="dark-scrollbar flex max-h-[200px] flex-col gap-2 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
              <div className={`max-w-[90%] rounded-lg px-3 py-2 text-[12px] leading-relaxed text-foreground ${msg.role === "user" ? "bg-blue-500/[0.08]" : "bg-white/[0.03]"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {waiting && (
            <div className="inline-flex items-center gap-1 rounded-lg bg-white/[0.03] px-3 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col rounded-xl border border-white/[0.12] bg-white/[0.04]">
        <textarea
          ref={inputRef}
          value={input}
          rows={1}
          onChange={(e) => {
            setInput(e.target.value);
            resizeInput(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask about the instructions…"
          className="dark-scrollbar max-h-[120px] min-h-[40px] w-full resize-none bg-transparent px-3.5 pt-3 text-[12px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="h-7 appearance-none rounded-full bg-transparent pl-2.5 pr-6 text-[11px] text-muted-foreground outline-none hover:text-foreground"
            >
              {AGENT_MODELS.map((opt) => (
                <option key={opt} value={opt} className="bg-[hsl(var(--panel-surface))]">
                  {opt}
                </option>
              ))}
            </select>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || waiting}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40"
          >
            <ArrowUp size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ icon, title, description, children, locked = false, compact = false }: { icon: string; title: string; description?: string; children: React.ReactNode; locked?: boolean; compact?: boolean }) {
  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-7"}`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
          {locked && (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          )}
        </div>
        {description && (
          <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── KV Row ── */
function KVRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

interface EvaluatorProfile {
  rubric: string;
  goldenFields: { field: string; mapping: string }[];
  calibration: { kappa: number; fpr: number; fnr: number; benchmarkSuite: string; history: { version: string; score: number }[] };
  runParams: { passThreshold: number; strictness: "Low" | "Medium" | "High"; failAction: string; sampleRate: number };
}

const evaluatorProfiles: Record<string, EvaluatorProfile> = {
  ev_01: {
    rubric: `"You are an expert fact-checker. Compare the MODEL OUTPUT against the RETRIEVED CONTEXT.\n\nFollow these evaluation steps:\n\nStep 1: Extract factual claims from the MODEL OUTPUT.\nStep 2: Verify each claim against the RETRIEVED CONTEXT.\nStep 3: If any claim directly contradicts the context, score 0.0.\nStep 4: Output your Chain-of-Thought reasoning before the final score."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "expert_reference_answer" },
      { field: "Retrieved Context", mapping: "retrieved_policy_chunks" },
      { field: "User Input", mapping: "customer_question" },
    ],
    calibration: { kappa: 0.84, fpr: 2.1, fnr: 5.5, benchmarkSuite: "500 Expert-annotated Legal Cases", history: [{ version: "v1.0", score: 0.71 }, { version: "v1.2", score: 0.74 }, { version: "v1.5", score: 0.79 }, { version: "v1.8", score: 0.81 }, { version: "v2.0", score: 0.82 }, { version: "v2.2", score: 0.84 }] },
    runParams: { passThreshold: 92, strictness: "Medium", failAction: "Block production release", sampleRate: 100 },
  },
  ev_02: {
    rubric: `"You are evaluating whether a MODEL OUTPUT directly and substantively answers the USER QUERY.\n\nStep 1: Identify the core intent of the USER QUERY.\nStep 2: Check if the MODEL OUTPUT addresses that intent.\nStep 3: Penalize tangential, off-topic, or overly generic responses.\nStep 4: Score 0.0–1.0 based on alignment. Provide reasoning."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "user_query" },
    ],
    calibration: { kappa: 0.79, fpr: 3.4, fnr: 4.8, benchmarkSuite: "1,200 Customer Support Queries", history: [{ version: "v1.0", score: 0.68 }, { version: "v1.3", score: 0.72 }, { version: "v1.6", score: 0.75 }, { version: "v2.0", score: 0.79 }] },
    runParams: { passThreshold: 85, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 },
  },
  ev_03: {
    rubric: `"You are a hallucination detection specialist. Your task is to identify claims in the MODEL OUTPUT that are NOT supported by the RETRIEVED CONTEXT.\n\nStep 1: Decompose the MODEL OUTPUT into atomic factual statements.\nStep 2: For each statement, determine if it is SUPPORTED, PARTIALLY SUPPORTED, or UNSUPPORTED by the context.\nStep 3: If any statement is fabricated or contradicts the context, flag it.\nStep 4: Score = (supported statements) / (total statements). Output reasoning."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Retrieved Context", mapping: "retrieved_context_chunks" },
      { field: "User Input", mapping: "original_query" },
    ],
    calibration: { kappa: 0.91, fpr: 1.2, fnr: 3.1, benchmarkSuite: "800 RAG Hallucination Cases", history: [{ version: "v1.0", score: 0.76 }, { version: "v1.4", score: 0.82 }, { version: "v1.7", score: 0.86 }, { version: "v2.0", score: 0.89 }, { version: "v2.1", score: 0.91 }] },
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_04: {
    rubric: `"You are evaluating retrieval quality. For each retrieved chunk, determine if it is USEFUL for answering the given question.\n\nStep 1: Read the USER QUERY and the REFERENCE ANSWER.\nStep 2: For each retrieved chunk, label it 'useful' (1) or 'not useful' (0).\nStep 3: Compute precision@k for each position.\nStep 4: Return the mean average precision across all chunks."`,
    goldenFields: [
      { field: "Retrieved Context", mapping: "retrieved_chunks[]" },
      { field: "Target Reference", mapping: "reference_answer" },
      { field: "User Input", mapping: "search_query" },
    ],
    calibration: { kappa: 0.74, fpr: 5.2, fnr: 7.1, benchmarkSuite: "600 Annotated Retrieval Sets", history: [{ version: "v1.0", score: 0.62 }, { version: "v1.3", score: 0.68 }, { version: "v1.6", score: 0.71 }, { version: "v2.0", score: 0.74 }] },
    runParams: { passThreshold: 80, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  ev_05: {
    rubric: `"You are verifying retrieval completeness. Check whether the RETRIEVED CONTEXT contains all information needed to support the REFERENCE ANSWER.\n\nStep 1: Decompose the REFERENCE ANSWER into individual statements.\nStep 2: For each statement, check if it can be attributed to the RETRIEVED CONTEXT.\nStep 3: Score = (attributable statements) / (total statements).\nStep 4: Provide attribution reasoning for each statement."`,
    goldenFields: [
      { field: "Retrieved Context", mapping: "retrieved_chunks[]" },
      { field: "Target Reference", mapping: "gold_answer" },
      { field: "User Input", mapping: "user_query" },
    ],
    calibration: { kappa: 0.77, fpr: 4.1, fnr: 6.3, benchmarkSuite: "450 Knowledge Base QA Pairs", history: [{ version: "v1.0", score: 0.65 }, { version: "v1.5", score: 0.72 }, { version: "v2.0", score: 0.77 }] },
    runParams: { passThreshold: 82, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 },
  },
  ev_06: {
    rubric: `"You are evaluating logical coherence and flow. The MODEL OUTPUT should present ideas in a clear, logically connected sequence.\n\nStep 1: Check if the response has a clear structure (intro, body, conclusion where applicable).\nStep 2: Verify logical transitions between ideas.\nStep 3: Flag contradictions, non-sequiturs, or abrupt topic shifts.\nStep 4: Score 0.0–1.0. Deduct for each logical flaw found."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "conversation_context" },
    ],
    calibration: { kappa: 0.81, fpr: 3.0, fnr: 4.2, benchmarkSuite: "700 Multi-turn Dialogue Samples", history: [{ version: "v1.0", score: 0.72 }, { version: "v1.4", score: 0.77 }, { version: "v2.0", score: 0.81 }] },
    runParams: { passThreshold: 88, strictness: "Medium", failAction: "Log warning", sampleRate: 80 },
  },
  ev_07: {
    rubric: `"You are checking if the MODEL OUTPUT satisfies all explicit constraints from the USER INSTRUCTION.\n\nStep 1: Extract all constraints from the instruction (format, length, tone, inclusions, exclusions).\nStep 2: Check each constraint against the MODEL OUTPUT.\nStep 3: Mark each constraint as MET or UNMET.\nStep 4: Score = (met constraints) / (total constraints). List each constraint and its status."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "system_prompt + user_message" },
    ],
    calibration: { kappa: 0.88, fpr: 1.8, fnr: 3.5, benchmarkSuite: "900 Instruction-Following Tasks", history: [{ version: "v1.0", score: 0.78 }, { version: "v1.3", score: 0.82 }, { version: "v1.6", score: 0.85 }, { version: "v2.0", score: 0.88 }] },
    runParams: { passThreshold: 90, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_08: {
    rubric: `"You are evaluating verbosity. The MODEL OUTPUT should be as concise as possible while retaining all essential information.\n\nStep 1: Identify the core information needed to answer the query.\nStep 2: Check for unnecessary repetition, filler phrases, or over-explanation.\nStep 3: Compare word count to an ideal response length.\nStep 4: Score 0.0–1.0 where 1.0 is optimally concise. Penalize both too verbose and too terse."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "user_query" },
      { field: "Target Reference", mapping: "ideal_concise_answer" },
    ],
    calibration: { kappa: 0.72, fpr: 6.1, fnr: 5.8, benchmarkSuite: "400 Brevity-Annotated Samples", history: [{ version: "v1.0", score: 0.61 }, { version: "v1.5", score: 0.68 }, { version: "v2.0", score: 0.72 }] },
    runParams: { passThreshold: 75, strictness: "Low", failAction: "Log warning", sampleRate: 50 },
  },
  ev_09: {
    rubric: `"You are evaluating tone and style consistency. The MODEL OUTPUT must match the prescribed brand voice defined in the STYLE GUIDE.\n\nStep 1: Identify the target tone (formal, casual, empathetic, technical, etc.) from the STYLE GUIDE.\nStep 2: Evaluate the MODEL OUTPUT for tone alignment.\nStep 3: Flag deviations (too casual, too robotic, inappropriate humor, etc.).\nStep 4: Score 0.0–1.0 based on overall alignment."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "conversation_context" },
      { field: "Retrieved Context", mapping: "brand_style_guide" },
    ],
    calibration: { kappa: 0.76, fpr: 4.5, fnr: 5.0, benchmarkSuite: "350 Brand Voice Samples", history: [{ version: "v1.0", score: 0.64 }, { version: "v1.4", score: 0.71 }, { version: "v2.0", score: 0.76 }] },
    runParams: { passThreshold: 80, strictness: "Medium", failAction: "Flag for human review", sampleRate: 60 },
  },
  ev_10: {
    rubric: `"You are evaluating multi-turn context retention. The MODEL OUTPUT should demonstrate awareness of facts, preferences, and entities mentioned in prior turns.\n\nStep 1: Extract key facts and entities from the CONVERSATION HISTORY.\nStep 2: Check if the MODEL OUTPUT correctly references or builds on prior context.\nStep 3: Flag contradictions with earlier statements or forgotten context.\nStep 4: Score 0.0–1.0 based on retention quality."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "full_conversation_history" },
      { field: "Target Reference", mapping: "expected_context_references" },
    ],
    calibration: { kappa: 0.70, fpr: 5.8, fnr: 7.2, benchmarkSuite: "500 Multi-turn Sessions", history: [{ version: "v1.0", score: 0.58 }, { version: "v1.3", score: 0.63 }, { version: "v1.7", score: 0.67 }, { version: "v2.0", score: 0.70 }] },
    runParams: { passThreshold: 78, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  ev_11: {
    rubric: `"You are verifying source attribution accuracy. Every factual claim in the MODEL OUTPUT that references a source must correctly cite and attribute to the provided documents.\n\nStep 1: Identify all claims with citations in the MODEL OUTPUT.\nStep 2: Verify each citation points to the correct source document.\nStep 3: Check for fabricated citations or misattributed quotes.\nStep 4: F1 score = 2 × (precision × recall) / (precision + recall) over attribution correctness."`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Retrieved Context", mapping: "source_documents[]" },
      { field: "User Input", mapping: "research_query" },
    ],
    calibration: { kappa: 0.78, fpr: 3.8, fnr: 4.6, benchmarkSuite: "650 Citation-Verified Research Outputs", history: [{ version: "v1.0", score: 0.66 }, { version: "v1.5", score: 0.73 }, { version: "v2.0", score: 0.78 }] },
    runParams: { passThreshold: 85, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_12: {
    rubric: `"You are evaluating tool/function call correctness. When the model decides to use a tool, verify the call is correct.\n\nStep 1: Check if the tool choice is appropriate for the user's request.\nStep 2: Verify all required parameters are provided and correctly typed.\nStep 3: Check parameter values are reasonable and match the user's intent.\nStep 4: Score: 1.0 = correct tool + correct params, 0.5 = correct tool + partial params, 0.0 = wrong tool or critical param error."`,
    goldenFields: [
      { field: "Model Output", mapping: "tool_call_json" },
      { field: "User Input", mapping: "user_message + available_tools_schema" },
      { field: "Target Reference", mapping: "expected_tool_call" },
    ],
    calibration: { kappa: 0.82, fpr: 2.5, fnr: 4.0, benchmarkSuite: "1,100 Tool-Use Scenarios", history: [{ version: "v1.0", score: 0.70 }, { version: "v1.4", score: 0.76 }, { version: "v1.8", score: 0.80 }, { version: "v2.0", score: 0.82 }] },
    runParams: { passThreshold: 90, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  // Deterministic
  ev_13: {
    rubric: `Regex + NER pipeline: Scans MODEL OUTPUT for PII patterns (SSN, email, phone, credit card, DOB, addresses) using regex matchers and a spaCy NER model. Any detected PII that was not explicitly requested by the user is flagged as a leak.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "user_query" },
    ],
    calibration: { kappa: 0.96, fpr: 0.3, fnr: 0.8, benchmarkSuite: "2,000 PII-Annotated Samples", history: [{ version: "v1.0", score: 0.91 }, { version: "v1.5", score: 0.94 }, { version: "v2.0", score: 0.96 }] },
    runParams: { passThreshold: 99, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_14: {
    rubric: `JSON Schema validation: Parses MODEL OUTPUT as JSON and validates against the expected schema definition. Checks required fields, types, enum values, nested object structure, and array constraints. Returns conformance ratio of valid fields to total expected fields.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "expected_json_schema" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (schema-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 100, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_15: {
    rubric: `AST parser: Extracts code blocks from MODEL OUTPUT, parses them through language-specific AST parsers (Python, JavaScript, TypeScript, SQL). Reports syntax errors with line numbers. Pass = parseable without errors.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.98, fpr: 0.1, fnr: 0.5, benchmarkSuite: "3,500 Code Generation Samples", history: [{ version: "v1.0", score: 0.95 }, { version: "v1.5", score: 0.97 }, { version: "v2.0", score: 0.98 }] },
    runParams: { passThreshold: 95, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 },
  },
  ev_16: {
    rubric: `Latency threshold: Measures end-to-end trace latency from first token request to last token received. Compares P95 latency against configurable budget. Exceeding budget = fail.`,
    goldenFields: [
      { field: "Model Output", mapping: "trace_latency_ms (from span metadata)" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (threshold-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 85, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  ev_17: {
    rubric: `Cost threshold: Calculates total token cost (input + output) using provider pricing tables. Compares per-request cost against configurable budget ceiling. Exceeding budget = fail.`,
    goldenFields: [
      { field: "Model Output", mapping: "token_usage (from span metadata)" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (threshold-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 90, strictness: "Low", failAction: "Log warning", sampleRate: 100 },
  },
  ev_18: {
    rubric: `Regex format enforcement: Validates MODEL OUTPUT against a set of configurable regex patterns. Use cases include enforcing date formats, phone number formats, markdown structure, or custom output templates.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "expected_format_patterns[]" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (regex-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 100, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_19: {
    rubric: `Language detection via fastText lid.176.ftz model. Classifies the language of MODEL OUTPUT and compares against the expected locale. Flags responses that drift into the wrong language mid-response.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "expected_locale (ISO 639-1)" },
    ],
    calibration: { kappa: 0.97, fpr: 0.4, fnr: 0.6, benchmarkSuite: "5,000 Multilingual Samples", history: [{ version: "v1.0", score: 0.93 }, { version: "v1.5", score: 0.96 }, { version: "v2.0", score: 0.97 }] },
    runParams: { passThreshold: 95, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 },
  },
  ev_20: {
    rubric: `Character/token count enforcement: Measures MODEL OUTPUT length in characters and tokens. Compares against configurable min/max bounds. Reports truncation ratio if output exceeds maximum.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (count-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 100, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  // Statistical
  ev_21: {
    rubric: `BLEU-4 n-gram overlap: Computes modified precision over 1-grams through 4-grams between MODEL OUTPUT and REFERENCE, with brevity penalty. Standard MT evaluation metric.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "reference_translation" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (corpus-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 70, strictness: "Low", failAction: "Log warning", sampleRate: 100 },
  },
  ev_22: {
    rubric: `ROUGE-L F1: Computes longest common subsequence (LCS) between MODEL OUTPUT and REFERENCE. Captures sentence-level structure similarity. F1 = harmonic mean of LCS-based precision and recall.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "reference_summary" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (LCS-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 65, strictness: "Low", failAction: "Log warning", sampleRate: 100 },
  },
  ev_23: {
    rubric: `Embedding cosine similarity: Encodes MODEL OUTPUT and REFERENCE using text-embedding-3-large, then computes cosine similarity. Captures semantic meaning beyond surface-level word overlap.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "reference_answer" },
    ],
    calibration: { kappa: 0.83, fpr: 2.8, fnr: 3.5, benchmarkSuite: "1,500 Semantic Similarity Pairs", history: [{ version: "v1.0", score: 0.76 }, { version: "v1.5", score: 0.80 }, { version: "v2.0", score: 0.83 }] },
    runParams: { passThreshold: 80, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  ev_24: {
    rubric: `BERTScore F1: Computes token-level embeddings using DeBERTa-xlarge-MNLI, then matches tokens greedily by cosine similarity. F1 = harmonic mean of precision (output → reference) and recall (reference → output).`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "reference_answer" },
    ],
    calibration: { kappa: 0.85, fpr: 2.4, fnr: 3.1, benchmarkSuite: "1,200 Human-Scored Summaries", history: [{ version: "v1.0", score: 0.78 }, { version: "v1.5", score: 0.82 }, { version: "v2.0", score: 0.85 }] },
    runParams: { passThreshold: 78, strictness: "Medium", failAction: "Log warning", sampleRate: 80 },
  },
  ev_25: {
    rubric: `Perplexity monitoring: Computes mean per-token perplexity of MODEL OUTPUT using a reference language model (GPT-2). High perplexity indicates disfluent, repetitive, or degenerate text. Tracked over time to detect distribution drift.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.68, fpr: 7.2, fnr: 8.1, benchmarkSuite: "2,000 Fluency-Annotated Samples", history: [{ version: "v1.0", score: 0.55 }, { version: "v1.3", score: 0.61 }, { version: "v1.7", score: 0.65 }, { version: "v2.0", score: 0.68 }] },
    runParams: { passThreshold: 60, strictness: "Low", failAction: "Log warning", sampleRate: 50 },
  },
  ev_26: {
    rubric: `Levenshtein edit distance ratio: Computes normalized edit distance between MODEL OUTPUT and REFERENCE. Ratio = 1 - (edit_distance / max_length). Useful for structured outputs where exact character matching matters.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Target Reference", mapping: "expected_output" },
    ],
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (string-based)", history: [{ version: "v1.0", score: 1.0 }, { version: "v2.0", score: 1.0 }] },
    runParams: { passThreshold: 85, strictness: "Medium", failAction: "Log warning", sampleRate: 100 },
  },
  // Safety
  ev_27: {
    rubric: `Toxicity classification via Perspective API. Scores MODEL OUTPUT across six dimensions: toxicity, severe toxicity, identity attack, insult, profanity, and threat. Overall score = max across dimensions. Threshold-configurable.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.92, fpr: 1.5, fnr: 2.0, benchmarkSuite: "10,000 Jigsaw Toxicity Samples", history: [{ version: "v1.0", score: 0.85 }, { version: "v1.5", score: 0.89 }, { version: "v2.0", score: 0.92 }] },
    runParams: { passThreshold: 98, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_28: {
    rubric: `Bias detection via REGARD-v2 classifier. Evaluates MODEL OUTPUT for demographic bias across gender, race, religion, and age dimensions. Computes fairness delta = max score gap between demographic groups mentioned in output.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "User Input", mapping: "demographic_context (if available)" },
    ],
    calibration: { kappa: 0.73, fpr: 5.5, fnr: 6.8, benchmarkSuite: "3,000 Bias-Annotated Outputs", history: [{ version: "v1.0", score: 0.60 }, { version: "v1.4", score: 0.67 }, { version: "v1.8", score: 0.71 }, { version: "v2.0", score: 0.73 }] },
    runParams: { passThreshold: 85, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 },
  },
  ev_29: {
    rubric: `Copyright fingerprinting: Computes n-gram overlap between MODEL OUTPUT and a corpus of copyrighted material. Flags verbatim matches of 50+ consecutive tokens. Reports longest matching subsequence and source document.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.89, fpr: 1.8, fnr: 2.5, benchmarkSuite: "1,500 Known-Source Passages", history: [{ version: "v1.0", score: 0.81 }, { version: "v1.5", score: 0.86 }, { version: "v2.0", score: 0.89 }] },
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_30: {
    rubric: `Prompt injection detection via fine-tuned DeBERTa-v3 classifier. Analyzes USER INPUT for injection patterns: role-play attacks, context ignoring instructions, encoded payloads, and multi-turn manipulation attempts. Blocks before model execution.`,
    goldenFields: [
      { field: "User Input", mapping: "raw_user_message" },
    ],
    calibration: { kappa: 0.90, fpr: 1.2, fnr: 2.8, benchmarkSuite: "5,000 Injection Attack Samples", history: [{ version: "v1.0", score: 0.79 }, { version: "v1.3", score: 0.84 }, { version: "v1.7", score: 0.88 }, { version: "v2.0", score: 0.90 }] },
    runParams: { passThreshold: 98, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_31: {
    rubric: `NSFW content detection via OpenAI Moderation API. Classifies MODEL OUTPUT across categories: sexual, violence, self-harm, hate, harassment. Any category exceeding threshold triggers flag.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.95, fpr: 0.5, fnr: 1.2, benchmarkSuite: "8,000 Content Moderation Samples", history: [{ version: "v1.0", score: 0.90 }, { version: "v1.5", score: 0.93 }, { version: "v2.0", score: 0.95 }] },
    runParams: { passThreshold: 99, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_32: {
    rubric: `Policy compliance engine: Evaluates MODEL OUTPUT against a configurable rule set defining organizational policies (data handling, disclosure requirements, regulatory language). Each rule is checked independently. Score = (passed rules) / (total rules).`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
      { field: "Retrieved Context", mapping: "policy_ruleset_config" },
    ],
    calibration: { kappa: 0.94, fpr: 0.8, fnr: 1.5, benchmarkSuite: "1,200 Compliance-Audited Outputs", history: [{ version: "v1.0", score: 0.87 }, { version: "v1.5", score: 0.91 }, { version: "v2.0", score: 0.94 }] },
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 },
  },
  ev_33: {
    rubric: `Training data leakage detection via Min-k% probability method. Computes the minimum k% token probabilities of MODEL OUTPUT under the base model. High min-k% scores indicate the output may be memorized training data rather than novel generation.`,
    goldenFields: [
      { field: "Model Output", mapping: "Supplied dynamically from execution run" },
    ],
    calibration: { kappa: 0.80, fpr: 3.2, fnr: 4.5, benchmarkSuite: "2,500 Memorization Test Cases", history: [{ version: "v1.0", score: 0.68 }, { version: "v1.5", score: 0.75 }, { version: "v2.0", score: 0.80 }] },
    runParams: { passThreshold: 90, strictness: "Medium", failAction: "Flag for human review", sampleRate: 40 },
  },
};

function HeaderAction({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "default" | "primary" | "danger";
}) {
  const toneClass =
    tone === "primary"
      ? "text-foreground hover:bg-white/[0.08] hover:text-foreground"
      : tone === "danger"
        ? "text-muted-foreground hover:bg-white/[0.06] hover:text-red-400"
        : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground";
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium transition-colors ${toneClass}`}
    >
      {children}
    </button>
  );
}

const FAIL_ACTIONS = ["Block production release", "Flag for human review", "Log warning"];
const JUDGE_MODELS = ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet"];

function EvaluatorDetailPanel({ evaluator, onClose }: { evaluator: Evaluator | null; onClose: () => void }) {
  const [editMode, setEditMode] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [draftParams, setDraftParams] = useState({ passThreshold: 0, strictness: "Medium" as "Low" | "Medium" | "High", failAction: "", sampleRate: 0 });
  const [draftModel, setDraftModel] = useState("");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const resetDraft = useCallback((ev: Evaluator | null) => {
    if (!ev) return;
    const p = evaluatorProfiles[ev.id];
    if (!p) return;
    setDraftPrompt(p.rubric);
    setDraftParams(p.runParams);
    setDraftModel(ev.judgeModel === "—" ? "N/A" : ev.judgeModel);
  }, []);

  useEffect(() => {
    setEditMode(false);
    const ev = mockEvaluators.find((e) => e.id === evaluator?.id) ?? null;
    resetDraft(ev);
  }, [evaluator?.id, resetDraft]);

  useEffect(() => {
    if (!editMode) return;
    const el = promptRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [editMode]);

  if (!evaluator) return null;

  const profile = evaluatorProfiles[evaluator.id];
  if (!profile) return null;

  const cal = profile.calibration;
  const rp = profile.runParams;
  const kappaLabel = cal.kappa >= 0.8 ? "High" : cal.kappa >= 0.6 ? "Moderate" : "Fair";
  const latestVersion = cal.history[cal.history.length - 1]?.version ?? "v1.0";
  const canEdit = evaluator.category === "llm";

  const exitEdit = (reset = false) => {
    if (reset) resetDraft(evaluator);
    setEditMode(false);
  };

  const handleClose = () => {
    exitEdit(true);
    onClose();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        onClose={handleClose}
        title={evaluator.name}
        leading={<EmojiChip emoji={evaluator.emoji} />}
        subtitle={editMode ? "Draft" : canEdit ? undefined : "View only · Contact admin to edit"}
        trailing={
          canEdit ? (
            editMode ? (
              <div className="flex items-center gap-0.5">
                <HeaderAction onClick={() => exitEdit(false)}>Save</HeaderAction>
                <HeaderAction tone="primary" onClick={() => exitEdit(false)}>Set as active</HeaderAction>
                <HeaderAction tone="danger" onClick={() => exitEdit(true)}>Discard</HeaderAction>
              </div>
            ) : (
              <HeaderAction tone="primary" onClick={() => setEditMode(true)}>Edit</HeaderAction>
            )
          ) : undefined
        }
      />

      {/* Scrollable body */}
      <div className="dark-scrollbar flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-12">

          {!editMode && (
            <>
              <div className="rounded-lg bg-white/[0.02] px-3 py-3">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Metric</span><span className="text-foreground/80">{evaluator.metric}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground/80">{evaluator.type}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Judge model</span><span className="text-foreground/80">{evaluator.judgeModel}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Calibration</span><CalibrationBadge value={evaluator.calibration} /></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Scope</span><span className="text-foreground/80">{evaluator.scope}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground/80">{evaluator.status}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="text-foreground/80">{latestVersion}</span></div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Cohen&apos;s Kappa</span><span className="text-foreground/80">{cal.kappa.toFixed(2)} <span className="text-emerald-400">({kappaLabel})</span></span></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">False Positive Rate</span><span className="text-foreground/80">{cal.fpr}%</span></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">False Negative Rate</span><span className="text-foreground/80">{cal.fnr}%</span></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Benchmark suite</span><span className="truncate text-foreground/80">{cal.benchmarkSuite}</span></div>
                  </div>
                  <div className="mt-2">
                    <CalibrationChart history={cal.history} />
                  </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <Section icon="🔗" title="Golden Fields" description="Map these fields to dataset columns for scoring." locked>
                <div className="flex flex-col gap-2.5">
                  {profile.goldenFields.map((gf) => (
                    <div key={gf.field} className="flex items-center justify-between gap-4">
                      <span className="shrink-0 text-[11px] text-muted-foreground">{gf.field}</span>
                      <div className="w-[55%]">
                        <ReadOnlySelect value={gf.mapping} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <div className="h-px bg-white/[0.06]" />
            </>
          )}

          <div className={editMode ? "flex flex-col gap-4" : "contents"}>
          {editMode && (
            <Section
              icon="⚙️"
              title="Edit Run Parameters"
              description="These apply to this draft. They do not change the live evaluator until you set a version as active."
              compact
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-[11px] text-muted-foreground">Pass Threshold</span>
                  <div className="w-[55%]">
                    <VibeSlider value={draftParams.passThreshold} suffix="%" onChange={(v) => setDraftParams((p) => ({ ...p, passThreshold: v }))} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-[11px] text-muted-foreground">Strictness</span>
                  <div className="w-[55%]">
                    <SegmentedControl
                      options={["Low", "Medium", "High"]}
                      active={draftParams.strictness}
                      onChange={(v) => setDraftParams((p) => ({ ...p, strictness: v as "Low" | "Medium" | "High" }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-[11px] text-muted-foreground">Fail Action</span>
                  <div className="w-[55%]">
                    <EditableSelect value={draftParams.failAction} options={FAIL_ACTIONS} onChange={(v) => setDraftParams((p) => ({ ...p, failAction: v }))} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-[11px] text-muted-foreground">Model</span>
                  <div className="w-[55%]">
                    <EditableSelect value={draftModel} options={JUDGE_MODELS} onChange={setDraftModel} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-[11px] text-muted-foreground">Sample Rate</span>
                  <div className="w-[55%]">
                    <VibeSlider value={draftParams.sampleRate} suffix="%" onChange={(v) => setDraftParams((p) => ({ ...p, sampleRate: v }))} />
                  </div>
                </div>
              </div>
            </Section>
          )}

          {editMode && <div className="h-px bg-white/[0.06]" />}

          <Section
            icon="📄"
            title={editMode ? "Edit Evaluator instructions" : evaluator.category === "llm" ? "Evaluator Rubric & Chain-of-Thought Instructions" : "Evaluation Logic"}
            description={editMode ? "Draft prompt sent to the judge model when scoring." : evaluator.category === "llm" ? "Prompt sent to the judge model when scoring." : "Programmatic logic used to compute this metric."}
            locked={!editMode}
            compact={editMode}
          >
            {editMode ? (
              <div className="flex flex-col gap-2">
                <PromptEditor value={draftPrompt} onChange={setDraftPrompt} textareaRef={promptRef} />
                <PromptAgent key={evaluator.id} />
              </div>
            ) : (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-3">
                <pre className="whitespace-pre-wrap text-[11px] leading-[1.6] text-foreground/70">{profile.rubric}</pre>
              </div>
            )}
          </Section>
          </div>

          {!editMode && (
            <>
              <div className="h-px bg-white/[0.06]" />

              <Section icon="⚙️" title="Run Parameters" description="Configured by your admin for dataset evaluation runs." locked>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[11px] text-muted-foreground">Pass Threshold</span>
                    <div className="w-[55%]"><VibeSlider value={rp.passThreshold} suffix="%" /></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[11px] text-muted-foreground">Strictness</span>
                    <div className="w-[55%]"><SegmentedControl options={["Low", "Medium", "High"]} active={rp.strictness} /></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[11px] text-muted-foreground">Fail Action</span>
                    <div className="w-[55%]"><ReadOnlySelect value={rp.failAction} /></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[11px] text-muted-foreground">Model</span>
                    <div className="w-[55%]"><ReadOnlySelect value={evaluator.judgeModel === "—" ? "N/A" : evaluator.judgeModel} /></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[11px] text-muted-foreground">Sample Rate</span>
                    <div className="w-[55%]"><VibeSlider value={rp.sampleRate} suffix="%" /></div>
                  </div>
                </div>
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export function EvaluatorsContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasInteracted = useRef(false);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  if (selectedId) hasInteracted.current = true;

  const hasL2 = selectedId !== null;
  const selectedEvaluator = hasL2 ? mockEvaluators.find((e) => e.id === selectedId) ?? null : null;
  const shouldAnimate = hasInteracted.current;

  const sections = [
    { key: "llm", label: "LLM as Judge", items: mockEvaluators.filter((e) => e.category === "llm") },
    { key: "deterministic", label: "Deterministic", items: mockEvaluators.filter((e) => e.category === "deterministic") },
    { key: "statistical", label: "Statistical & Similarity", items: mockEvaluators.filter((e) => e.category === "statistical") },
    { key: "safety", label: "Safety & Compliance", items: mockEvaluators.filter((e) => e.category === "safety") },
  ];

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    requestAnimationFrame(() => {
      const card = cardRefs.current.get(id);
      const container = scrollRef.current;
      if (card && container) {
        const cardTop = card.offsetTop;
        const stickyOffset = 41;
        const targetScroll = cardTop - stickyOffset;
        if (Math.abs(container.scrollTop - targetScroll) > 10) {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
    });
  }, []);

  const setCardRef = useCallback((id: string) => (el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const timeout = setTimeout(() => {
      const card = cardRefs.current.get(selectedId);
      const container = scrollRef.current;
      if (card && container) {
        const cardTop = card.offsetTop;
        const stickyOffset = 41;
        const targetScroll = cardTop - stickyOffset;
        if (Math.abs(container.scrollTop - targetScroll) > 10) {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
    }, 380);
    return () => clearTimeout(timeout);
  }, [selectedId]);

  useEffect(() => {
    function findNearest(currentId: string, dir: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") {
      const current = cardRefs.current.get(currentId);
      if (!current) return null;
      const cr = current.getBoundingClientRect();
      const cx = cr.left + cr.width / 2;
      const cy = cr.top + cr.height / 2;

      let bestId: string | null = null;
      let bestScore = Infinity;

      cardRefs.current.forEach((el, id) => {
        if (id === currentId) return;
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const dx = x - cx;
        const dy = y - cy;

        if (dir === "ArrowRight" && dx < 8) return;
        if (dir === "ArrowLeft" && dx > -8) return;
        if (dir === "ArrowDown" && dy < 8) return;
        if (dir === "ArrowUp" && dy > -8) return;

        const primary = dir === "ArrowLeft" || dir === "ArrowRight" ? Math.abs(dx) : Math.abs(dy);
        const offAxis = dir === "ArrowLeft" || dir === "ArrowRight" ? Math.abs(dy) : Math.abs(dx);
        const score = primary + offAxis * 2.4;
        if (score < bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      return bestId;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      e.preventDefault();
      if (!selectedId) {
        handleSelect(mockEvaluators[0].id);
        return;
      }
      const next = findNearest(selectedId, e.key);
      if (next) handleSelect(next);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, handleSelect]);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <motion.div
        initial={false}
        animate={{ width: hasL2 ? "50%" : "100%" }}
        transition={shouldAnimate ? transition : { duration: 0 }}
        className="h-full shrink-0 overflow-hidden pr-1"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
          <div ref={scrollRef} className="dark-scrollbar flex-1 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.key}>
                <div className="sticky top-0 z-10 flex h-[41px] items-center gap-2.5 bg-[hsl(var(--panel-surface))] px-4">
                  <h2 className="text-[13px] font-semibold text-foreground">{section.label}</h2>
                  <span className="text-[11px] text-muted-foreground">{section.items.length}</span>
                </div>
                <div className={`grid auto-rows-auto gap-2.5 px-4 pb-4 ${hasL2 ? "grid-cols-1 min-[1440px]:grid-cols-2" : "grid-cols-1 min-[1000px]:grid-cols-2 min-[1440px]:grid-cols-3 min-[1800px]:grid-cols-4 min-[2200px]:grid-cols-5"}`}>
                  {section.items.map((ev) => (
                    <EvaluatorCard key={ev.id} evaluator={ev} isActive={selectedId === ev.id} onClick={() => handleSelect(ev.id)} cardRef={setCardRef(ev.id)} />
                  ))}
                </div>
              </div>
            ))}
            <div className="h-4" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasL2 && (
          <motion.div
            key="eval-l2"
            initial={{ x: "100%", width: "50%" }}
            animate={{ x: 0, width: "50%" }}
            exit={{ x: "100%" }}
            transition={transition}
            className="h-full shrink-0 overflow-hidden pl-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              <EvaluatorDetailPanel evaluator={selectedEvaluator} onClose={() => setSelectedId(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
