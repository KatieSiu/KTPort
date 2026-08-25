"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads, type Message } from "../../lib/mock-data";

function findMessage(threadId: string | null, runId: string | null): Message | null {
  if (!threadId || !runId) return null;
  const thread = mockThreads.find((t) => t.id === threadId);
  if (!thread) return null;
  return thread.messages.find((m) => m.runId === runId) || null;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

export function RunDetailPanel() {
  const { state, closeRun } = usePanels();
  const message = findMessage(state.threadId, state.runId);
  if (!message) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {message.role === "tool_call" ? "tool" : "llm"}
          </span>
          <span className="text-[13px] font-medium text-foreground">
            {message.toolName || message.model || "Run"}
          </span>
        </div>
        <button
          onClick={closeRun}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          &#10005;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(message.model || message.tokens || message.latency || message.cost) && (
          <div className="border-b border-white/[0.06] px-4 py-3">
            <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Metrics
            </h3>
            <div className="divide-y divide-white/[0.04]">
              {message.model && <DetailRow label="Model" value={message.model} />}
              {message.tokens && (
                <>
                  <DetailRow label="Input tokens" value={message.tokens.input.toLocaleString()} />
                  <DetailRow label="Output tokens" value={message.tokens.output.toLocaleString()} />
                </>
              )}
              {message.latency && <DetailRow label="Latency" value={message.latency} />}
              {message.cost && <DetailRow label="Cost" value={message.cost} />}
            </div>
          </div>
        )}

        <div className="border-b border-white/[0.06] px-4 py-3">
          <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {message.role === "tool_call" ? "Call" : "Input"}
          </h3>
          <pre className="overflow-x-auto rounded-lg bg-white/[0.03] p-2.5 font-mono text-[11px] text-foreground">
            {message.role === "tool_call"
              ? message.content
              : "(prompt messages passed to the model)"}
          </pre>
        </div>

        <div className="px-4 py-3">
          <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Output
          </h3>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.03] p-2.5 font-mono text-[11px] text-foreground">
            {message.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
