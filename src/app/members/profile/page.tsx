"use client";
import { useMemberStore } from "@/stores/member-store-provider";

export default function Page() {
  const { member } = useMemberStore((state) => state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <pre>
        {JSON.stringify(member, null, "\n")
          .replace(/"_.+/g, "")
          .replace(/[{},"]/gm, "")
          .trim()}
      </pre>
    </div>
  );
}
