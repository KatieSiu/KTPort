"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface PanelState {
  threadId: string | null;
  runId: string | null;
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
  state: { threadId: null, runId: null },
  openThread: () => {},
  openRun: () => {},
  closeThread: () => {},
  closeRun: () => {},
  closeAll: () => {},
});

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PanelState>({ threadId: null, runId: null });

  const openThread = useCallback((id: string) => {
    setState((prev) => ({ ...prev, threadId: id }));
  }, []);

  const openRun = useCallback((id: string) => {
    setState((prev) => ({ ...prev, runId: id }));
  }, []);

  const closeThread = useCallback(() => {
    setState({ threadId: null, runId: null });
  }, []);

  const closeRun = useCallback(() => {
    setState((prev) => ({ ...prev, runId: null }));
  }, []);

  const closeAll = useCallback(() => {
    setState({ threadId: null, runId: null });
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
