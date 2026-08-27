"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";

function shortTime(t: string): string {
  return t
    .replace(/ min ago/, "m ago")
    .replace(/ ago$/, "");
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-400"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-red-400/10 text-red-400";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${color}`}>
      {score.toFixed(2)}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-400",
    failed: "bg-red-400/10 text-red-400",
    in_progress: "bg-blue-400/10 text-blue-400",
  };
  const label: Record<string, string> = {
    completed: "Completed",
    failed: "Failed",
    in_progress: "Running",
  };
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium ${styles[status] || ""}`}>
      {label[status] || status}
    </span>
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
      <div ref={scrollRef} data-scroll-container className="h-full overflow-auto px-4">
        <table className="w-full min-w-[500px] text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Time</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">User</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Turns</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Duration</th>
              <th className="whitespace-nowrap py-2 pr-3 font-medium">Score</th>
              <th className="whitespace-nowrap py-2 font-medium">Status</th>
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
                  data-target-label={`${thread.user} - ${shortTime(thread.startedAt)} - score ${thread.score.toFixed(2)}`}
                className={`cursor-pointer border-t transition-colors hover:bg-white/[0.05] ${
                  isActive ? "bg-white/[0.05]" : ""
                } ${hideTopBorder ? "border-transparent" : "border-white/[0.04]"}`}
                >
                <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground first:rounded-l-lg">{shortTime(thread.startedAt)}</td>
                <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">{thread.user}</td>
                <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{thread.turns}</td>
                <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">{thread.duration}</td>
                <td className="whitespace-nowrap py-2 pr-3"><ScoreBadge score={thread.score} /></td>
                <td className="whitespace-nowrap py-2 last:rounded-r-lg"><StatusPill status={thread.status} /></td>
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
