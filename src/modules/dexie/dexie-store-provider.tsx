"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  DexieState,
  type DexieStore,
  createDexieStore,
  initDexieStore,
} from "./dexie-store";

export type DexieStoreApi = ReturnType<typeof createDexieStore>;

export const DexieStoreContext = createContext<DexieStoreApi | undefined>(
  undefined,
);

export interface DexieStoreProviderProps {
  children: ReactNode;
  initialData: DexieState;
}

export const DexieStoreProvider = ({
  children,
  initialData,
}: DexieStoreProviderProps) => {
  const storeRef = useRef<DexieStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createDexieStore(initDexieStore(initialData));
  }

  return (
    <DexieStoreContext.Provider value={storeRef.current}>
      {children}
    </DexieStoreContext.Provider>
  );
};

export const useDexieStore = <T,>(selector: (store: DexieStore) => T): T => {
  const dexieStoreContext = useContext(DexieStoreContext);

  if (!dexieStoreContext) {
    throw new Error(`useDexieStore must be used within DexieStoreProvider`);
  }

  return useStore(dexieStoreContext, selector);
};
