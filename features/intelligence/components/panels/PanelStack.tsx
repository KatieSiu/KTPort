"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePanels } from "../../lib/panel-context";

interface PanelStackProps {
  content: ReactNode;
  l2Panel?: ReactNode;
  l3Panel?: ReactNode;
}

const spring = { type: "spring" as const, stiffness: 400, damping: 34 };

function PanelCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-surface))] ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelStack({ content, l2Panel, l3Panel }: PanelStackProps) {
  const { state } = usePanels();
  const hasL2 = state.threadId !== null;
  const hasL3 = state.runId !== null;

  return (
    <div className="flex h-full w-full gap-2.5 overflow-hidden p-2.5 pt-0">
      <motion.div
        layout
        transition={spring}
        className="h-full shrink-0 overflow-hidden"
        style={{
          width: hasL3 ? "28%" : hasL2 ? "50%" : "100%",
        }}
      >
        <PanelCard>{content}</PanelCard>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasL2 && l2Panel && (
          <motion.div
            key="l2"
            layout
            initial={{ opacity: 0, x: 80, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.97 }}
            transition={spring}
            className="h-full shrink-0 overflow-hidden"
            style={{ width: hasL3 ? "36%" : "50%" }}
          >
            <PanelCard>{l2Panel}</PanelCard>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {hasL3 && l3Panel && (
          <motion.div
            key="l3"
            layout
            initial={{ opacity: 0, x: 80, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.97 }}
            transition={spring}
            className="h-full shrink-0 overflow-hidden"
            style={{ width: "36%" }}
          >
            <PanelCard>{l3Panel}</PanelCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
