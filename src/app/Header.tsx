import { Button } from "@/components/ui/button";
import { Crown, Home, LogIn, LogOut, ShieldUser } from "lucide-react";
import Link from "next/link";
import { SiWhatsapp } from "react-icons/si";

export function Header({
  isAdmin,
  isMember,
  isImpersonating = false,
}: {
  isAdmin: boolean;
  isMember: boolean;
  isImpersonating: boolean;
}) {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60${isImpersonating ? " bg-red-300" : process.env.NODE_ENV !== "production" ? " bg-orange-200" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link prefetch href="/">
                <Home className="size-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            {isAdmin ? (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link prefetch href="/admin">
                  <ShieldUser className="size-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Crown className="size-4" />
            <h1 className="text-lg font-semibold text-foreground">
              <span className="hidden md:inline">Sandy Bells Chess Club</span>
              <span className="md:hidden">SBCC</span>
            </h1>
          </div>

          <div>
            {isAdmin ? (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link prefetch href="/admin/whatsapp">
                  <SiWhatsapp />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Link>
              </Button>
            ) : null}
            {isMember ? (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/api/auth/logout">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </a>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link prefetch href="/private/matches">
                  <LogIn className="size-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
