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
      <div className="flex gap-3 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-400">
          U
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm text-foreground">{message.content}</p>
          <span className="mt-1 block text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  if (message.role === "tool_call") {
    return (
      <div
        onClick={handleClick}
        className={`mx-8 flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-3 py-2 ${
          isClickable ? "cursor-pointer transition-colors hover:bg-muted/60" : ""
        }`}
      >
        <span className="text-xs text-yellow-500">⚡</span>
        <code className="flex-1 text-xs text-muted-foreground">{message.content}</code>
        {message.latency && (
          <span className="text-xs text-muted-foreground">{message.latency}</span>
        )}
      </div>
    );
  }

  if (message.role === "tool_response") {
    return (
      <div className="mx-8 rounded-md bg-muted/20 px-3 py-2">
        <code className="text-xs text-muted-foreground">{message.content}</code>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`flex gap-3 py-3 ${isClickable ? "cursor-pointer rounded-md transition-colors hover:bg-muted/30" : ""}`}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
        AI
      </div>
      <div className="flex-1 pt-0.5">
        <p className="whitespace-pre-wrap text-sm text-foreground">{message.content}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{message.timestamp}</span>
          {message.model && <span>{message.model}</span>}
          {message.tokens && <span>{message.tokens.input + message.tokens.output} tokens</span>}
          {message.latency && <span>{message.latency}</span>}
        </div>
      </div>
    </div>
  );
}
