"use client";
import { MembersTable } from "@/components/MembersTable";
import { useMemberStore } from "@/stores/member-store-provider";

export default function Page() {
  const { members, member } = useMemberStore((state) => state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MembersTable members={members!} isAdmin={Boolean(member.isAdmin)} />
    </div>
  );
}
