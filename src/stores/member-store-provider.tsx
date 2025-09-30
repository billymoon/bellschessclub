"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  MemberState,
  type MemberStore,
  createMemberStore,
  initMemberStore,
} from "@/stores/member-store";

export type MemberStoreApi = ReturnType<typeof createMemberStore>;

export const MemberStoreContext = createContext<MemberStoreApi | undefined>(
  undefined,
);

export interface MemberStoreProviderProps {
  children: ReactNode;
  initialData: MemberState;
}

export const MemberStoreProvider = ({
  children,
  initialData,
}: MemberStoreProviderProps) => {
  const storeRef = useRef<MemberStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createMemberStore(initMemberStore(initialData));
  }

  return (
    <MemberStoreContext.Provider value={storeRef.current}>
      {children}
    </MemberStoreContext.Provider>
  );
};

export const useMemberStore = <T,>(selector: (store: MemberStore) => T): T => {
  const memberStoreContext = useContext(MemberStoreContext);

  if (!memberStoreContext) {
    throw new Error(`useMemberStore must be used within MemberStoreProvider`);
  }

  return useStore(memberStoreContext, selector);
};
