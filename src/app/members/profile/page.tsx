"use client";
import { FormField } from "@/components/FormField";
import { useMemberStore } from "@/stores/member-store-provider";

export default function Page() {
  const { member } = useMemberStore((state) => state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FormField
        name="username"
        label="Username"
        readOnly
        aria-readonly
        value={member.username}
      />
      <FormField
        name="pnum"
        label="Pnum"
        readOnly
        aria-readonly
        value={member.pnum}
      />
      <FormField
        name="chesscomUsername"
        label="Chess.com username"
        readOnly
        aria-readonly
        value={member.chesscomUsername}
      />
      <pre>{JSON.stringify(member, null, 2)}</pre>
    </div>
  );
}
