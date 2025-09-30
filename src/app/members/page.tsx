"use client";
import { MembersTable } from "@/components/MembersTable";
// import { FormField } from "@/components/FormField";
import { useMemberStore } from "@/stores/member-store-provider";

export default function Page() {
  const { member, members } = useMemberStore((state) => state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MembersTable members={members} />
    </div>
  );
}
