import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/admin/whatsapp">
              <SiWhatsapp />
              Invite to whatsapp
            </Link>
          </Button>
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
