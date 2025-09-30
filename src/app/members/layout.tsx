"use server";
import { MembersHeader } from "../MembersHeader";
import { getUser, getUsers } from "@/modules/sanity";
import { getUserInfoFromCookie, getUsernameFromCookie } from "@/modules/cookies";
import { MemberStoreProvider } from "@/stores/member-store-provider";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username, isGuest } = await getUserInfoFromCookie();

  if (isGuest) {
    return <div>Welcome friend...</div>
  }

  return (
    <MemberStoreProvider initialData={{ member: await getUser(username), members: await getUsers() }}>
      <MembersHeader />
      {children}
    </MemberStoreProvider>
  );
}
