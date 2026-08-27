"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePanels } from "../../lib/panel-context";

interface PanelStackProps {
  content: ReactNode;
  l2Panel?: ReactNode;
  l3Panel?: ReactNode;
}

const ease = [0.32, 0.72, 0, 1] as const;
const transition = { duration: 0.35, ease };

export function PanelStack({ content, l2Panel, l3Panel }: PanelStackProps) {
  const { state } = usePanels();
  const hasL2 = state.threadId !== null;
  const hasL3 = state.runId !== null;
  const hasInteracted = useRef(false);

  if (hasL2) hasInteracted.current = true;

  const contentWidth = hasL3 ? "28%" : hasL2 ? "50%" : "100%";
  const l2Width = hasL3 ? "36%" : "50%";
  const shouldAnimate = hasInteracted.current;

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <motion.div
        initial={false}
        animate={{ width: contentWidth }}
        transition={shouldAnimate ? transition : { duration: 0 }}
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
            transition={transition}
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
            transition={transition}
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
