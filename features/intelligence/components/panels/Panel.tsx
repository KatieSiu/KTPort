"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Panel({ children, onClose, className = "" }: PanelProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className={`flex h-full shrink-0 flex-col overflow-hidden border-l border-border bg-background ${className}`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>
      )}
      {children}
    </motion.div>
  );
}
