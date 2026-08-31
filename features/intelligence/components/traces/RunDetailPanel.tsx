"use client";

import { useRef } from "react";
import { usePanels } from "../../lib/panel-context";
import { mockThreads, type Message } from "../../lib/mock-data";
import { PanelHeader, TypeChip, EmojiChip } from "../panels/PanelHeader";

function findMessageAndResponse(threadId: string | null, runId: string | null): { message: Message | null; response: Message | null } {
  if (!threadId || !runId) return { message: null, response: null };
  const thread = mockThreads.find((t) => t.id === threadId);
  if (!thread) return { message: null, response: null };
  const idx = thread.messages.findIndex((m) => m.runId === runId);
  if (idx === -1) return { message: null, response: null };
  const message = thread.messages[idx];
  const response = message.role === "tool_call" && thread.messages[idx + 1]?.role === "tool_response"
    ? thread.messages[idx + 1]
    : null;
  return { message, response };
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-2 text-[13px] font-semibold text-muted-foreground">{children}</div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] text-foreground/80">{value}</span>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader onClose={onClose} title="" />
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <span className="text-[13px] text-muted-foreground">Click a step in the conversation to inspect it</span>
      </div>
    </div>
  );
}

interface EvaluatorInfo {
  id: string;
  name: string;
  emoji: string;
  type: string;
  judgeModel: string;
  metric: string;
  calibration: { kappa: number; fpr: number; fnr: number; benchmarkSuite: string; history: number[] };
  scope: string;
  status: string;
  rubric: string;
  goldenFields: { field: string; mapping: string }[];
  runParams: { passThreshold: number; strictness: string; failAction: string; sampleRate: number };
}

const evaluatorLookup: Record<string, EvaluatorInfo> = {
  ev_01: { id: "ev_01", name: "Faithfulness", emoji: "🎯", type: "LLM as judge", judgeModel: "gpt-4o", metric: "Groundedness score", scope: "Global", status: "Active",
    calibration: { kappa: 0.84, fpr: 2.1, fnr: 5.5, benchmarkSuite: "500 Expert-annotated Legal Cases", history: [71, 74, 79, 81, 82, 84] },
    rubric: "Compare model output against retrieved context. Extract factual claims, verify each, score 0.0 if any contradiction found.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "Target Reference", mapping: "expert_reference_answer" }, { field: "Retrieved Context", mapping: "retrieved_policy_chunks" }, { field: "User Input", mapping: "customer_question" }],
    runParams: { passThreshold: 92, strictness: "Medium", failAction: "Block production release", sampleRate: 100 } },
  ev_02: { id: "ev_02", name: "Answer_relevance", emoji: "🧭", type: "LLM as judge", judgeModel: "gpt-4o", metric: "Query-response alignment", scope: "Global", status: "Active",
    calibration: { kappa: 0.79, fpr: 3.4, fnr: 4.8, benchmarkSuite: "1,200 Customer Support Queries", history: [68, 72, 75, 79] },
    rubric: "Evaluate if model output directly answers the user query. Penalize tangential or generic responses.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "User Input", mapping: "user_query" }],
    runParams: { passThreshold: 85, strictness: "Medium", failAction: "Flag for human review", sampleRate: 100 } },
  ev_04: { id: "ev_04", name: "Context_precision", emoji: "🔬", type: "LLM as judge", judgeModel: "gpt-4o-mini", metric: "Retrieved chunk relevance", scope: "Project", status: "Active",
    calibration: { kappa: 0.74, fpr: 5.2, fnr: 7.1, benchmarkSuite: "600 Annotated Retrieval Sets", history: [62, 68, 71, 74] },
    rubric: "For each retrieved chunk, determine usefulness for answering the query. Compute precision@k.",
    goldenFields: [{ field: "Retrieved Context", mapping: "retrieved_chunks[]" }, { field: "Target Reference", mapping: "reference_answer" }, { field: "User Input", mapping: "search_query" }],
    runParams: { passThreshold: 80, strictness: "Medium", failAction: "Log warning", sampleRate: 100 } },
  ev_07: { id: "ev_07", name: "Instruction_adherence", emoji: "📋", type: "LLM as judge", judgeModel: "gpt-4o", metric: "Constraint satisfaction", scope: "Global", status: "Active",
    calibration: { kappa: 0.88, fpr: 1.8, fnr: 3.5, benchmarkSuite: "900 Instruction-Following Tasks", history: [78, 82, 85, 88] },
    rubric: "Check if model output satisfies all explicit constraints from the prompt instructions.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "System Prompt", mapping: "system_instructions" }, { field: "User Input", mapping: "user_query" }],
    runParams: { passThreshold: 90, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_08: { id: "ev_08", name: "Conciseness", emoji: "✂️", type: "LLM as judge", judgeModel: "gpt-4o-mini", metric: "Verbosity penalty", scope: "Global", status: "Active",
    calibration: { kappa: 0.72, fpr: 6.1, fnr: 5.8, benchmarkSuite: "400 Brevity-Annotated Samples", history: [61, 68, 72] },
    rubric: "Evaluate verbosity. Penalize unnecessary repetition, filler phrases, and over-explanation.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "User Input", mapping: "user_query" }],
    runParams: { passThreshold: 75, strictness: "Low", failAction: "Log warning", sampleRate: 50 } },
  ev_09: { id: "ev_09", name: "Tone_consistency", emoji: "🎭", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", metric: "Style deviation", scope: "Project", status: "Active",
    calibration: { kappa: 0.76, fpr: 4.5, fnr: 5.0, benchmarkSuite: "350 Brand Voice Samples", history: [64, 71, 76] },
    rubric: "Check if the model maintains consistent tone and style throughout the conversation.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "Conversation History", mapping: "prior_turns[]" }, { field: "Style Guide", mapping: "brand_tone_reference" }],
    runParams: { passThreshold: 80, strictness: "Medium", failAction: "Flag for human review", sampleRate: 60 } },
  ev_13: { id: "ev_13", name: "PII_leakage", emoji: "🔒", type: "Deterministic", judgeModel: "—", metric: "PII detection rate", scope: "Global", status: "Active",
    calibration: { kappa: 0.96, fpr: 0.3, fnr: 0.8, benchmarkSuite: "2,000 PII-Annotated Samples", history: [91, 94, 96] },
    rubric: "Regex + NER pipeline: Scans output for PII patterns (SSN, email, phone, credit card, DOB, addresses).",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "PII Patterns", mapping: "regex_ruleset_v3" }],
    runParams: { passThreshold: 99, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_32: { id: "ev_32", name: "Compliance_checker", emoji: "📜", type: "Rule engine", judgeModel: "—", metric: "Policy violation rate", scope: "Project", status: "Active",
    calibration: { kappa: 0.87, fpr: 1.5, fnr: 2.8, benchmarkSuite: "750 Regulatory Scenarios", history: [79, 82, 85, 87] },
    rubric: "Verify output does not contain regulated financial, medical, or legal advice without appropriate disclaimers.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "Regulatory Rules", mapping: "compliance_ruleset" }, { field: "Jurisdiction", mapping: "user_locale" }],
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_03: { id: "ev_03", name: "Hallucination_detector", emoji: "👻", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", metric: "Hallucination rate", scope: "Global", status: "Active",
    calibration: { kappa: 0.91, fpr: 1.2, fnr: 3.1, benchmarkSuite: "800 RAG Hallucination Cases", history: [76, 82, 86, 89, 91] },
    rubric: "Decompose model output into atomic factual statements. For each, determine if SUPPORTED, PARTIALLY SUPPORTED, or UNSUPPORTED by context. Score = supported / total.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "Retrieved Context", mapping: "retrieved_context_chunks" }, { field: "User Input", mapping: "original_query" }],
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_06: { id: "ev_06", name: "Coherence", emoji: "🧩", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", metric: "Logical flow score", scope: "Global", status: "Active",
    calibration: { kappa: 0.81, fpr: 3.0, fnr: 4.2, benchmarkSuite: "700 Multi-turn Dialogue Samples", history: [72, 77, 81] },
    rubric: "Evaluate logical coherence and flow. Check structure, verify transitions, flag contradictions or non-sequiturs. Score 0.0–1.0.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "User Input", mapping: "conversation_context" }],
    runParams: { passThreshold: 88, strictness: "Medium", failAction: "Log warning", sampleRate: 80 } },
  ev_10: { id: "ev_10", name: "Multi_turn_memory", emoji: "🧠", type: "LLM as judge", judgeModel: "gpt-4o", metric: "Context retention", scope: "Global", status: "Active",
    calibration: { kappa: 0.70, fpr: 5.8, fnr: 7.2, benchmarkSuite: "500 Multi-turn Sessions", history: [58, 63, 67, 70] },
    rubric: "Check if model output demonstrates awareness of facts, preferences, and entities from prior turns. Flag contradictions with earlier statements.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }, { field: "User Input", mapping: "full_conversation_history" }, { field: "Target Reference", mapping: "expected_context_references" }],
    runParams: { passThreshold: 78, strictness: "Medium", failAction: "Log warning", sampleRate: 100 } },
  ev_12: { id: "ev_12", name: "Tool_use_correctness", emoji: "🛠️", type: "LLM as judge", judgeModel: "claude-3-5-sonnet", metric: "Action success rate", scope: "Project", status: "Active",
    calibration: { kappa: 0.82, fpr: 2.5, fnr: 4.0, benchmarkSuite: "1,100 Tool-Use Scenarios", history: [70, 76, 80, 82] },
    rubric: "Verify tool choice is appropriate, all required parameters are provided and correctly typed, and values match user intent.",
    goldenFields: [{ field: "Model Output", mapping: "tool_call_json" }, { field: "User Input", mapping: "user_message + available_tools_schema" }, { field: "Target Reference", mapping: "expected_tool_call" }],
    runParams: { passThreshold: 90, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_16: { id: "ev_16", name: "Latency_budget", emoji: "⏱️", type: "Threshold", judgeModel: "—", metric: "P95 latency (ms)", scope: "Project", status: "Active",
    calibration: { kappa: 1.0, fpr: 0.0, fnr: 0.0, benchmarkSuite: "Deterministic (threshold)", history: [94, 95, 95] },
    rubric: "Measure end-to-end response latency. Pass if P95 is under the configured budget threshold.",
    goldenFields: [{ field: "Response Time", mapping: "measured_latency_ms" }, { field: "Budget", mapping: "latency_budget_ms" }],
    runParams: { passThreshold: 90, strictness: "Medium", failAction: "Log warning", sampleRate: 100 } },
  ev_27: { id: "ev_27", name: "Toxicity_classifier", emoji: "🛡️", type: "Classifier", judgeModel: "perspective-api", metric: "Toxic content rate", scope: "Global", status: "Active",
    calibration: { kappa: 0.92, fpr: 1.8, fnr: 2.1, benchmarkSuite: "5,000 Moderation Samples", history: [88, 90, 91, 92] },
    rubric: "Classify model output for toxicity, profanity, threats, and hate speech using Perspective API scores.",
    goldenFields: [{ field: "Model Output", mapping: "execution_run" }],
    runParams: { passThreshold: 95, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
  ev_30: { id: "ev_30", name: "Prompt_injection_shield", emoji: "🔒", type: "Classifier", judgeModel: "deberta-v3", metric: "Injection block rate", scope: "Global", status: "Active",
    calibration: { kappa: 0.89, fpr: 2.2, fnr: 1.5, benchmarkSuite: "3,000 Injection Attempts", history: [85, 87, 88, 89] },
    rubric: "Detect prompt injection attempts in user input and model output. Flag jailbreaks, role-playing exploits, and instruction overrides.",
    goldenFields: [{ field: "User Input", mapping: "user_message" }, { field: "Model Output", mapping: "execution_run" }, { field: "System Prompt", mapping: "system_instructions" }],
    runParams: { passThreshold: 98, strictness: "High", failAction: "Block production release", sampleRate: 100 } },
};

let sparkUid = 0;
function CalibrationSparkline({ history }: { history: number[] }) {
  const id = useRef(`cal-spark-${sparkUid++}`);
  const w = 120;
  const h = 32;
  const min = Math.min(...history) - 2;
  const max = Math.max(...history) + 2;
  const range = max - min || 1;
  const pts = history.map((v, i) => ({
    x: (i / (history.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id.current} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id.current})`} />
      <path d={line} fill="none" stroke="rgb(16,185,129)" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function EvaluatorProfileView({ evaluatorId, onClose }: { evaluatorId: string; onClose: () => void }) {
  const info = evaluatorLookup[evaluatorId];
  if (!info) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <PanelHeader onClose={onClose} title="Evaluator" leading={<TypeChip type="eval" />} />
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <span className="text-[13px] text-muted-foreground">Evaluator profile not found</span>
        </div>
      </div>
    );
  }

  const cal = info.calibration;
  const rp = info.runParams;
  const kappaLabel = cal.kappa >= 0.8 ? "High" : cal.kappa >= 0.6 ? "Moderate" : "Fair";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        onClose={onClose}
        title={info.name.replace(/_/g, " ")}
        leading={<EmojiChip emoji={info.emoji} />}
        subtitle=""
      />

      <div className="dark-scrollbar flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-7">

          {/* Overview + Calibration */}
          <div className="rounded-lg bg-white/[0.02] px-3 py-3">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="mb-1 text-[13px] font-semibold text-foreground">Overview</span>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Metric</span><span className="text-foreground/80">{info.metric}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground/80">{info.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Judge model</span><span className="text-foreground/80">{info.judgeModel}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Scope</span><span className="text-foreground/80">{info.scope}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground/80">{info.status}</span></div>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="mb-1 text-[13px] font-semibold text-foreground">Calibration</span>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Cohen&apos;s Kappa</span><span className="text-foreground/80">{cal.kappa.toFixed(2)} <span className="text-emerald-400">({kappaLabel})</span></span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">FPR</span><span className="text-foreground/80">{cal.fpr}%</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">FNR</span><span className="text-foreground/80">{cal.fnr}%</span></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">Benchmark</span><span className="truncate text-foreground/80">{cal.benchmarkSuite}</span></div>
                </div>
                <div className="mt-2">
                  <CalibrationSparkline history={cal.history} />
                </div>
              </div>
            </div>
          </div>

          {/* Golden Fields */}
          <div>
            <SectionHeader>Golden Fields</SectionHeader>
            <div className="flex flex-col gap-1.5">
              {info.goldenFields.map((gf) => (
                <div key={gf.field} className="flex items-baseline justify-between gap-2 rounded-md bg-white/[0.02] px-3 py-2.5">
                  <span className="shrink-0 text-[11px] text-muted-foreground">{gf.field}</span>
                  <span className="truncate font-mono text-[10px] text-foreground/60">{gf.mapping}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rubric */}
          <div>
            <SectionHeader>Rubric</SectionHeader>
            <pre className="dark-scrollbar overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-foreground/70">
              {info.rubric}
            </pre>
          </div>

          {/* Run Parameters */}
          <div className="pb-4">
            <SectionHeader>Run Parameters</SectionHeader>
            <div className="rounded-lg bg-white/[0.02] px-3 py-3">
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Pass Threshold</span><span className="text-foreground/80">{rp.passThreshold}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Strictness</span><span className="text-foreground/80">{rp.strictness}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fail Action</span><span className="text-foreground/80">{rp.failAction}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Sample Rate</span><span className="text-foreground/80">{rp.sampleRate}%</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function RunDetailPanel() {
  const { state, closeRun } = usePanels();

  if (state.l3Mode === "evaluator" && state.runId?.startsWith("eval_")) {
    const evaluatorId = state.runId.replace("eval_", "");
    return <EvaluatorProfileView evaluatorId={evaluatorId} onClose={closeRun} />;
  }

  const { message, response } = findMessageAndResponse(state.threadId, state.runId);

  if (!message) return <EmptyState onClose={closeRun} />;

  const isToolCall = message.role === "tool_call";
  const isRetriever = message.spanType === "retriever";
  const responseContent = isToolCall && response ? response.content : null;
  const isError = responseContent ? /error|UNAVAILABLE|failed|timeout/i.test(responseContent) : false;

  const latencyMs = message.latency ? parseInt(message.latency, 10) : null;
  const startTime = message.timestamp || "—";
  const endTimeMs = latencyMs && message.timestamp
    ? (() => {
        const [h, m, s] = message.timestamp.split(":").map(Number);
        const totalMs = (h * 3600 + m * 60 + s) * 1000 + latencyMs;
        const endS = Math.floor(totalMs / 1000);
        const hh = String(Math.floor(endS / 3600)).padStart(2, "0");
        const mm = String(Math.floor((endS % 3600) / 60)).padStart(2, "0");
        const ss = String(endS % 60).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      })()
    : "—";

  const retrieverDocs = isRetriever ? [
    { title: message.toolName?.includes("shipping") ? "Shipping & Delivery Policy v3.2" : message.toolName?.includes("return") ? "Returns & Refund Policy v2.1" : "Knowledge Base Article #401", score: 0.94, snippet: message.toolName?.includes("shipping") ? "FedEx shipments may be redirected up to 24h before scheduled delivery. Address changes are subject to carrier availability..." : message.toolName?.includes("return") ? "Electronics purchased within 30 days are eligible for full refund. Hardware defects qualify for expedited return processing..." : "Users can reset passwords via the account settings page or by requesting a reset link sent to their registered email address..." },
    { title: message.toolName?.includes("shipping") ? "Carrier SLA Reference" : message.toolName?.includes("return") ? "Warranty Coverage Matrix" : "Security FAQ - Account Recovery", score: 0.81, snippet: message.toolName?.includes("shipping") ? "FedEx Ground: 3-5 business days. FedEx Express: 1-2 business days. Redirect fees may apply after first delivery attempt..." : message.toolName?.includes("return") ? "Standard warranty covers manufacturing defects for 12 months. Extended warranty available for electronics over $100..." : "Reset tokens expire after 30 minutes. Users are limited to 5 reset requests per hour to prevent abuse..." },
  ] : [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        onClose={closeRun}
        title={message.toolName || message.model || "Run"}
        leading={<TypeChip type={isToolCall ? (message.spanType || "tool") : "llm"} />}
      />

      <div className="dark-scrollbar flex-1 overflow-y-auto px-3">
        <div className="mb-3 mt-1 rounded-lg bg-white/[0.02] px-3 py-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-muted-foreground">Status</span>
              <span className={`text-[11px] font-medium ${isError ? "text-red-400" : "text-emerald-400"}`}>{isError ? "Error" : "Success"}</span>
            </div>
            {message.model && <DetailRow label="Model" value={message.model} />}
            <DetailRow label="Span type" value={message.spanType || (isToolCall ? "tool" : "llm")} />
            {message.tokens && (
              <>
                <DetailRow label="Input tokens" value={message.tokens.input.toLocaleString()} />
                <DetailRow label="Output tokens" value={message.tokens.output.toLocaleString()} />
              </>
            )}
            {message.latency && <DetailRow label="Latency" value={message.latency} />}
            <DetailRow label="Start" value={startTime} />
            <DetailRow label="End" value={endTimeMs} />
            {message.cost && <DetailRow label="Cost" value={message.cost} />}
            <DetailRow label="Parent" value={isToolCall ? "AgentExecutor" : "RunnableSequence"} />
            <DetailRow label="Tags" value={isRetriever ? "rag, retrieval" : isToolCall ? "action, tool-use" : "generation, chat"} />
          </div>
        </div>

        <SectionHeader>{isToolCall ? "Call" : "Input"}</SectionHeader>
        <pre className="dark-scrollbar my-2 overflow-x-auto rounded-lg bg-white/[0.02] p-3 font-mono text-[11px] leading-[1.6] text-foreground/70">
          {isToolCall ? message.content : `{\n  "messages": [\n    {\n      "role": "system",\n      "content": "You are a helpful customer support agent..."\n    },\n    {\n      "role": "user",\n      "content": ${JSON.stringify(message.content?.slice(0, 80) || "...")}\n    }\n  ],\n  "model": "${message.model || "gpt-4o"}",\n  "temperature": 0.7,\n  "max_tokens": 1024\n}`}
        </pre>

        <SectionHeader>{isToolCall ? "Response" : "Output"}</SectionHeader>
        <pre className={`dark-scrollbar my-2 overflow-x-auto whitespace-pre-wrap rounded-lg p-3 font-mono text-[11px] leading-[1.6] ${isError ? "bg-red-500/[0.06] text-red-300" : "bg-white/[0.02] text-foreground/70"}`}>
          {isToolCall && responseContent ? responseContent : `{\n  "id": "chatcmpl-${message.runId || "abc123"}",\n  "choices": [\n    {\n      "message": {\n        "role": "assistant",\n        "content": ${JSON.stringify(message.content?.slice(0, 120) || "...")}...\n      },\n      "finish_reason": "stop"\n    }\n  ],\n  "usage": {\n    "prompt_tokens": ${message.tokens?.input || 0},\n    "completion_tokens": ${message.tokens?.output || 0}\n  }\n}`}
        </pre>

        {isRetriever && retrieverDocs.length > 0 && (
          <>
            <SectionHeader>Retrieved Documents</SectionHeader>
            <div className="mb-4 flex flex-col gap-2">
              {retrieverDocs.map((doc, i) => (
                <div key={i} className="rounded-lg bg-white/[0.02] px-3 py-2.5">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-medium text-foreground/80">{doc.title}</span>
                    <span className="shrink-0 font-mono text-[10px] text-emerald-400">{doc.score.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] leading-[1.5] text-muted-foreground">{doc.snippet}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
