"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTargeting } from "../../lib/targeting-context";

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
  type: string;
}

const TARGETABLE_SELECTOR = "[data-targetable]";

export function TargetOverlay() {
  const { state, setTarget, stopTargeting } = useTargeting();
  const [highlight, setHighlight] = useState<HighlightRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.style.pointerEvents = "none";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    overlay.style.pointerEvents = "auto";

    if (!el) { setHighlight(null); return; }

    const targetable = el.closest(TARGETABLE_SELECTOR) as HTMLElement | null;
    if (!targetable) { setHighlight(null); return; }

    const rect = targetable.getBoundingClientRect();
    setHighlight({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      label: targetable.dataset.targetLabel || "Element",
      type: targetable.dataset.targetable || "element",
    });
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (highlight) {
      setTarget(highlight.type, highlight.label);
    } else {
      stopTargeting();
    }
  }, [highlight, setTarget, stopTargeting]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") stopTargeting();
  }, [stopTargeting]);

  useEffect(() => {
    if (!state.active) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.active, handleMouseMove, handleClick, handleKeyDown]);

  if (!state.active) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] cursor-crosshair">
      <div className="absolute inset-0 bg-black/30" />

      {highlight && (
        <>
          <div
            className="absolute rounded-lg border-2 border-blue-400 bg-blue-400/10 transition-all duration-75"
            style={{
              top: highlight.top - 2,
              left: highlight.left - 2,
              width: highlight.width + 4,
              height: highlight.height + 4,
            }}
          />
          <div
            className="absolute rounded-md bg-blue-500 px-2 py-1 text-[11px] font-medium text-white shadow-lg"
            style={{
              top: highlight.top - 28,
              left: highlight.left,
            }}
          >
            {highlight.type}: {highlight.label}
          </div>
        </>
      )}
    </div>
  );
}
