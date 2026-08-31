"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface PanelState {
  threadId: string | null;
  runId: string | null;
  l3Mode: "run" | "evaluator";
}

interface PanelContextValue {
  state: PanelState;
  openThread: (id: string) => void;
  openRun: (id: string) => void;
  closeThread: () => void;
  closeRun: () => void;
  closeAll: () => void;
}

const PanelContext = createContext<PanelContextValue>({
  state: { threadId: null, runId: null, l3Mode: "run" },
  openThread: () => {},
  openRun: () => {},
  closeThread: () => {},
  closeRun: () => {},
  closeAll: () => {},
});

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PanelState>({ threadId: null, runId: null, l3Mode: "run" });

  const openThread = useCallback((id: string) => {
    setState((prev) => ({ ...prev, threadId: id }));
  }, []);

  const openRun = useCallback((id: string) => {
    const isEval = id.startsWith("eval_");
    setState((prev) => ({ ...prev, runId: id, l3Mode: isEval ? "evaluator" : "run" }));
  }, []);

  const closeThread = useCallback(() => {
    setState({ threadId: null, runId: null, l3Mode: "run" });
  }, []);

  const closeRun = useCallback(() => {
    setState((prev) => ({ ...prev, runId: null, l3Mode: "run" }));
  }, []);

  const closeAll = useCallback(() => {
    setState({ threadId: null, runId: null, l3Mode: "run" });
  }, []);

  return (
    <PanelContext.Provider value={{ state, openThread, openRun, closeThread, closeRun, closeAll }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  return useContext(PanelContext);
}
