import { createStore } from "zustand/vanilla";

export type MemberState = {
  member: {
    username: string;
    isAdmin: boolean;
    pnum?: string;
    name?: string;
    lichessUsername?: string;
    standardPublished?: string;
    standardLive?: string;
    allegroPublished?: string;
    allegroLive?: string;
  };
};

export type MemberActions = {
  setMemberData: (data: MemberState["member"]) => void;
};

export type MemberStore = MemberState & MemberActions;

export const initMemberStore = (initialData: MemberState): MemberState => {
  return { ...initialData };
};

export const defaultInitState: MemberState = {
  member: {
    username: "",
    isAdmin: false,
  },
};

export const createMemberStore = (
  initState: MemberState = defaultInitState,
) => {
  return createStore<MemberStore>()((set) => ({
    ...initState,
    setMemberData: (data) =>
      set((state) => ({ member: { ...state.member, ...data } })),
  }));
};
