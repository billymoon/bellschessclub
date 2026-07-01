"use client";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { EditPage } from "../EditPage";

export default function Page() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <EditPage  />
    </div>
  );
}
