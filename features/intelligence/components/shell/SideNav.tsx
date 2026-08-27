"use client";

import { CursorClick, X } from "@phosphor-icons/react";

export type TabId = "Home" | "Traces" | "Evaluations" | "Datasets" | "Experiments" | "Playground" | "Settings";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export interface MinimizedAgent {
  id: string;
  name: string;
}

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
    id: "Evaluations", label: "Evaluations",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M3 7.5L6 10.5L12 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: "Datasets", label: "Datasets",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><ellipse cx="7.5" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M2.5 4v3.5c0 1.1 2.24 2 5 2s5-.9 5-2V4" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M2.5 7.5V11c0 1.1 2.24 2 5 2s5-.9 5-2V7.5" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>,
  },
  {
    id: "Experiments", label: "Experiments",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M5.5 1.5h4M6 1.5V6L2.5 12.5h10L9 6V1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>,
  },
  {
    id: "Playground", label: "Playground",
    icon: <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M4 3L11.5 7.5L4 12V3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" /></svg>,
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

export function SideNav({ active, onChange, onAgentClick, agentActive, minimizedAgents, onRestoreAgent, onDeleteAgent }: SideNavProps) {
  return (
    <div className="flex h-full w-[164px] shrink-0 flex-col rounded-xl bg-[hsl(var(--panel-surface))] px-2 py-2">
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
