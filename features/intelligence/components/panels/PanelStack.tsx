"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePanels } from "../../lib/panel-context";

interface PanelStackProps {
  content: ReactNode;
  l2Panel?: ReactNode;
  l3Panel?: ReactNode;
}

function getWidths(hasL2: boolean, hasL3: boolean) {
  if (hasL3) return { content: "25%", l2: "30%", l3: "45%" };
  if (hasL2) return { content: "45%", l2: "55%", l3: "0%" };
  return { content: "100%", l2: "0%", l3: "0%" };
}

export function PanelStack({ content, l2Panel, l3Panel }: PanelStackProps) {
  const { state } = usePanels();
  const hasL2 = state.threadId !== null;
  const hasL3 = state.runId !== null;
  const widths = getWidths(hasL2, hasL3);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <motion.div
        layout
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="h-full shrink-0 overflow-hidden"
        style={{ width: widths.content }}
      >
        {content}
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasL2 && l2Panel && (
          <motion.div
            key="l2"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="h-full shrink-0 overflow-hidden border-l border-border"
            style={{ width: widths.l2 }}
          >
            {l2Panel}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {hasL3 && l3Panel && (
          <motion.div
            key="l3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="h-full shrink-0 overflow-hidden border-l border-border"
            style={{ width: widths.l3 }}
          >
            {l3Panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
