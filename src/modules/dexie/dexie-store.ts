import { createStore } from "zustand/vanilla";
import { DexieDocument } from "./dexie-schema";
import { UserCookie } from "../cookies";

export type DexieState = {
  documents: DexieDocument[];
  cookieUserInfo: UserCookie | null;
};

export type DexieActions = {
  setDexieData: (data: Partial<DexieState>) => void;
};

export type DexieStore = DexieState & DexieActions;

export const initDexieStore = (initialData: DexieState): DexieState => {
  return { ...initialData };
};

export const defaultInitState: DexieState = {
  documents: [],
  cookieUserInfo: null,
};

export const createDexieStore = (initState: DexieState = defaultInitState) => {
  return createStore<DexieStore>()((set) => ({
    ...initState,
    setDexieData: (data) => set((state) => ({ ...state, ...data })),
  }));
};
