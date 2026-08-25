"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type NavMode = "tabs" | "rail";

interface NavModeContextValue {
  mode: NavMode;
  toggle: () => void;
}

const NavModeContext = createContext<NavModeContextValue>({
  mode: "tabs",
  toggle: () => {},
});

export function NavModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavMode>("tabs");
  const toggle = () => setMode((m) => (m === "tabs" ? "rail" : "tabs"));
  return (
    <NavModeContext.Provider value={{ mode, toggle }}>
      {children}
    </NavModeContext.Provider>
  );
}

export function useNavMode() {
  return useContext(NavModeContext);
}
