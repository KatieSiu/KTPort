"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";
import { ChatMessage } from "./ChatMessage";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-red-400/10 text-red-400 border-red-400/20";
  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-[13px] font-semibold ${color}`}>
      {score.toFixed(2)}
    </span>
  );
}

export function ThreadDetailPanel() {
  const { state, closeThread } = usePanels();
  const thread = mockThreads.find((t) => t.id === state.threadId);
  if (!thread) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <ScoreBadge score={thread.score} />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-foreground">{thread.user}</span>
            <span className="text-[11px] text-muted-foreground">{thread.startedAt}</span>
          </div>
        </div>
        <button
          onClick={closeThread}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          &#10005;
        </button>
      </div>

      <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-0.5 border-b border-white/[0.06] px-4 py-2 text-[11px] text-muted-foreground">
        <span>{thread.model}</span>
        <span>&middot;</span>
        <span>{thread.turns} turns</span>
        <span>&middot;</span>
        <span>{thread.duration}</span>
        <span>&middot;</span>
        <span>{thread.totalTokens.toLocaleString()} tokens</span>
        <span>&middot;</span>
        <span>{thread.totalCost}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-1">
        <div className="divide-y divide-white/[0.04]">
          {thread.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    </div>
  );
}
