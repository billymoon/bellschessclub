"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  AdminState,
  type AdminStore,
  createAdminStore,
  initAdminStore,
} from "@/stores/admin-store";

export type AdminStoreApi = ReturnType<typeof createAdminStore>;

export const AdminStoreContext = createContext<AdminStoreApi | undefined>(
  undefined,
);

export interface AdminStoreProviderProps {
  children: ReactNode;
  initialData: AdminState;
}

export const AdminStoreProvider = ({
  children,
  initialData,
}: AdminStoreProviderProps) => {
  const storeRef = useRef<AdminStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createAdminStore(initAdminStore(initialData));
  }

  return (
    <AdminStoreContext.Provider value={storeRef.current}>
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = <T,>(selector: (store: AdminStore) => T): T => {
  const memberStoreContext = useContext(AdminStoreContext);

  if (!memberStoreContext) {
    throw new Error(`useAdminStore must be used within AdminStoreProvider`);
  }

  return useStore(memberStoreContext, selector);
};
