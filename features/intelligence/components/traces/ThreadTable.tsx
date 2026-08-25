"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";

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

  return (
    <div className="flex-1 overflow-auto px-4">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
            <th className="py-2 font-medium">Time</th>
            <th className="py-2 font-medium">User</th>
            <th className="py-2 font-medium">Turns</th>
            <th className="py-2 font-medium">Duration</th>
            <th className="py-2 font-medium">Score</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockThreads.map((thread, i) => {
            const isActive = state.threadId === thread.id;
            const prevActive = i > 0 && state.threadId === mockThreads[i - 1].id;
            const nextActive = i < mockThreads.length - 1 && state.threadId === mockThreads[i + 1].id;
            const hideTopBorder = isActive || prevActive;
            const hideBottomBorder = isActive || nextActive;

            return (
              <tr
                key={thread.id}
                onClick={() => openThread(thread.id)}
                className={`cursor-pointer border-t transition-colors hover:bg-white/[0.03] ${
                  isActive ? "bg-white/[0.05]" : ""
                } ${hideTopBorder ? "border-transparent" : "border-white/[0.04]"}`}
                style={hideBottomBorder ? undefined : undefined}
              >
                <td className={`py-2 text-muted-foreground ${isActive ? "first:rounded-l-lg" : ""}`}>{thread.startedAt}</td>
                <td className="py-2 font-medium text-foreground">{thread.user}</td>
                <td className="py-2 text-muted-foreground">{thread.turns}</td>
                <td className="py-2 text-muted-foreground">{thread.duration}</td>
                <td className="py-2"><ScoreBadge score={thread.score} /></td>
                <td className={`py-2 ${isActive ? "last:rounded-r-lg" : ""}`}><StatusPill status={thread.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
