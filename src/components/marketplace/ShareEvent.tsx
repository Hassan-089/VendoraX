"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
export function ShareEvent({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        className="action action-outline w-full"
        onClick={async () => {
          try {
            if (navigator.share) {
              await navigator.share({ title, url: window.location.href });
            } else {
              await navigator.clipboard.writeText(window.location.href);
              setMessage("Link copied.");
            }
          } catch (error) {
            if (error instanceof Error && error.name !== "AbortError")
              setMessage("Unable to share. Copy the link from your browser.");
          }
        }}
      >
        <Share2 size={16} />
        Share event
      </button>
      {message && (
        <p role="status" className="text-xs mt-2">
          {message}
        </p>
      )}
    </div>
  );
}
