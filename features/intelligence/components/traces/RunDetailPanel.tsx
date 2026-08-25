"use client";

import { usePanels } from "../../lib/panel-context";
import { mockThreads, type Message } from "../../lib/mock-data";

function findMessageAndResponse(threadId: string | null, runId: string | null): { message: Message | null; response: Message | null } {
  if (!threadId || !runId) return { message: null, response: null };
  const thread = mockThreads.find((t) => t.id === threadId);
  if (!thread) return { message: null, response: null };
  const idx = thread.messages.findIndex((m) => m.runId === runId);
  if (idx === -1) return { message: null, response: null };
  const message = thread.messages[idx];
  const response = message.role === "tool_call" && thread.messages[idx + 1]?.role === "tool_response"
    ? thread.messages[idx + 1]
    : null;
  return { message, response };
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-2 text-[11px] font-medium text-muted-foreground">{children}</div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-end px-4 pt-2.5">
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          &#10005;
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <span className="text-[13px] text-muted-foreground">Click a step in the conversation to inspect it</span>
      </div>
    </div>
  );
}

export function RunDetailPanel() {
  const { state, closeRun } = usePanels();
  const { message, response } = findMessageAndResponse(state.threadId, state.runId);

  if (!message) return <EmptyState onClose={closeRun} />;

  const isToolCall = message.role === "tool_call";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded border border-white/[0.06] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {isToolCall ? "tool" : "llm"}
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

      <div className="flex-1 overflow-y-auto px-4">
        {(message.model || message.tokens || message.latency || message.cost) && (
          <>
            <div className="divide-y divide-white/[0.04] pb-2">
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
          </>
        )}

        <SectionHeader>{isToolCall ? "Call" : "Input"}</SectionHeader>
        <pre className="my-2 overflow-x-auto rounded-lg bg-white/[0.03] p-2.5 font-mono text-[11px] text-foreground">
          {isToolCall ? message.content : "(prompt messages passed to the model)"}
        </pre>

        <SectionHeader>{isToolCall ? "Response" : "Output"}</SectionHeader>
        <pre className="my-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white/[0.03] p-2.5 font-mono text-[11px] text-foreground">
          {isToolCall && response ? response.content : message.content}
        </pre>
      </div>
    </div>
  );
}
