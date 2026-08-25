"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-500"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-500"
        : "bg-red-400/10 text-red-400";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {score.toFixed(2)}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-500",
    failed: "bg-red-400/10 text-red-400",
    in_progress: "bg-blue-400/10 text-blue-400",
  };
  const label: Record<string, string> = {
    completed: "Completed",
    failed: "Failed",
    in_progress: "Running",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || ""}`}>
      {label[status] || status}
    </span>
  );
}

export function ThreadTable() {
  const { state, openThread } = usePanels();

  return (
    <div className="flex-1 overflow-auto px-5">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2.5 font-medium">Time</th>
            <th className="py-2.5 font-medium">User</th>
            <th className="py-2.5 font-medium">Turns</th>
            <th className="py-2.5 font-medium">Duration</th>
            <th className="py-2.5 font-medium">Score</th>
            <th className="py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockThreads.map((thread) => (
            <tr
              key={thread.id}
              onClick={() => openThread(thread.id)}
              className={`cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/50 ${
                state.threadId === thread.id ? "bg-muted/70" : ""
              }`}
            >
              <td className="py-2.5 text-muted-foreground">{thread.startedAt}</td>
              <td className="py-2.5 font-medium text-foreground">{thread.user}</td>
              <td className="py-2.5 text-muted-foreground">{thread.turns}</td>
              <td className="py-2.5 text-muted-foreground">{thread.duration}</td>
              <td className="py-2.5"><ScoreBadge score={thread.score} /></td>
              <td className="py-2.5"><StatusPill status={thread.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
