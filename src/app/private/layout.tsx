"use server";
import { MembersHeader } from "../MembersHeader";
import { getUser, getUsers } from "@/modules/sanity";
import { getUserInfoFromCookie } from "@/modules/cookies";
import { MemberStoreProvider } from "@/stores/member-store-provider";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username, isGuest } = await getUserInfoFromCookie();

  if (isGuest) {
    return (
      <div>
        Welcome friend... not much to see{" "}
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/api/auth/logout">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <MemberStoreProvider
      initialData={{
        member: await getUser(username),
        members: await getUsers(false),
      }}
    >
      <MembersHeader />
      {children}
    </MemberStoreProvider>
  );
}
