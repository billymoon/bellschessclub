import { createStore } from "zustand/vanilla";
import { MemberDocument } from "@/modules/schema";

export type AdminState = {
  members: MemberDocument[];
};

export type AdminActions = {
  setAdminData: (data: AdminState) => void;
};

export type AdminStore = AdminState & AdminActions;

export const initAdminStore = (initialData: AdminState): AdminState => {
  return { ...initialData };
};

export const defaultInitState: AdminState = {
  members: [],
};

export const createAdminStore = (initState: AdminState = defaultInitState) => {
  return createStore<AdminStore>()((set) => ({
    ...initState,
    setAdminData: (data) => set((state) => ({ ...state, ...data })),
  }));
};
