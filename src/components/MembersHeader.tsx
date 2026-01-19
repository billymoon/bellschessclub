"use client";
import { Button } from "@/components/ui/button";
import { useDexieStore } from "@/modules/dexie/dexie-store-provider";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { Member } from "@/modules/schema";
import { Swords, Table, UserCircle, Users } from "lucide-react";
import Link from "next/link";

export function MembersHeader() {
  const members = useDocuments(`$[_type = "member"]^(>standardPublished)`) as Member[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link prefetch href="/private/matches">
                <Swords className="size-4" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link prefetch href="/private/tables">
                <Table className="size-4" />
                <span className="hidden sm:inline">Tables</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link prefetch href="/private/members">
                <Users className="size-4" />
                <span className="hidden sm:inline">Members</span>
              </Link>
            </Button>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link prefetch href="/private/profile">
              <UserCircle />
              <span className="hidden sm:inline">{member.name}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
