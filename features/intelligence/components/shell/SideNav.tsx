"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorClick, X, MagnifyingGlass } from "@phosphor-icons/react";

export type TabId = "Home" | "Traces" | "Evaluators" | "Datasets" | "Prompts" | "Experiments";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export interface MinimizedAgent {
  id: string;
  name: string;
}

const projects = [
  { name: "Secret Project", active: true },
  { name: "Maps Redesign", active: false },
  { name: "Siri Intents v3", active: false },
  { name: "Checkout Flow", active: false },
];

const ease = [0.32, 0.72, 0, 1] as const;

const topItems: NavItem[] = [
  {
    id: "Home", label: "Home",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L1.5 6.5V13h4V9.5h4V13h4V6.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" /></svg>,
  },
  {
    id: "Traces", label: "Traces",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M2 7.5h11M2 11h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  },
  {
    id: "Evaluators", label: "Evaluators",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M3 7.5L6 10.5L12 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: "Datasets", label: "Datasets",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><ellipse cx="7.5" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M2.5 4v3.5c0 1.1 2.24 2 5 2s5-.9 5-2V4" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M2.5 7.5V11c0 1.1 2.24 2 5 2s5-.9 5-2V7.5" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>,
  },
  {
    id: "Prompts", label: "Prompts",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M4 3L11.5 7.5L4 12V3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" /></svg>,
  },
  {
    id: "Experiments", label: "Experiments",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M5.5 1.5h4M6 1.5V6L2.5 12.5h10L9 6V1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>,
  },
];

interface SideNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  onAgentClick: () => void;
  agentActive: boolean;
  minimizedAgents: MinimizedAgent[];
  onRestoreAgent: (id: string) => void;
  onDeleteAgent: (id: string) => void;
}

function NavButton({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
        isActive
          ? "bg-white/[0.06] text-foreground"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      <span className="shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}

function ProjectSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative mb-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-white/[0.04]"
        >
          <span className="truncate">Secret Project</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-muted-foreground">
            <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground">
          <MagnifyingGlass size={12} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease }}
            className="absolute left-0 top-full z-50 mt-1 w-[200px] overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(var(--panel-surface))] shadow-2xl"
          >
            <div className="px-2 py-2">
              {projects.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setOpen(false)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
                    p.active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.06] text-[9px] font-semibold text-foreground">
                    {p.name[0]}
                  </div>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-white/[0.06] px-2 py-2">
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[14px]">+</span>
                <span>New project</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SideNav({ active, onChange, onAgentClick, agentActive, minimizedAgents, onRestoreAgent, onDeleteAgent }: SideNavProps) {
  return (
    <div className="flex h-full w-[164px] shrink-0 flex-col rounded-xl bg-[hsl(var(--panel-surface))] px-2 py-2">
      <ProjectSelector />
      <div className="flex flex-col gap-0.5">
        {topItems.map((item) => (
          <NavButton key={item.id} item={item} isActive={active === item.id} onClick={() => onChange(item.id)} />
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-0.5 pt-3">
        {minimizedAgents.map((agent) => (
          <div key={agent.id} className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground">
            <span className="shrink-0"><CursorClick size={12} weight="bold" /></span>
            <button onClick={() => onRestoreAgent(agent.id)} className="flex-1 truncate text-left">{agent.name}</button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteAgent(agent.id); }}
              className="hidden shrink-0 text-muted-foreground hover:text-foreground group-hover:block"
            >
              <X size={10} weight="bold" />
            </button>
          </div>
        ))}
        <button
          onClick={onAgentClick}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
            agentActive
              ? "bg-white/[0.06] text-foreground"
              : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          }`}
        >
          <span className="shrink-0"><CursorClick size={14} weight="bold" /></span>
          <span>Agent</span>
        </button>
      </div>
    </div>
  );
}
