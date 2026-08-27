"use client";

import { useState, useEffect } from "react";
import { CursorClick, Cursor, Minus, Paperclip, ArrowUp } from "@phosphor-icons/react";
import { useTargeting } from "../../lib/targeting-context";

interface AgentChatProps {
  onClose: () => void;
  onMinimize: (name: string, messages: AgentMessage[]) => void;
}

export interface AgentMessage {
  role: "user" | "agent";
  content: string;
}

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

const agentResponses: Record<string, string> = {
  thread: "This thread scored low because the promo validation service timed out twice, forcing the agent to escalate without resolving the customer's request. The root cause is a 5.2s latency spike on the `validate_promo` tool call. I'd recommend adding a fallback cache for recently-validated promo codes and setting a 2s timeout with graceful degradation.",
  metric: "This metric is trending positively over the last 7 days. The improvement correlates with the prompt v12 rollout on Aug 22, which added stricter tool-selection guardrails. The biggest gains came from reducing hallucinated tracking numbers (down 62%) and faster average tool response times.",
  element: "I can see this element in context. What would you like to know about it?",
};

export function AgentChat({ onClose, onMinimize }: AgentChatProps) {
  const { state, startTargeting } = useTargeting();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [phase, setPhase] = useState<"idle" | "typing-question" | "waiting" | "typing-answer" | "done">("idle");

  const question = state.target
    ? `Why did this ${state.target.type} get a low score?`
    : "Why did thread #482 fail?";

  const answer = state.target
    ? agentResponses[state.target.type] || agentResponses.element
    : agentResponses.thread;

  const questionTypewriter = useTypewriter(
    phase === "typing-question" ? question : "",
    25
  );

  useEffect(() => {
    if (state.target && phase === "idle") {
      setPhase("typing-question");
    }
  }, [state.target, phase]);

  useEffect(() => {
    if (phase === "typing-question" && questionTypewriter.done) {
      setMessages([{ role: "user", content: question }]);
      setPhase("waiting");
      const timer = setTimeout(() => setPhase("typing-answer"), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, questionTypewriter.done, question]);

  const answerTypewriter = useTypewriter(
    phase === "typing-answer" ? answer : "",
    12
  );

  useEffect(() => {
    if (phase === "typing-answer" && answerTypewriter.done) {
      setMessages((prev) => [...prev.filter((m) => m.role === "user"), { role: "agent", content: answer }]);
      setPhase("done");
    }
  }, [phase, answerTypewriter.done, answer]);

  const handleMinimize = () => {
    const name = state.target
      ? `${state.target.type} analysis`
      : "Thread #482";
    onMinimize(name, messages);
  };

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(var(--panel-surface))]">
      <div className="flex shrink-0 items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <CursorClick size={14} weight="bold" className="text-foreground" />
          <span className="text-[13px] font-medium text-foreground">Agent</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleMinimize}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Minus size={14} weight="bold" />
          </button>
          <button
            onClick={startTargeting}
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
              state.active
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            }`}
          >
            <Cursor size={14} weight="bold" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-2">
        {messages.length === 0 && phase === "idle" && !state.target && (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="max-w-[240px] text-[13px] leading-relaxed text-muted-foreground">
              Target content and ask questions about it, get recommendations, or take action.
            </p>
          </div>
        )}

        {state.target && phase === "typing-question" && (
          <div className="flex flex-1 items-end pb-2">
            <div className="ml-auto max-w-[85%] rounded-lg bg-white/[0.06] px-3 py-2">
              <div className="mb-1 rounded border border-blue-400/20 bg-blue-400/10 px-2 py-1">
                <span className="text-[10px] font-medium text-blue-400">{state.target.type}</span>
                <span className="ml-1.5 text-[11px] text-foreground/70">{state.target.label}</span>
              </div>
              <p className="text-[13px] text-foreground">{questionTypewriter.displayed}<span className="animate-pulse">|</span></p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === "user" ? "flex justify-end" : ""}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
              msg.role === "user" ? "bg-white/[0.06]" : "bg-white/[0.03]"
            }`}>
              {msg.role === "user" && state.target && (
                <div className="mb-1 rounded border border-blue-400/20 bg-blue-400/10 px-2 py-1">
                  <span className="text-[10px] font-medium text-blue-400">{state.target.type}</span>
                  <span className="ml-1.5 text-[11px] text-foreground/70">{state.target.label}</span>
                </div>
              )}
              <p className="text-[13px] leading-relaxed text-foreground">{msg.content}</p>
            </div>
          </div>
        ))}

        {phase === "waiting" && (
          <div className="mb-2">
            <div className="inline-flex max-w-[85%] items-center gap-1 rounded-lg bg-white/[0.03] px-3 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {phase === "typing-answer" && (
          <div className="mb-2">
            <div className="max-w-[85%] rounded-lg bg-white/[0.03] px-3 py-2">
              <p className="text-[13px] leading-relaxed text-foreground">{answerTypewriter.displayed}<span className="animate-pulse">|</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 pb-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5">
          {phase === "typing-question" ? (
            <span className="flex-1 text-[13px] text-foreground">{questionTypewriter.displayed}<span className="animate-pulse">|</span></span>
          ) : (
            <span className="flex-1 text-[13px] text-white/[0.25]">
              {state.target ? `Ask about this ${state.target.type}...` : "Why did thread #482 fail?"}
            </span>
          )}
          <div className="flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground">
              <Paperclip size={16} weight="bold" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
              <ArrowUp size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      <CursorClick size={14} weight="bold" />
    </button>
  );
}
