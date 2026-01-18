"use client";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { Member } from "@/modules/schema";
import { AdminStoreProvider } from "@/stores/admin-store-provider";

export default function AdminsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const members = useDocuments(
    `$[_type = "member"]^(>standardPublished)`,
  ) as Member[];

  return (
    <AdminStoreProvider initialData={{ members }}>
      {children}
    </AdminStoreProvider>
  );
}
