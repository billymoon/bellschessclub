"use client";
import { EditPage } from "./EditPage";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { useDexieStore } from "@/modules/dexie/dexie-store-provider";
import { Member } from "@/modules/schema";
import { Wand } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const members = useDocuments(
    `$[_type = "member"]^(>standardPublished)`,
  ) as Member[];
  const cookieUserInfo = useDexieStore((state) => state.cookieUserInfo);
  const member = members.find(({ _id }) => _id === cookieUserInfo?._id);

  return (
    <div>
      <EditPage member={member} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <hr className="my-5"/>
        <Button
          variant="outline"
          size="default"
          className="gap-2 bg-transparent"
          asChild
        >
          <Link href="/private/profile/magic-link">
            <Wand className="h-5 w-5" />
            Magic link
          </Link>
        </Button>
      </div>
    </div>
  );
}
