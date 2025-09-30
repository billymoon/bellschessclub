"use client";
import { Button } from "@/components/ui/button";
import { useMemberStore } from "@/stores/member-store-provider";
import { LogOut } from "lucide-react";

export function MembersHeader() {
  const { member } = useMemberStore((state) => state);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a href="/members/profile">Profile for {member.username}</a>
          </Button>
          {member.isAdmin ? (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <a href="/members/admin">User admin</a>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm" className="gap-2">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/auth/logout">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
