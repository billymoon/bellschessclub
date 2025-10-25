"use client";

import { Button } from "@/components/ui/button";
import { copyTextToClipboard } from "@/modules/clipboard";
import { CheckCircle, CircleQuestionMark, CircleX, Copy } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Page() {
  // { initial: null, succeeded: true, failed: true, unknown: undefined }
  const [copyError, setCopyError] = useState<boolean | null | undefined>(null);
  const copyTimeout = useRef<NodeJS.Timeout>(undefined);
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4 mt-4">
      <h2>Join WhatsApp Group</h2>
      <Image src="/join-whatsapp.png" alt="" height={133} width={133} />
      <Button
        variant="outline"
        disabled={copyError === false}
        className="cursor-pointer"
        onClick={async () => {
          setCopyError(
            await copyTextToClipboard(
              "https://chat.whatsapp.com/GHzEfUWtHvJBnytua94ta5?mode=wwc",
            ),
          );
          clearTimeout(copyTimeout.current);
          copyTimeout.current = setTimeout(() => {
            setCopyError(null);
          }, 2000);
        }}
      >
        {copyError === null ? (
          <Copy />
        ) : copyError === false ? (
          <CheckCircle color="var(--color-green-700)" />
        ) : copyError === undefined ? (
          <CircleQuestionMark color="var(--color-yellow-950)" />
        ) : (
          <CircleX color="var(--color-red-700)" />
        )}
        Copy link
      </Button>
    </div>
  );
}
