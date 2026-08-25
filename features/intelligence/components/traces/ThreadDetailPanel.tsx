"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads } from "../../lib/mock-data";
import { ChatMessage } from "./ChatMessage";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : "bg-red-400/10 text-red-400 border-red-400/20";
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-sm font-semibold ${color}`}>
      {score.toFixed(2)}
    </span>
  );
}

export function ThreadDetailPanel() {
  const { state, closeThread } = usePanels();
  const thread = mockThreads.find((t) => t.id === state.threadId);
  if (!thread) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <ScoreBadge score={thread.score} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{thread.user}</span>
            <span className="text-xs text-muted-foreground">{thread.startedAt}</span>
          </div>
        </div>
        <button
          onClick={closeThread}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>Model: <span className="text-foreground">{thread.model}</span></span>
        <span>Turns: <span className="text-foreground">{thread.turns}</span></span>
        <span>Duration: <span className="text-foreground">{thread.duration}</span></span>
        <span>Tokens: <span className="text-foreground">{thread.totalTokens.toLocaleString()}</span></span>
        <span>Cost: <span className="text-foreground">{thread.totalCost}</span></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="divide-y divide-border/30">
          {thread.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    </div>
  );
}
