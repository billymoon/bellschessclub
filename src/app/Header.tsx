import { Button } from "@/components/ui/button";
import { Crown, Home, Swords, Users } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <Home className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </Button>

          <div className="flex items-center gap-2">
            <Crown className="size-4" />
            <h1 className="text-lg font-semibold text-foreground">
              Sandy Bells Chess Club
            </h1>
          </div>

          <div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/members/matches">
                <Swords className="size-4" />
                <span className="hidden sm:inline">Matches</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/members">
                <Users className="size-4" />
                <span className="hidden sm:inline">Members</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
