"use client";

import type { Message } from "../../lib/mock-data";
import { usePanels } from "../../lib/panel-context";

function SpanTag({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {type}
    </span>
  );
}

function formatDuration(latency: string): string {
  const ms = parseInt(latency, 10);
  if (isNaN(ms)) return latency;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function ChatMessage({ message, prevRole, nextRole }: { message: Message; prevRole?: string; nextRole?: string }) {
  const { openRun } = usePanels();
  const isClickable = !!message.runId;

  const handleClick = () => {
    if (message.runId) openRun(message.runId);
  };

  if (message.role === "human") {
    const isFirstFromUser = prevRole !== "human";
    return (
      <div className={`my-3 ml-12 ${isFirstFromUser ? "rounded-lg rounded-tr-none" : "rounded-lg"} bg-blue-500/[0.08] px-3 py-2.5`}>
        <p className="text-[13px] font-[400] leading-relaxed text-foreground/85">{message.content}</p>
      </div>
    );
  }

  if (message.role === "tool_call") {
    const isStacked = prevRole === "tool_call" || prevRole === "tool_response";
    const isFirstAgent = !isStacked && prevRole !== "assistant";
    return (
      <div
        onClick={handleClick}
        className={`${isStacked ? "mt-1" : "mt-3"} mb-0 mr-12 flex items-center gap-2 ${isFirstAgent ? "rounded-lg rounded-tl-none" : "rounded-lg"} border border-white/[0.06] bg-white/[0.03] px-3 py-2 ${
          isClickable ? "cursor-pointer transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]" : ""
        }`}
      >
        <span className="min-w-0 truncate font-mono text-[11px] text-foreground">{message.toolName || "tool"}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <SpanTag type={message.spanType || "tool"} />
          {message.latency && (
            <span className="font-mono text-[11px] text-muted-foreground">{formatDuration(message.latency)}</span>
          )}
        </div>
      </div>
    );
  }

  if (message.role === "tool_response") {
    return null;
  }

  const followsTool = prevRole === "tool_call" || prevRole === "tool_response";
  const isFirstAgent = prevRole === "human" || prevRole === undefined;
  return (
    <div
      onClick={handleClick}
      className={`${followsTool ? "mt-1" : "mt-3"} mb-3 mr-12 ${isFirstAgent ? "rounded-lg rounded-tl-none" : "rounded-lg"} border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 ${isClickable ? "cursor-pointer transition-colors hover:border-white/[0.10] hover:bg-white/[0.05]" : ""}`}
    >
      <p className="whitespace-pre-wrap text-[13px] font-[400] leading-relaxed text-foreground/85">{message.content}</p>
      {message.latency && (
        <div className="mt-1.5 flex justify-end">
          <span className="font-mono text-[11px] text-muted-foreground">{formatDuration(message.latency)}</span>
        </div>
      )}
    </div>
  );
}
