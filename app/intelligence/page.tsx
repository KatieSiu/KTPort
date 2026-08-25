"use client";

import { NavModeProvider } from "@/features/intelligence/lib/nav-mode-context";
import { PanelProvider } from "@/features/intelligence/lib/panel-context";
import { AppShell } from "@/features/intelligence/components/shell/AppShell";
import { PanelStack } from "@/features/intelligence/components/panels/PanelStack";
import { MetricCards } from "@/features/intelligence/components/traces/MetricCards";
import { ThreadTable } from "@/features/intelligence/components/traces/ThreadTable";
import { ThreadDetailPanel } from "@/features/intelligence/components/traces/ThreadDetailPanel";
import { RunDetailPanel } from "@/features/intelligence/components/traces/RunDetailPanel";

function TracesContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MetricCards />
      <ThreadTable />
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <NavModeProvider>
      <PanelProvider>
        <AppShell>
          <PanelStack
            content={<TracesContent />}
            l2Panel={<ThreadDetailPanel />}
            l3Panel={<RunDetailPanel />}
          />
        </AppShell>
      </PanelProvider>
    </NavModeProvider>
  );
}
