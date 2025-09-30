"use server";
import { getUser, getUsers } from "@/modules/sanity";
import { getUsernameFromCookie } from "@/modules/cookies";
import { AdminStoreProvider } from "@/stores/admin-store-provider";

export default async function AdminsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await getUsernameFromCookie();
  const members = await getUsers(false);

  return (
    <AdminStoreProvider initialData={{ members }}>
      {children}
    </AdminStoreProvider>
  );
}
