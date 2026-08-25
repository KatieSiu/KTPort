"use client";

import { useState } from "react";
import { PanelProvider, usePanels } from "@/features/intelligence/lib/panel-context";
import { AppShell } from "@/features/intelligence/components/shell/AppShell";
import type { TabId } from "@/features/intelligence/components/shell/TabBar";
import { PanelStack } from "@/features/intelligence/components/panels/PanelStack";
import { MetricCards } from "@/features/intelligence/components/traces/MetricCards";
import { ThreadTable } from "@/features/intelligence/components/traces/ThreadTable";
import { ThreadDetailPanel } from "@/features/intelligence/components/traces/ThreadDetailPanel";
import { RunDetailPanel } from "@/features/intelligence/components/traces/RunDetailPanel";
import { GhostView } from "@/features/intelligence/components/traces/GhostView";

function TracesContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MetricCards />
      <ThreadTable />
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MetricCards />
      <GhostView
        title="Activity Feed"
        subtitle="Recent events across all threads"
        rows={6}
      />
    </div>
  );
}

const ghostTabs: Record<string, { title: string; subtitle: string; rows: number }> = {
  Datasets: {
    title: "Datasets",
    subtitle: "Versioned test case collections for offline evaluation",
    rows: 6,
  },
  Experiments: {
    title: "Experiments",
    subtitle: "Immutable snapshots of evaluation runs",
    rows: 7,
  },
  Prompts: {
    title: "Prompts",
    subtitle: "Versioned prompt templates and configurations",
    rows: 5,
  },
};

function TabContent({ tab }: { tab: TabId }) {
  const { state } = usePanels();

  if (tab === "Traces") {
    return (
      <PanelStack
        content={<TracesContent />}
        l2Panel={state.threadId ? <ThreadDetailPanel /> : undefined}
        l3Panel={state.runId ? <RunDetailPanel /> : undefined}
      />
    );
  }

  if (tab === "Overview") {
    return (
      <div className="flex h-full w-full gap-2.5 overflow-hidden p-2.5 pt-0">
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-surface))]">
          <OverviewContent />
        </div>
      </div>
    );
  }

  const ghost = ghostTabs[tab];
  if (ghost) {
    return (
      <div className="flex h-full w-full gap-2.5 overflow-hidden p-2.5 pt-0">
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-surface))]">
          <GhostView {...ghost} />
        </div>
      </div>
    );
  }

  return null;
}

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<TabId>("Traces");

  return (
    <PanelProvider>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        <TabContent tab={activeTab} />
      </AppShell>
    </PanelProvider>
  );
}
