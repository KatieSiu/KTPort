"use client";

import type { Message } from "../../lib/mock-data";
import { usePanels } from "../../lib/panel-context";

export function ChatMessage({ message }: { message: Message }) {
  const { openRun } = usePanels();
  const isClickable = !!message.runId;

  const handleClick = () => {
    if (message.runId) openRun(message.runId);
  };

  if (message.role === "human") {
    return (
      <div className="px-1 py-1">
        <p className="text-[13px] leading-relaxed text-foreground">{message.content}</p>
      </div>
    );
  }

  if (message.role === "tool_call") {
    return (
      <div
        onClick={handleClick}
        className={`my-1.5 flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 ${
          isClickable ? "cursor-pointer transition-colors hover:bg-white/[0.03]" : ""
        }`}
      >
        <span className="font-mono text-[11px] text-foreground">{message.toolName || "tool"}</span>
        {message.latency && (
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">{message.latency}</span>
        )}
      </div>
    );
  }

  if (message.role === "tool_response") {
    return null;
  }

  return (
    <div
      onClick={handleClick}
      className={`my-1.5 flex items-start justify-between gap-2.5 rounded-lg border border-white/[0.06] px-3 py-2.5 ${isClickable ? "cursor-pointer transition-colors hover:bg-white/[0.03]" : ""}`}
    >
      <div className="flex-1">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">{message.content}</p>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">{message.timestamp}</span>
      </div>
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[9px] font-medium text-emerald-400">
        AI
      </div>
    </div>
  );
}
