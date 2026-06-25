"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-[#C41230] shadow-sm transition hover:bg-red-50 active:scale-95"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Tersalin!</span>
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          Salin Link
        </>
      )}
    </button>
  );
}
