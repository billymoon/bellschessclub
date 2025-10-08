import { Member, MemberPartial } from "@/modules/schema";
import { create } from "superstruct";
import { createStore } from "zustand/vanilla";

export type MemberState = {
  member: Member;
  members?: Member[];
};

export type MemberActions = {
  setMemberData: (data: MemberPartial) => void;
};

export type MemberStore = MemberState & MemberActions;

export const initMemberStore = (initialData: MemberState): MemberState => {
  return { ...initialData };
};

export const defaultInitState: MemberState = {
  member: create({
    username: "",
    isAdmin: false,
  }, Member),
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
