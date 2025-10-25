"use server";
import { MembersHeader } from "../MembersHeader";
import { getUserById, getUsers, queryDocuments } from "@/modules/turso";
import { getUserInfoFromCookie } from "@/modules/cookies";
import { MemberStoreProvider } from "@/stores/member-store-provider";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { _id } = await getUserInfoFromCookie();

  return (
    <MemberStoreProvider
      initialData={{
        documents: await queryDocuments(),
        member: await getUserById(_id),
        members: await getUsers(false),
      }}
    >
      <MembersHeader />
      {children}
    </MemberStoreProvider>
  );
}
