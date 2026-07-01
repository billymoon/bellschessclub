"use client";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { EditPage } from "../EditPage";

export default function Page({ params: { memberId } }) {
  const currentDocument = useDocuments(`$[_id = "${memberId}"]`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <EditPage currentDocument={currentDocument} />
    </div>
  );
}
