"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface TargetingState {
  active: boolean;
  target: { type: string; label: string } | null;
}

interface TargetingContextValue {
  state: TargetingState;
  startTargeting: () => void;
  stopTargeting: () => void;
  setTarget: (type: string, label: string) => void;
  clearTarget: () => void;
}

const TargetingContext = createContext<TargetingContextValue>({
  state: { active: false, target: null },
  startTargeting: () => {},
  stopTargeting: () => {},
  setTarget: () => {},
  clearTarget: () => {},
});

export function TargetingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TargetingState>({ active: false, target: null });

  const startTargeting = useCallback(() => {
    setState({ active: true, target: null });
  }, []);

  const stopTargeting = useCallback(() => {
    setState((prev) => ({ ...prev, active: false }));
  }, []);

  const setTarget = useCallback((type: string, label: string) => {
    setState({ active: false, target: { type, label } });
  }, []);

  const clearTarget = useCallback(() => {
    setState({ active: false, target: null });
  }, []);

  return (
    <TargetingContext.Provider value={{ state, startTargeting, stopTargeting, setTarget, clearTarget }}>
      {children}
    </TargetingContext.Provider>
  );
}

export function useTargeting() {
  return useContext(TargetingContext);
}
