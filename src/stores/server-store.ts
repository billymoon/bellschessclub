import { UserCookie } from "@/modules/cookies";
import { createStore } from "zustand/vanilla";

export type ServerState = {
  cookieUserInfo: UserCookie | null;
};

export const initServerStore = (initialData: ServerState): ServerState => {
  return { ...initialData };
};

export const defaultInitState: ServerState = {
  cookieUserInfo: null,
};

export const createServerStore = (
  initState: ServerState = defaultInitState,
) => {
  return createStore<ServerState>()((set) => ({
    ...initState,
  }));
};
