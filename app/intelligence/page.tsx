"use client";

import { useState } from "react";
import { PanelProvider } from "@/features/intelligence/lib/panel-context";
import { TargetingProvider } from "@/features/intelligence/lib/targeting-context";
import { AppShell } from "@/features/intelligence/components/shell/AppShell";
import type { TabId } from "@/features/intelligence/components/shell/SideNav";
import { PanelStack } from "@/features/intelligence/components/panels/PanelStack";
import { TracesHeader } from "@/features/intelligence/components/traces/TracesHeader";
import { MetricCards } from "@/features/intelligence/components/traces/MetricCards";
import { ThreadTable } from "@/features/intelligence/components/traces/ThreadTable";
import { ThreadDetailPanel } from "@/features/intelligence/components/traces/ThreadDetailPanel";
import { RunDetailPanel } from "@/features/intelligence/components/traces/RunDetailPanel";
import { TargetOverlay } from "@/features/intelligence/components/shell/TargetOverlay";
import {
  OverviewGhost,
  ExperimentsGhost,
  PlaygroundGhost,
} from "@/features/intelligence/components/traces/GhostView";
import { DatasetsContent } from "@/features/intelligence/components/datasets/DatasetsContent";
import { EvaluatorsContent } from "@/features/intelligence/components/evaluators/EvaluatorsContent";
import { ExperimentsContent } from "@/features/intelligence/components/experiments/ExperimentsContent";
import { HomeContent } from "@/features/intelligence/components/home/HomeContent";

function TracesContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MetricCards />
      <TracesHeader />
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
    return <HomeContent />;
  }

  if (tab === "Evaluators") {
    return <EvaluatorsContent />;
  }

  if (tab === "Datasets") {
    return <DatasetsContent />;
  }

  if (tab === "Prompts") {
    return <SinglePanel><PlaygroundGhost /></SinglePanel>;
  }

  if (tab === "Experiments") {
    return <ExperimentsContent />;
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
