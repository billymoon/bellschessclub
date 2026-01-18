"use client";
import { AdminTable } from "@/components/AdminTable";
import { useDocuments } from "@/modules/dexie/useDocuments";

export default function Page() {
  const documents = useDocuments('$[_type = "member"]^(<$number(pnum))')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminTable members={documents} />
    </div>
  );
}
