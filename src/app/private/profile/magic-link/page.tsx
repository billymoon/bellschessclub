"use client";

import { Button } from "@/components/ui/button";
import { copyTextToClipboard } from "@/modules/clipboard";
import { CheckCircle, CircleQuestionMark, CircleX, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { getAuthJwt } from "./get-auth-jwt";
import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Page() {
  const [jwtUrl, setJwtUrl] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<boolean | null | undefined>(null);
  const copyTimeout = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    void (async () => {
      setJwtUrl(
        `${window.location.origin}/api/magic-link/${await getAuthJwt()}`,
      );
    })();
  }, []);

  return !jwtUrl ? (
    ""
  ) : (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4 mt-4">
      <h2>Magic link</h2>
      <p>Don't share this link with anyone, it will automagically log in as you!</p>
      <QRCodeSVG
        value={jwtUrl}
        style={{
          width: "400px",
          maxWidth: "100%",
          height: "400px",
          maxHeight: "100%",
        }}
      />
      <Button
        variant="outline"
        disabled={copyError === false}
        className="cursor-pointer"
        onClick={async () => {
          setCopyError(await copyTextToClipboard(jwtUrl));
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
