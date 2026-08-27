"use client";

import { useState } from "react";
import { PanelProvider } from "@/features/intelligence/lib/panel-context";
import { TargetingProvider } from "@/features/intelligence/lib/targeting-context";
import { AppShell } from "@/features/intelligence/components/shell/AppShell";
import type { TabId } from "@/features/intelligence/components/shell/SideNav";
import { PanelStack } from "@/features/intelligence/components/panels/PanelStack";
import { MetricCards } from "@/features/intelligence/components/traces/MetricCards";
import { ThreadTable } from "@/features/intelligence/components/traces/ThreadTable";
import { ThreadDetailPanel } from "@/features/intelligence/components/traces/ThreadDetailPanel";
import { RunDetailPanel } from "@/features/intelligence/components/traces/RunDetailPanel";
import { TargetOverlay } from "@/features/intelligence/components/shell/TargetOverlay";
import {
  OverviewGhost,
  DatasetsGhost,
  ExperimentsGhost,
  EvaluationsGhost,
  PlaygroundGhost,
  SettingsGhost,
} from "@/features/intelligence/components/traces/GhostView";

function TracesContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MetricCards />
      <ThreadTable />
    </div>
  );
}

function SinglePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
        {children}
      </div>
    </div>
  );
}

function TabContent({ tab }: { tab: TabId }) {
  if (tab === "Traces") {
    return (
      <PanelStack
        content={<TracesContent />}
        l2Panel={<ThreadDetailPanel />}
        l3Panel={<RunDetailPanel />}
      />
    );
  }

  if (tab === "Home") {
    return (
      <SinglePanel>
        <MetricCards />
        <OverviewGhost />
      </SinglePanel>
    );
  }

  if (tab === "Evaluations") {
    return <SinglePanel><EvaluationsGhost /></SinglePanel>;
  }

  if (tab === "Datasets") {
    return <SinglePanel><DatasetsGhost /></SinglePanel>;
  }

  if (tab === "Experiments") {
    return <SinglePanel><ExperimentsGhost /></SinglePanel>;
  }

  if (tab === "Playground") {
    return <SinglePanel><PlaygroundGhost /></SinglePanel>;
  }

  if (tab === "Settings") {
    return <SinglePanel><SettingsGhost /></SinglePanel>;
  }

  return null;
}

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<TabId>("Traces");

  return (
    <PanelProvider>
      <TargetingProvider>
        <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
          <TabContent tab={activeTab} />
        </AppShell>
        <TargetOverlay />
      </TargetingProvider>
    </PanelProvider>
  );
}
