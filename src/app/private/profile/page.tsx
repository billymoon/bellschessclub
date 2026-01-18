"use client"
import { EditPage } from "./EditPage";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { useDexieStore } from "@/modules/dexie/dexie-store-provider";
import { Member } from "@/modules/schema";

export default function Page() {
  const members = useDocuments(`$[_type = "member"]^(>standardPublished)`) as Member[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id)

  return <EditPage member={member} />;
}
