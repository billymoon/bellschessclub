"use client";
import { AdminTable } from "@/components/AdminTable";
import { useAdminStore } from "@/stores/admin-store-provider";

export default function Page() {
  const { members } = useAdminStore((state) => state);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminTable members={members} />
    </div>
  );
}
