"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SideNav, type TabId, type MinimizedAgent } from "./SideNav";
import { AgentChat, type AgentMessage } from "./AgentChat";
import { AccountPopover } from "./AccountPopover";
import { useTargeting } from "../../lib/targeting-context";

interface AppShellProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-[6px]">
      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  );
}

function useNavHistory(onTabChange: (tab: TabId) => void) {
  const history = useRef<TabId[]>(["Traces"]);
  const index = useRef(0);

  const navigate = useCallback((tab: TabId) => {
    const next = index.current + 1;
    history.current = [...history.current.slice(0, next), tab];
    index.current = next;
    onTabChange(tab);
  }, [onTabChange]);

  const canGoBack = index.current > 0;
  const canGoForward = index.current < history.current.length - 1;

  const goBack = useCallback(() => {
    if (index.current > 0) {
      index.current -= 1;
      onTabChange(history.current[index.current]);
    }
  }, [onTabChange]);

  const goForward = useCallback(() => {
    if (index.current < history.current.length - 1) {
      index.current += 1;
      onTabChange(history.current[index.current]);
    }
  }, [onTabChange]);

  return { navigate, goBack, goForward, canGoBack, canGoForward };
}

const ease = [0.32, 0.72, 0, 1] as const;

let agentIdCounter = 0;

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentKey, setAgentKey] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [minimizedAgents, setMinimizedAgents] = useState<MinimizedAgent[]>([]);
  const { navigate, goBack, goForward, canGoBack, canGoForward } = useNavHistory(onTabChange);
  const { clearTarget } = useTargeting();
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (projectMenuOpen && projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setProjectMenuOpen(false);
      }
      if (accountOpen && accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [projectMenuOpen, accountOpen]);

  const handleNewAgent = useCallback(() => {
    if (agentOpen) return;
    clearTarget();
    setAgentKey((k) => k + 1);
    setAgentOpen(true);
  }, [agentOpen, clearTarget]);

  const handleMinimize = useCallback((name: string, messages: AgentMessage[]) => {
    if (messages.length > 0) {
      const id = `agent-${++agentIdCounter}`;
      setMinimizedAgents((prev) => [...prev, { id, name }]);
    }
    setAgentOpen(false);
  }, []);

  const handleRestoreAgent = useCallback((_id: string) => {
    setAgentOpen(true);
  }, []);

  const handleDeleteAgent = useCallback((id: string) => {
    setMinimizedAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden text-foreground">
      <div className="flex shrink-0 items-center justify-between px-[14px] py-2">
        <div className="flex items-center gap-2.5">
          <TrafficLights />

          <button
            onClick={() => { setNavOpen((v) => !v); setProjectMenuOpen(false); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              {navOpen ? (
                <>
                  <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <line x1="5.5" y1="2" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.2" />
                </>
              ) : (
                <>
                  <rect x="1" y="2" width="14" height="12" rx="2" stroke="white" strokeWidth="1.2" fill="none" />
                  <line x1="5.5" y1="2" x2="5.5" y2="14" stroke="white" strokeWidth="1.2" />
                  <rect x="1" y="2" width="4.5" height="12" rx="2" fill="white" />
                </>
              )}
            </svg>
          </button>

          <div className="flex items-center gap-0">
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                canGoBack ? "text-foreground hover:bg-white/[0.06]" : "text-white/[0.15]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                <path d="M228 128a12 12 0 0 1-12 12H69l51.52 51.51a12 12 0 0 1-17 17l-72-72a12 12 0 0 1 0-17l72-72a12 12 0 0 1 17 17L69 116h147a12 12 0 0 1 12 12" />
              </svg>
            </button>
            <button
              onClick={goForward}
              disabled={!canGoForward}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                canGoForward ? "text-foreground hover:bg-white/[0.06]" : "text-white/[0.15]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                <path d="M28 128a12 12 0 0 1 12-12h147l-51.52-51.51a12 12 0 0 1 17-17l72 72a12 12 0 0 1 0 17l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1-12-12" />
              </svg>
            </button>
          </div>

          {!navOpen && (
            <div ref={projectMenuRef} className="relative">
              <button
                onClick={() => setProjectMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-medium text-foreground transition-colors hover:bg-white/[0.06]"
              >
                <span>{activeTab}</span>
                <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                  <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {projectMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease }}
                    className="absolute left-0 top-9 z-50 w-[180px] overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(var(--panel-surface))] shadow-2xl"
                  >
                    <div className="px-2 py-2">
                      {(["Home", "Traces", "Evaluators", "Datasets", "Prompts", "Experiments"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => { navigate(tab); setProjectMenuOpen(false); }}
                          className={`flex w-full items-center rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
                            activeTab === tab ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div ref={accountMenuRef} className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className={`ml-0.5 block rounded-full transition-all ${
                accountOpen ? "ring-2 ring-white" : "ring-0"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0 rounded-full">
                <defs>
                  <linearGradient id="av-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2d2b3a" />
                    <stop offset="100%" stopColor="#3b3654" />
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="12" fill="url(#av-bg)" />
                <path d="M4 17 Q8 6 12 13 Q16 20 20 8" stroke="#7c3aed" strokeWidth="1.4" fill="none" opacity="0.9" strokeLinecap="round" />
                <path d="M6 19 Q10 10 14 15 Q18 20 22 6" stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
                <path d="M2 15 Q7 8 11 11 Q15 14 19 5" stroke="#06b6d4" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round" />
              </svg>
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15, ease }}
                  className="absolute right-0 top-9 z-50"
                >
                  <AccountPopover onClose={() => setAccountOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
        <AnimatePresence initial={false}>
          {navOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 164, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="relative flex shrink-0 flex-col gap-2 overflow-visible"
            >
              <div className="flex-1">
                <SideNav
                  active={activeTab}
                  onChange={navigate}
                  onAgentClick={() => agentOpen ? setAgentOpen(false) : handleNewAgent()}
                  agentActive={agentOpen}
                  minimizedAgents={minimizedAgents}
                  onRestoreAgent={handleRestoreAgent}
                  onDeleteAgent={handleDeleteAgent}
                />
              </div>

              <AnimatePresence>
                {agentOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2, ease }}
                    className="absolute bottom-0 left-0 z-50 w-[340px] shadow-2xl"
                  >
                    <AgentChat
                      key={agentKey}
                      onClose={() => setAgentOpen(false)}
                      onMinimize={handleMinimize}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
