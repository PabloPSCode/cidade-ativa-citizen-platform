"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { StorePayload } from "../../types";

const StoreContext = createContext<StorePayload | null>(null);

export function StoreProvider({
  value,
  children,
}: {
  value: StorePayload;
  children: ReactNode;
}) {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
