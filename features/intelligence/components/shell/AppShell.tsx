"use client";

import type { ReactNode } from "react";
import { useNavMode } from "../../lib/nav-mode-context";
import { Header } from "./Header";
import { IconRail } from "./IconRail";
import { TabBar } from "./TabBar";

export function AppShell({ children }: { children: ReactNode }) {
  const { mode } = useNavMode();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {mode === "rail" && <IconRail />}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TabBar />
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
