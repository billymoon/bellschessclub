import { Member, MemberPartial } from "@/modules/schema";
import { SanityDocument } from "@sanity/client";
import { create } from "superstruct";
import { createStore } from "zustand/vanilla";

export type MemberState = {
  documents: SanityDocument[];
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
  documents: [],
  member: create(
    {
      username: "",
      isAdmin: false,
    },
    Member,
  ),
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
