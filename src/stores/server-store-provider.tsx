"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  ServerState,
  type ServerStore,
  createServerStore,
  initServerStore,
} from "@/stores/server-store";

export type ServerStoreApi = ReturnType<typeof createServerStore>;

export const ServerStoreContext = createContext<ServerStoreApi | undefined>(
  undefined,
);

export interface ServerStoreProviderProps {
  children: ReactNode;
  initialData: ServerState;
}

export const ServerStoreProvider = ({
  children,
  initialData,
}: ServerStoreProviderProps) => {
  const storeRef = useRef<ServerStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createServerStore(initServerStore(initialData));
  }

  return (
    <ServerStoreContext.Provider value={storeRef.current}>
      {children}
    </ServerStoreContext.Provider>
  );
};

export const useServerStore = <T,>(selector: (store: ServerStore) => T): T => {
  const memberStoreContext = useContext(ServerStoreContext);

  if (!memberStoreContext) {
    throw new Error(`useServerStore must be used within ServerStoreProvider`);
  }

  return useStore(memberStoreContext, selector);
};
