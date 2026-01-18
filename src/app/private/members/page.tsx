"use client";
import { MembersTable } from "@/components/MembersTable";
import { useDexieStore } from "@/modules/dexie/dexie-store-provider";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { Member } from "@/modules/schema";

export default function Page() {
  const members = useDocuments(`$[_type = "member"]^(>standardPublished)`) as Member[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MembersTable members={members!} isAdmin={member?.isAdmin === true} />
    </div>
  );
}
