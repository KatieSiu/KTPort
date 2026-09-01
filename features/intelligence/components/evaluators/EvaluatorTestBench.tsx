"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarBlank, CaretDown, Clock, CurrencyDollar, Play, Stack } from "@phosphor-icons/react";
import { PanelHeader } from "../panels/PanelHeader";
import { EvalMetricCard } from "../panels/EvalMetricCard";

type Source = "dataset" | "raw" | "trace";

interface DemoRow {
  id: string;
  input: string;
  output: string;
  score: number;
  reasoning: string;
  latency: string;
  tokens: number;
  cost: string;
}

const DEMO_DATASETS = [
  { id: "ds_02", name: "rag_faithfulness_benchmark", rows: 800 },
  { id: "ds_01", name: "support_ticket_golden_v3", rows: 1240 },
  { id: "ds_07", name: "hallucination_regression_set", rows: 340 },
  { id: "ds_13", name: "citation_accuracy_corpus", rows: 350 },
];

function yamlTurns(turns: { role: string; text: string; type?: string; id: string }[]) {
  return turns
    .map((t) => {
      const quoted = t.text.includes("\n") || t.text.includes(":") || t.text.length > 72;
      const text = quoted
        ? `"${t.text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
        : t.text;
      return [
        "- content:",
        "    parts:",
        `      - text: ${text}`,
        `        type: ${t.type ?? "text"}`,
        `    role: ${t.role}`,
        `    id: ${t.id}`,
      ].join("\n");
    })
    .join("\n");
}

const DEMO_RESULTS: Record<string, DemoRow[]> = {
  ds_02: [
    {
      id: "r1",
      input: yamlTurns([
        { role: "user", id: "usr_7c21", text: "What is the cancellation window on the Plus plan? I was charged after I thought I had already cancelled." },
        { role: "system", id: "ctx_a19f", type: "context", text: "Plus plan — Billing & refunds (v4.2). Customers on Plus or Pro may cancel within 14 days of the initial charge for a full refund. After day 14, unused time is credited as account balance. Cancellation is self-serve from Settings → Plan." },
      ]),
      output: "You can cancel anytime in the first 14 days for a full refund. After that window, unused time converts to account credit instead of a cash refund. I can start the cancellation from Settings → Plan if you want.",
      score: 0.96,
      reasoning: "Every claim is supported by the retrieved refund policy.",
      latency: "1.4s",
      tokens: 86,
      cost: "<$0.001",
    },
    {
      id: "r2",
      input: yamlTurns([
        { role: "user", id: "usr_3e90", text: "Does the enterprise tier include SSO? We need SAML before we migrate the rest of the org." },
        { role: "system", id: "ctx_b2c1", type: "context", text: "Enterprise security. SAML 2.0 SSO is included on Enterprise. Directory sync (SCIM) is listed as a complementary add-on in the security appendix and is not priced in the base Enterprise SKU." },
      ]),
      output: "Yes. Enterprise includes SAML SSO and SCIM provisioning, so you can roll this out before the rest of the org migrates.",
      score: 0.91,
      reasoning: "SSO is in context; SCIM is implied as an add-on, not included in the base SKU.",
      latency: "0.9s",
      tokens: 54,
      cost: "<$0.001",
    },
    {
      id: "r3",
      input: yamlTurns([
        { role: "user", id: "usr_11ab", text: "How do I reset a teammate's password? They are locked out of admin." },
        { role: "assistant", id: "asst_01", text: "I can walk you through the self-serve reset first." },
        { role: "system", id: "ctx_d44e", type: "context", text: "Password reset. Any member can reset their own password from the login screen. Workspace owners cannot reset another member's password; the locked-out user must use the email reset link." },
      ]),
      output: "Admins can reset passwords from Settings → Members. Open their row, choose Reset password, and they will get a one-time link.",
      score: 0.42,
      reasoning: "Context only documents self-serve reset. Admin reset is unsupported.",
      latency: "2.1s",
      tokens: 71,
      cost: "$0.002",
    },
    {
      id: "r4",
      input: yamlTurns([
        { role: "user", id: "usr_90f2", text: "Is data stored in the EU? Legal wants a residency guarantee for Plus customers." },
        { role: "system", id: "ctx_e781", type: "context", text: "Data residency. Default region is us-east-1. EU residency (eu-west-1) is available as an optional control-plane setting and is off unless the workspace admin enables it. Plus does not include residency by default." },
      ]),
      output: "All Plus customers are hosted in eu-west-1, so your data stays in the EU by default. No extra setup is required.",
      score: 0.18,
      reasoning: "Retrieved context says residency is optional and off by default.",
      latency: "1.1s",
      tokens: 48,
      cost: "<$0.001",
    },
    {
      id: "r5",
      input: yamlTurns([
        { role: "user", id: "usr_c4d0", text: "What's the SLA for P1 incidents?" },
        { role: "system", id: "ctx_f003", type: "context", text: "On-call appendix. P1 (service down or data-loss risk): 15-minute first response, 60-minute update cadence. P2: 1-hour first response. Credits apply only to Enterprise contracts." },
      ]),
      output: "P1 incidents have a 15-minute response SLA, with updates at least every hour until the incident is mitigated.",
      score: 0.88,
      reasoning: "Matches the on-call appendix; no extra claims.",
      latency: "0.8s",
      tokens: 39,
      cost: "<$0.001",
    },
  ],
  ds_01: [
    {
      id: "r1",
      input: yamlTurns([
        { role: "user", id: "tkt_8841", text: "I was charged twice for August. Confirmation emails came in 2 minutes apart." },
        { role: "assistant", id: "asst_12", text: "I can see two invoices, INV-2291 and INV-2292, both for $48.00." },
        { role: "user", id: "tkt_8841b", text: "Please refund the duplicate. Same card ending 4412." },
        { role: "system", id: "pol_dup", type: "context", text: "Duplicate charges. If two invoices post within 15 minutes for the same plan and amount, refund the later invoice in full." },
      ]),
      output: "I issued a refund for the duplicate August invoice (INV-2292, $48.00). It should post back to the card ending 4412 in 5–7 business days. INV-2291 stays as the August charge.",
      score: 0.84,
      reasoning: "Refund action matches policy; the card last-four is restated from the ticket, not the policy chunk.",
      latency: "2.4s",
      tokens: 112,
      cost: "$0.002",
    },
    {
      id: "r2",
      input: yamlTurns([
        { role: "user", id: "tkt_9022", text: "Can I change my flight to Friday? Confirmation NQ4-882." },
        { role: "system", id: "inv_09", type: "context", text: "PNR NQ4-882. Saturday 9:40am BOS→ORD, coach. Friday inventory is waitlist only; no confirmed seat on any Friday departure this week." },
      ]),
      output: "Yes — I rebooked you on Friday at 4:10pm. Your new confirmation is NQ4-910. No change fee was applied.",
      score: 0.33,
      reasoning: "Context has no confirmed inventory for Friday.",
      latency: "3.2s",
      tokens: 67,
      cost: "$0.002",
    },
    {
      id: "r3",
      input: yamlTurns([
        { role: "user", id: "tkt_3310", text: "Where is my package? Tracking 1Z999AA10123456784." },
        { role: "system", id: "shp_77", type: "context", text: "Shipment 1Z999AA10123456784. Departed Memphis sort at 06:12 CT. Next scan: Cincinnati. ETA Aug 31 EOD." },
      ]),
      output: "Tracking shows it left Memphis this morning and is headed to Cincinnati. Still on track for delivery by end of day today.",
      score: 0.79,
      reasoning: "Carrier event is in the retrieved shipment log.",
      latency: "1.0s",
      tokens: 44,
      cost: "<$0.001",
    },
    {
      id: "r4",
      input: yamlTurns([
        { role: "user", id: "tkt_1188", text: "The promo code SAVE20 failed at checkout." },
        { role: "system", id: "prm_02", type: "context", text: "SAVE20 expired Aug 1, 2026 00:00 UTC. Active codes: WELCOME10 (new workspaces), LOYAL10 (existing annual plans)." },
      ]),
      output: "SAVE20 expired on Aug 1. I applied LOYAL10 instead so you still get 10% off this invoice.",
      score: 0.71,
      reasoning: "Expiry is documented; applying a substitute code is not authorized in context.",
      latency: "1.6s",
      tokens: 58,
      cost: "<$0.001",
    },
  ],
  ds_07: [
    {
      id: "r1",
      input: yamlTurns([
        { role: "user", id: "usr_ce01", text: "Who is the CEO of the airline?" },
        { role: "system", id: "ctx_air", type: "context", text: "Northwind Air — About. Founded 1998. Hub: MSP. The press kit lists the board chair and the current COO; it does not name a CEO." },
      ]),
      output: "Dana Okonkwo has been CEO since 2021. She previously ran the cargo division out of MSP.",
      score: 0.12,
      reasoning: "Name does not appear in retrieved context.",
      latency: "6.4s",
      tokens: 166,
      cost: "$0.004",
    },
    {
      id: "r2",
      input: yamlTurns([
        { role: "user", id: "usr_bag1", text: "Summarize the baggage policy." },
        { role: "system", id: "ctx_bag", type: "context", text: "Baggage. One carry-on and one personal item are free. First checked bag $35, second $45. Sporting equipment is $75 and must be declared 24h ahead." },
      ]),
      output: "Carry-on is free; checked bags start at $35, and a second bag is $45. Sporting equipment is $75 if you declare it a day ahead.",
      score: 0.94,
      reasoning: "Both fees are quoted from the policy chunk.",
      latency: "1.3s",
      tokens: 61,
      cost: "<$0.001",
    },
    {
      id: "r3",
      input: yamlTurns([
        { role: "user", id: "usr_st01", text: "Can I bring a stroller?" },
        { role: "system", id: "ctx_fam", type: "context", text: "Family travel addendum. Gate-checked strollers are complimentary. Car seats count as a checked bag unless used in-cabin." },
      ]),
      output: "Gate-checked strollers are complimentary. A car seat is free only if you use it in the cabin; otherwise it counts as a checked bag.",
      score: 0.9,
      reasoning: "Supported by the family-travel addendum.",
      latency: "0.7s",
      tokens: 52,
      cost: "<$0.001",
    },
  ],
  ds_13: [
    {
      id: "r1",
      input: yamlTurns([
        { role: "user", id: "usr_cit1", text: "Cite the source for the latency claim." },
        { role: "system", id: "doc_q2", type: "context", text: "Q2 Reliability Report, p.12: p95 read latency fell from 240ms to 180ms after the cache cutover. Authors: Singh, Patel." },
      ]),
      output: "See the Q2 Reliability Report, p.12 — p95 read latency dropped from 240ms to 180ms after the cache cutover (Singh, Patel).",
      score: 0.87,
      reasoning: "Citation matches an attached document title and page.",
      latency: "1.8s",
      tokens: 73,
      cost: "$0.002",
    },
    {
      id: "r2",
      input: yamlTurns([
        { role: "user", id: "usr_pap1", text: "What did the paper conclude?" },
        { role: "system", id: "doc_gd", type: "context", text: "Groundedness study (internal). The authors found a lift in groundedness after adding citation enforcement. No numeric lift is reported in the abstract included here." },
      ]),
      output: "The authors found a 12% lift in groundedness after citation enforcement was added.",
      score: 0.55,
      reasoning: "Lift is in context; 12% is not.",
      latency: "2.0s",
      tokens: 41,
      cost: "<$0.001",
    },
  ],
};

function scoreClass(score: number) {
  if (score >= 0.85) return "text-emerald-400";
  if (score >= 0.7) return "text-yellow-400";
  return "text-red-400";
}

function parseSeconds(latency: string) {
  const n = parseFloat(latency);
  return Number.isFinite(n) ? n : 0;
}

function parseCost(cost: string) {
  if (cost.startsWith("<")) return 0.0005;
  const n = parseFloat(cost.replace("$", ""));
  return Number.isFinite(n) ? n : 0;
}

function formatCost(n: number) {
  if (n < 0.001) return "<$0.001";
  return `$${n.toFixed(3)}`;
}

function runStats(rows: DemoRow[]) {
  const seconds = rows.map((r) => parseSeconds(r.latency));
  const tokens = rows.map((r) => r.tokens);
  const costs = rows.map((r) => parseCost(r.cost));

  const duration = seconds.reduce((s, n) => s + n, 0);
  const llmDuration = duration * 0.58;
  const totalTokens = tokens.reduce((s, n) => s + n, 0);
  const promptTokens = Math.round(totalTokens * 0.62);
  const completionTokens = totalTokens - promptTokens;
  const cacheTokens = Math.round(promptTokens * 0.28);
  const cost = costs.reduce((s, n) => s + n, 0);
  const structure = (rows.filter((r) => r.score >= 0.7).length / rows.length) * 100;
  const toolCall = (rows.filter((r) => r.score >= 0.85).length / rows.length) * 100;

  return [
    { id: "structure", label: "% structure check", value: `${structure.toFixed(0)}%`, suffix: "avg" },
    { id: "tool", label: "% tool call check", value: `${toolCall.toFixed(0)}%`, suffix: "avg" },
    { id: "duration", label: "Duration", value: duration.toFixed(1), suffix: "sec sum" },
    { id: "llm", label: "LLM Duration", value: llmDuration.toFixed(1), suffix: "sec sum" },
    { id: "prompt", label: "Prompt Tokens", value: promptTokens.toLocaleString() },
    { id: "completion", label: "Completion Tokens", value: completionTokens.toLocaleString() },
    { id: "cache", label: "Prompt cache tokens", value: cacheTokens.toLocaleString() },
    { id: "total", label: "Total tokens", value: totalTokens.toLocaleString() },
    { id: "cost", label: "Estimated cost", value: formatCost(cost) },
  ];
}

function asYamlPair(input: string, output: string) {
  return yamlTurns([
    { role: "user", id: "usr_raw", text: input },
    ...(output ? [{ role: "assistant", id: "asst_raw", text: output }] : []),
  ]);
}

function YamlLine({ line }: { line: string }) {
  const idx = line.indexOf(": ");
  if (idx === -1) {
    return <span className="text-muted-foreground">{line || " "}</span>;
  }
  return (
    <>
      <span className="text-muted-foreground">{line.slice(0, idx + 1)}</span>
      <span className="text-foreground/80">{line.slice(idx + 1)}</span>
    </>
  );
}

function YamlBlock({ text, maxLines }: { text: string; maxLines?: number }) {
  const all = text.split("\n");
  const clipped = maxLines ? all.slice(0, maxLines) : all;
  const truncated = maxLines != null && all.length > maxLines;
  const lines = truncated ? [...clipped, "…"] : clipped;
  const gutter = String(Math.max(lines.length, 1)).length;

  return (
    <div className="flex min-w-0">
      <div
        aria-hidden
        className="shrink-0 select-none text-right font-mono text-[11px] leading-5 text-muted-foreground/35"
        style={{ width: `${gutter + 2}ch` }}
      >
        {lines.map((_, i) => (
          <div key={i} className="pr-2">
            {truncated && i === lines.length - 1 ? "" : i + 1}
          </div>
        ))}
      </div>
      <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-5">
        {lines.map((line, i) => (
          <div key={i}>
            <YamlLine line={line} />
          </div>
        ))}
      </pre>
    </div>
  );
}

function MetaChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      {label}
    </span>
  );
}

function ResultRow({
  row,
  metric,
  open,
  onToggle,
}: {
  row: DemoRow;
  metric: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full border-t border-white/[0.06] py-3 text-left transition-colors hover:bg-white/[0.015]"
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <CaretDown
          size={10}
          weight="bold"
          className={`shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
        />
        <ArrowDownRight size={10} />
        <span>Input</span>
      </div>
      <div className="pl-[18px]">
        <YamlBlock text={row.input} maxLines={open ? undefined : 6} />
      </div>

      <div className="mb-1.5 mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="w-[10px] shrink-0" />
        <ArrowUpRight size={10} />
        <span>Output</span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1">
          <MetaChip icon={<CalendarBlank size={11} />} label="just now" />
          <MetaChip icon={<Clock size={11} />} label={row.latency} />
          <MetaChip icon={<Stack size={11} />} label={String(row.tokens)} />
          <MetaChip icon={<CurrencyDollar size={11} />} label={row.cost} />
        </div>
      </div>
      <p className={`pl-[18px] text-[13px] font-[400] leading-relaxed text-foreground/85 ${open ? "whitespace-pre-wrap" : "line-clamp-2"}`}>
        {row.output}
      </p>
      <div className="mt-2.5 flex items-baseline gap-1.5 pl-[18px] text-[11px]">
        <span className="text-muted-foreground">% {metric}</span>
        <span className={`font-mono font-medium ${scoreClass(row.score)}`}>{row.score.toFixed(2)}</span>
      </div>
      {open && (
        <p className="mt-2 pl-[18px] text-[11px] leading-relaxed text-foreground/65">{row.reasoning}</p>
      )}
    </button>
  );
}

function EvaluatorTestBench({
  evaluatorName,
  runRequest = 0,
  onPhaseChange,
}: {
  evaluatorName: string;
  runRequest?: number;
  onPhaseChange?: (phase: "idle" | "running" | "done") => void;
}) {
  const [source, setSource] = useState<Source>("dataset");
  const [datasetId, setDatasetId] = useState(DEMO_DATASETS[0].id);
  const [rawInput, setRawInput] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [traceId, setTraceId] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const clearRun = () => {
    setPhase("idle");
    setRows([]);
    setOpenId(null);
  };

  useEffect(() => {
    clearRun();
  }, [source, datasetId, evaluatorName]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const canRun =
    source === "dataset" ||
    (source === "raw" && rawInput.trim().length > 0) ||
    (source === "trace" && traceId.trim().length > 0);

  const run = () => {
    if (!canRun || phase === "running") return;
    setPhase("running");
    setOpenId(null);
    window.setTimeout(() => {
      if (source === "dataset") {
        setRows(DEMO_RESULTS[datasetId] ?? DEMO_RESULTS.ds_02);
      } else if (source === "raw") {
        setRows([
          {
            id: "raw_1",
            input: asYamlPair(rawInput, ""),
            output: rawOutput || "(no output provided)",
            score: 0.74,
            reasoning: "Draft judge scored this pair as mostly grounded, with one unsupported clause.",
            latency: "1.2s",
            tokens: 64,
            cost: "<$0.001",
          },
        ]);
      } else {
        setRows([
          {
            id: "tr_1",
            input: asYamlPair(`Trace ${traceId.trim()} · last user turn: When will my refund land?`, ""),
            output: "Refunds post within 5–7 business days after approval.",
            score: 0.81,
            reasoning: "Pulled the last assistant turn and scored it against retrieved policy spans.",
            latency: "0.9s",
            tokens: 38,
            cost: "<$0.001",
          },
        ]);
      }
      setPhase("done");
    }, 650);
  };

  useEffect(() => {
    if (runRequest < 1) return;
    run();
  }, [runRequest]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        title="Demo run"
        trailing={
          <button
            type="button"
            onClick={run}
            disabled={!canRun || phase === "running"}
            className="inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Play size={11} weight="fill" />
            {phase === "running" ? "Running…" : "Run"}
          </button>
        }
      />

      <div className="flex shrink-0 flex-col gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-muted-foreground">Input type</span>
          <div className="flex h-7 overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.015]">
            {([
              ["dataset", "Dataset"],
              ["raw", "Raw input"],
              ["trace", "Trace ID"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSource(id)}
                className={`flex flex-1 items-center justify-center px-2 text-[11px] font-medium transition-colors ${
                  source === id ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {source === "dataset" && (
          <div className="relative min-w-0">
            <select
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              className="h-7 w-full appearance-none rounded-lg border border-white/[0.10] bg-white/[0.015] px-2.5 pr-6 text-[11px] text-foreground/80 outline-none"
            >
              {DEMO_DATASETS.map((ds) => (
                <option key={ds.id} value={ds.id} className="bg-[hsl(var(--panel-surface))]">
                  {ds.name}
                </option>
              ))}
            </select>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {source === "raw" && (
          <p className="text-[11px] text-muted-foreground">Score a single input / output pair</p>
        )}
        {source === "trace" && (
          <input
            value={traceId}
            onChange={(e) => setTraceId(e.target.value)}
            placeholder="tr_…"
            className="h-7 w-full rounded-lg border border-white/[0.10] bg-white/[0.015] px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        )}

        {phase === "done" && rows.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {runStats(rows).map((stat) => (
              <EvalMetricCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
              />
            ))}
          </div>
        )}
      </div>

      <div className="dark-scrollbar flex-1 overflow-y-auto px-4 pb-5">
        {source === "raw" && phase === "idle" && (
          <div className="mb-4 flex flex-col gap-2">
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Input"
              rows={3}
              className="dark-scrollbar resize-none rounded-lg border border-white/[0.10] bg-white/[0.015] px-3 py-2 font-mono text-[11px] leading-5 text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <textarea
              value={rawOutput}
              onChange={(e) => setRawOutput(e.target.value)}
              placeholder="Output"
              rows={3}
              className="dark-scrollbar resize-none rounded-lg border border-white/[0.10] bg-white/[0.015] px-3 py-2 text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        )}

        {phase === "idle" && source !== "raw" && (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="max-w-[220px] text-[12px] leading-relaxed text-muted-foreground">
              {source === "dataset"
                ? "Pick a dataset and run a demo evaluation against this draft."
                : "Enter a trace ID and run to score its last assistant turn."}
            </p>
          </div>
        )}

        {phase === "idle" && source === "raw" && (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Add an input (and optional output), then run the draft judge.
          </p>
        )}

        {phase === "running" && (
          <div className="flex h-full items-center justify-center">
            <div className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
              Scoring with this draft…
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col">
            {rows.map((row) => (
              <ResultRow
                key={row.id}
                row={row}
                metric={evaluatorName}
                open={openId === row.id}
                onToggle={() => setOpenId(openId === row.id ? null : row.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { EvaluatorTestBench };
