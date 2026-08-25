"use client";

import type { ReactNode } from "react";
import { TabBar, type TabId } from "./TabBar";

interface AppShellProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden text-foreground">
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5">
        <TabBar active={activeTab} onChange={onTabChange} />

        <div className="flex items-center gap-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.244 10.148C8.427 10.694 7.502 11 6.5 11C4.015 11 2 8.985 2 6.5C2 4.015 4.015 2 6.5 2C8.985 2 11 4.015 11 6.5C11 7.502 10.694 8.427 10.148 9.244L13.354 12.45C13.549 12.646 13.549 12.962 13.354 13.157C13.158 13.353 12.842 13.353 12.646 13.157L9.244 10.148Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <span>Maps team</span>
            <svg width="8" height="8" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 6.5L1.5 3.5H7.5L4.5 6.5Z" fill="currentColor" />
            </svg>
          </button>
          <div className="ml-1 h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-600" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
