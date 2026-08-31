"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, FunnelSimple, List, SquaresFour, Plus, CloudArrowUp, PencilSimple } from "@phosphor-icons/react";
import { PanelHeader } from "../panels/PanelHeader";

interface Dataset {
  id: string;
  name: string;
  type: "Golden" | "Production" | "Synthetic" | "Regression";
  source: string;
  rows: number;
  lastUpdated: string;
  version: string;
  evaluators: number;
  pinned: boolean;
}

const mockDatasets: Dataset[] = [
  { id: "ds_01", name: "support_ticket_golden_v3", type: "Golden", source: "Annotation queue", rows: 1240, lastUpdated: "2h ago", version: "v3.1", evaluators: 6, pinned: true },
  { id: "ds_02", name: "rag_faithfulness_benchmark", type: "Golden", source: "Manual curation", rows: 800, lastUpdated: "1d ago", version: "v2.0", evaluators: 4, pinned: true },
  { id: "ds_03", name: "prod_thumbs_up_aug_2026", type: "Production", source: "Automation rule", rows: 3420, lastUpdated: "12m ago", version: "v1.0", evaluators: 2, pinned: false },
  { id: "ds_04", name: "tool_use_parameter_suite", type: "Golden", source: "Manual curation", rows: 450, lastUpdated: "3d ago", version: "v1.4", evaluators: 3, pinned: true },
  { id: "ds_05", name: "adversarial_injection_probes", type: "Synthetic", source: "LLM generation", rows: 500, lastUpdated: "5d ago", version: "v2.1", evaluators: 2, pinned: false },
  { id: "ds_06", name: "negative_feedback_harvest", type: "Production", source: "Automation rule", rows: 1890, lastUpdated: "4h ago", version: "v1.0", evaluators: 3, pinned: false },
  { id: "ds_07", name: "hallucination_regression_set", type: "Regression", source: "Failure triage", rows: 340, lastUpdated: "2d ago", version: "v4.0", evaluators: 5, pinned: true },
  { id: "ds_08", name: "multilingual_intent_coverage", type: "Golden", source: "Annotation queue", rows: 1200, lastUpdated: "1w ago", version: "v1.2", evaluators: 4, pinned: true },
  { id: "ds_09", name: "edge_case_refusals_q3", type: "Production", source: "Manual selection", rows: 95, lastUpdated: "6d ago", version: "v1.0", evaluators: 2, pinned: false },
  { id: "ds_10", name: "persona_tone_variations", type: "Synthetic", source: "LLM generation", rows: 600, lastUpdated: "3d ago", version: "v3.0", evaluators: 1, pinned: false },
  { id: "ds_11", name: "pii_redaction_test_bank", type: "Golden", source: "Compliance team", rows: 2000, lastUpdated: "1d ago", version: "v3.1", evaluators: 3, pinned: true },
  { id: "ds_12", name: "code_gen_syntax_pairs", type: "Synthetic", source: "AST mutation", rows: 750, lastUpdated: "4d ago", version: "v1.5", evaluators: 2, pinned: false },
  { id: "ds_13", name: "citation_accuracy_corpus", type: "Golden", source: "Research team", rows: 350, lastUpdated: "5d ago", version: "v1.3", evaluators: 3, pinned: true },
  { id: "ds_14", name: "customer_escalation_traces", type: "Production", source: "Automation rule", rows: 540, lastUpdated: "18h ago", version: "v1.0", evaluators: 4, pinned: false },
  { id: "ds_15", name: "conciseness_length_targets", type: "Golden", source: "Manual curation", rows: 400, lastUpdated: "1w ago", version: "v1.0", evaluators: 1, pinned: false },
  { id: "ds_16", name: "booking_flow_regression", type: "Regression", source: "CI failure log", rows: 180, lastUpdated: "2d ago", version: "v2.3", evaluators: 3, pinned: true },
  { id: "ds_17", name: "summarization_quality_pairs", type: "Synthetic", source: "LLM generation", rows: 300, lastUpdated: "6d ago", version: "v1.0", evaluators: 2, pinned: false },
  { id: "ds_18", name: "prod_high_latency_sample", type: "Production", source: "Automation rule", rows: 2100, lastUpdated: "6h ago", version: "v1.0", evaluators: 1, pinned: false },
];

const typeColors: Record<Dataset["type"], string> = {
  Golden: "text-amber-400",
  Production: "text-blue-400",
  Synthetic: "text-violet-400",
  Regression: "text-red-400",
};

const ease = [0.32, 0.72, 0, 1] as const;
const transition = { duration: 0.35, ease };

function FilterBar() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!popoverOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  return (
    <div className="shrink-0 px-4 pt-4 pb-1">
      <div className="mb-3">
        <span className="text-[13px] font-semibold text-foreground">Active Datasets</span>
      </div>
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setPopoverOpen((o) => !o)}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-white/[0.08] px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground"
          >
            <FunnelSimple size={11} />
            Add Filter
          </button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-lg border border-white/[0.06] bg-[hsl(var(--panel-surface))] p-3 shadow-xl"
            >
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Filter datasets by type, row count, version, or last updated date.
              </p>
              <button
                disabled
                className="mt-2.5 w-full rounded-md bg-white/[0.06] py-1.5 text-[11px] font-medium text-muted-foreground opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">{mockDatasets.length} Datasets · 3 deprecated</span>

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
  );
}

function DatasetDetailPanel({ dataset, onClose }: { dataset: Dataset | null; onClose: () => void }) {
  if (!dataset) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader
        onClose={onClose}
        title={dataset.name}
        subtitle={`${dataset.rows.toLocaleString()} rows · ${dataset.version}`}
        trailing={
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <PencilSimple size={13} />
          </button>
        }
      />
      <div className="dark-scrollbar flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-5">
          {/* Overview */}
          <div className="rounded-lg bg-white/[0.02] px-3 py-3">
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className={`font-medium ${typeColors[dataset.type]}`}>{dataset.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="text-foreground/80">{dataset.source}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rows</span><span className="text-foreground/80">{dataset.rows.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Linked evaluators</span><span className="text-foreground/80">{dataset.evaluators}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last updated</span><span className="text-foreground/80">{dataset.lastUpdated}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="text-foreground/80">{dataset.version}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pinned to CI</span><span className="text-foreground/80">{dataset.pinned ? "Yes" : "No"}</span></div>
            </div>
          </div>

          {/* Schema */}
          <div>
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Schema</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 rounded-md bg-white/[0.02] px-3 py-2.5">
                <span className="text-[11px] text-muted-foreground">input</span>
                <span className="font-mono text-[10px] text-foreground/60">{"{ query: string }"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 rounded-md bg-white/[0.02] px-3 py-2.5">
                <span className="text-[11px] text-muted-foreground">expected</span>
                <span className="font-mono text-[10px] text-foreground/60">{"{ answer: string }"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 rounded-md bg-white/[0.02] px-3 py-2.5">
                <span className="text-[11px] text-muted-foreground">metadata</span>
                <span className="font-mono text-[10px] text-foreground/60">{"{ source, difficulty }"}</span>
              </div>
            </div>
          </div>

          {/* Version history */}
          <div className="pb-4">
            <span className="mb-2 block text-[13px] font-semibold text-muted-foreground">Version History</span>
            <div className="rounded-lg bg-white/[0.02] px-3 py-3">
              <div className="flex flex-col gap-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground/80">{dataset.version}</span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">current</span>
                  </div>
                  <span className="text-muted-foreground">{dataset.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-mono">v{(parseFloat(dataset.version.slice(1)) - 0.1).toFixed(1)}</span>
                  <span>2w ago</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-mono">v{(parseFloat(dataset.version.slice(1)) - 0.2).toFixed(1)}</span>
                  <span>1mo ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader onClose={onClose} title="New Dataset" />
      <div className="flex flex-1 flex-col items-center gap-5 px-8 pt-[20%]">
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-dashed border-white/[0.10] px-6 py-12">
          <CloudArrowUp size={32} className="text-muted-foreground/40" />
          <div className="text-center">
            <p className="text-[13px] font-semibold text-foreground">Upload a dataset</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Drag and drop a CSV, JSONL, or Parquet file here,<br />or click below to browse.
            </p>
          </div>
          <button className="rounded-lg bg-white/[0.08] px-4 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-white/[0.12]">
            Browse files
          </button>
        </div>
      </div>
    </div>
  );
}

export function DatasetsContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const hasInteracted = useRef(false);

  if (selectedId || showUpload) hasInteracted.current = true;

  const hasL2 = selectedId !== null || showUpload;
  const selectedDataset = selectedId ? mockDatasets.find((d) => d.id === selectedId) ?? null : null;
  const shouldAnimate = hasInteracted.current;

  const handleSelect = useCallback((id: string) => {
    setShowUpload(false);
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    setShowUpload(false);
  }, []);

  const handleNewDataset = useCallback(() => {
    setSelectedId(null);
    setShowUpload(true);
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
          <FilterBar />
          <div className="relative flex-1 overflow-hidden">
            <div className="dark-scrollbar h-full overflow-auto px-4">
              <table className="w-full min-w-[700px] text-[12px]">
                <thead className="sticky top-0 z-10 bg-[hsl(var(--panel-surface))]">
                  <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
                    <th className="whitespace-nowrap py-2 pl-3 pr-3 font-medium">Name</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Type</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Source</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Rows</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Evaluators</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Updated</th>
                    <th className="whitespace-nowrap py-2 pr-3 font-medium">Version</th>
                    <th className="w-8 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockDatasets.map((d, i) => {
                    const isActive = selectedId === d.id;
                    const prevActive = i > 0 && selectedId === mockDatasets[i - 1].id;
                    const hideTopBorder = isActive || prevActive;
                    return (
                      <tr
                        key={d.id}
                        onClick={() => handleSelect(d.id)}
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
                        <td className="whitespace-nowrap py-2 pl-3 pr-3 font-medium text-foreground">{d.name}</td>
                        <td className="whitespace-nowrap py-2 pr-3">
                          <span className={`text-[11px] font-medium ${typeColors[d.type]}`}>{d.type}</span>
                        </td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{d.source}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{d.rows.toLocaleString()}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{d.evaluators}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{d.lastUpdated}</td>
                        <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{d.version}</td>
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
                  {/* Add new dataset row */}
                  <tr
                    onClick={handleNewDataset}
                    className="cursor-pointer border-t border-white/[0.04] table-row-interactive transition-colors"
                    style={{ borderRadius: 8, ...(showUpload ? { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" } : {}) }}
                  >
                    <td colSpan={8} className="py-2 pl-3 pr-3">
                      <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground/60">
                        <Plus size={12} />
                        Add new dataset
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
            key={showUpload ? "upload-l2" : "detail-l2"}
            initial={{ x: "100%", width: "50%" }}
            animate={{ x: 0, width: "50%" }}
            exit={{ x: "100%" }}
            transition={transition}
            className="h-full shrink-0 overflow-hidden px-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              {showUpload ? (
                <UploadPanel onClose={handleClose} />
              ) : (
                <DatasetDetailPanel dataset={selectedDataset} onClose={handleClose} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
