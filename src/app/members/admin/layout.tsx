"use server";
import { getUsers } from "@/modules/sanity";
import { AdminStoreProvider } from "@/stores/admin-store-provider";

export default async function AdminsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const members = await getUsers(false);

  return (
    <AdminStoreProvider initialData={{ members }}>
      {children}
    </AdminStoreProvider>
  );
}
