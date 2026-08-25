"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePanels } from "../../lib/panel-context";

interface PanelStackProps {
  content: ReactNode;
  l2Panel?: ReactNode;
  l3Panel?: ReactNode;
}

const ease = [0.32, 0.72, 0, 1] as const;

export function PanelStack({ content, l2Panel, l3Panel }: PanelStackProps) {
  const { state } = usePanels();
  const hasL2 = state.threadId !== null;
  const hasL3 = state.runId !== null;

  const contentWidth = hasL3 ? "28%" : hasL2 ? "50%" : "100%";
  const l2Width = hasL3 ? "36%" : "50%";

  return (
    <div className="relative flex h-full w-full overflow-hidden pb-2 pl-2 pr-2">
      <motion.div
        animate={{ width: contentWidth }}
        transition={{ duration: 0.35, ease }}
        className="h-full shrink-0 overflow-hidden pr-1"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
          {content}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasL2 && l2Panel && (
          <motion.div
            key="l2"
            initial={{ x: "100%", width: l2Width }}
            animate={{ x: 0, width: l2Width }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease }}
            className="h-full shrink-0 overflow-hidden px-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              {l2Panel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {hasL3 && l3Panel && (
          <motion.div
            key="l3"
            initial={{ x: "100%", width: "36%" }}
            animate={{ x: 0, width: "36%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease }}
            className="h-full shrink-0 overflow-hidden pl-1"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[hsl(var(--panel-surface))]">
              {l3Panel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
