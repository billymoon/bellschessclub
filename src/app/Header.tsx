import { Button } from "@/components/ui/button";
import { Crown, Home, Users } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
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

          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a href="/members">
              <Users className="size-4" />
              <span className="hidden sm:inline">Members</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
