"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";

const persistedVotes: Record<string, "up" | "down"> = {
  th_03: "down",
  th_07: "down",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-400"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-red-400/10 text-red-400";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color: Record<string, string> = {
    completed: "bg-emerald-400",
    failed: "bg-red-400",
    in_progress: "bg-yellow-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${color[status] || "bg-white/20"}`} />;
}

function truncate(s: string, len: number) {
  return s.length > len ? s.slice(0, len) + "..." : s;
}

function getInput(thread: typeof import("../../lib/mock-data").mockThreads[number]) {
  const first = thread.messages.find((m) => m.role === "human");
  return first ? truncate(first.content, 38) : "--";
}

function getOutput(thread: typeof import("../../lib/mock-data").mockThreads[number]) {
  const last = [...thread.messages].reverse().find((m) => m.role === "assistant");
  return last ? truncate(last.content, 38) : "--";
}

function StatusCell({ threadId, status }: { threadId: string; status: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(persistedVotes[threadId] ?? null);

  return (
    <div className="flex items-center gap-2">
      <StatusDot status={status} />
      <div className="flex items-center gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); setVote(vote === "up" ? null : "up"); }}
          className={vote === "up"
            ? "text-muted-foreground/60"
            : "text-muted-foreground/30 opacity-0 transition-opacity hover:text-muted-foreground/60 [tr:hover_&]:opacity-100"
          }
        >
          <ThumbsUp size={13} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setVote(vote === "down" ? null : "down"); }}
          className={vote === "down"
            ? "text-muted-foreground/60"
            : "text-muted-foreground/30 opacity-0 transition-opacity hover:text-muted-foreground/60 [tr:hover_&]:opacity-100"
          }
        >
          <ThumbsDown size={13} />
        </button>
      </div>
    </div>
  );
}

export function ThreadTable() {
  const { state, openThread } = usePanels();
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflowX, setOverflowX] = useState(false);
  const [overflowY, setOverflowY] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setOverflowX(el.scrollWidth > el.clientWidth + 2);
      setOverflowY(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    e.preventDefault();
    const currentIndex = state.threadId
      ? mockThreads.findIndex((t) => t.id === state.threadId)
      : -1;

    let nextIndex: number;
    if (e.key === "ArrowDown") {
      nextIndex = currentIndex < mockThreads.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : mockThreads.length - 1;
    }

    const nextThread = mockThreads[nextIndex];
    openThread(nextThread.id);

    const row = rowRefs.current.get(nextThread.id);
    if (row) {
      const container = row.closest("[data-scroll-container]");
      if (container) {
        const scrollLeft = container.scrollLeft;
        row.scrollIntoView({ block: "nearest", behavior: "smooth" });
        container.scrollLeft = scrollLeft;
      }
    }
  }, [state.threadId, openThread]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={scrollRef} data-scroll-container className="dark-scrollbar h-full overflow-auto px-4">
        <table className="w-full min-w-[820px] text-[12px]">
          <thead className="sticky top-0 z-10 bg-[hsl(var(--panel-surface))]">
            <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
              <th className="whitespace-nowrap py-2 pl-3 pr-3 font-medium">Name</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Trace ID</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Score</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Input</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Output</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Expected</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Properties</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Environment</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Latency</th>
              <th className="w-24 whitespace-nowrap py-2 pr-3 font-medium">Status</th>
              <th className="w-8 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {mockThreads.map((thread, i) => {
              const isActive = state.threadId === thread.id;
              const prevActive = i > 0 && state.threadId === mockThreads[i - 1].id;
              const hideTopBorder = isActive || prevActive;

              return (
                <tr
                  key={thread.id}
                  ref={(el) => { if (el) rowRefs.current.set(thread.id, el); }}
                  onClick={() => openThread(thread.id)}
                  data-targetable="thread"
                  data-target-label={`${thread.name} - score ${thread.score.toFixed(1)}`}
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
                  <td className="whitespace-nowrap py-2 pl-3 pr-3 font-medium text-foreground">{thread.name}</td>
                  <td className="whitespace-nowrap py-2 pr-3 font-mono text-[11px] text-muted-foreground">{thread.traceId}</td>
                  <td className="whitespace-nowrap py-2 pr-3"><ScoreBadge score={thread.score} /></td>
                  <td className="max-w-[240px] truncate py-2 pr-3 text-muted-foreground">{getInput(thread)}</td>
                  <td className="max-w-[240px] truncate py-2 pr-3 text-muted-foreground">{getOutput(thread)}</td>
                  <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">--</td>
                  <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{thread.properties}</td>
                  <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{thread.environment}</td>
                  <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{thread.duration}</td>
                  <td className="whitespace-nowrap py-2 pr-3"><StatusCell threadId={thread.id} status={thread.status} /></td>
                  <td className="whitespace-nowrap py-2 text-center last:rounded-r-lg">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground [tr:hover_&]:opacity-100"
                    >
                      &middot;&middot;&middot;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {overflowX && <div className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{ background: "linear-gradient(to left, hsl(var(--panel-surface)) 0%, transparent 100%)" }} />}
      {overflowY && <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10" style={{ background: "linear-gradient(to top, hsl(var(--panel-surface)) 0%, transparent 100%)" }} />}
    </div>
  );
}
