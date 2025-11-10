"use client";
import { Button } from "@/components/ui/button";
import { useMemberStore } from "@/stores/member-store-provider";
import { Swords, UserCircle, Users } from "lucide-react";
import Link from "next/link";

export function MembersHeader() {
  const { member } = useMemberStore((state) => state);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/private/matches">
                <Swords className="size-4" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/private/members">
                <Users className="size-4" />
                <span className="hidden sm:inline">Members</span>
              </Link>
            </Button>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/private/profile">
              <UserCircle />
              Profile: {member.name}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
