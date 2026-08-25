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
      <div className="flex gap-2.5 py-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-400">
          U
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-[13px] leading-relaxed text-foreground">{message.content}</p>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  if (message.role === "tool_call") {
    return (
      <div
        onClick={handleClick}
        className={`mx-7 flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 ${
          isClickable ? "cursor-pointer transition-colors hover:bg-white/[0.06]" : ""
        }`}
      >
        <span className="text-[10px] text-yellow-500">&#9889;</span>
        <code className="flex-1 text-[11px] text-muted-foreground">{message.content}</code>
        {message.latency && (
          <span className="text-[11px] text-muted-foreground">{message.latency}</span>
        )}
      </div>
    );
  }

  if (message.role === "tool_response") {
    return (
      <div className="mx-7 rounded-md bg-white/[0.02] px-2.5 py-1.5">
        <code className="text-[11px] text-muted-foreground">{message.content}</code>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`flex gap-2.5 py-2.5 ${isClickable ? "cursor-pointer rounded-md transition-colors hover:bg-white/[0.03]" : ""}`}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400">
        AI
      </div>
      <div className="flex-1 pt-0.5">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">{message.content}</p>
        <div className="mt-0.5 flex items-center gap-2.5 text-[11px] text-muted-foreground">
          <span>{message.timestamp}</span>
          {message.model && <span>{message.model}</span>}
          {message.tokens && <span>{message.tokens.input + message.tokens.output} tok</span>}
          {message.latency && <span>{message.latency}</span>}
        </div>
      </div>
    </div>
  );
}
