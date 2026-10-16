"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

type LibraryStatus = "want_to_read" | "reading" | "finished";

const statusLabels: Record<LibraryStatus, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export default function LibraryAction({
  bookSlug,
  initialStatus,
}: {
  bookSlug: string;
  initialStatus: LibraryStatus | null;
}) {
  const { data: session, isPending } = useSession();
  const [status, setStatus] = useState<LibraryStatus | "">(initialStatus ?? "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (isPending) return null;
  if (!session) {
    return (
      <Link
        href="/login"
        className="text-sm font-semibold text-amber-900 underline underline-offset-4"
      >
        Sign in to add this book to your library
      </Link>
    );
  }

  async function saveBook() {
    if (!status) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, status }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not update library.");
      setMessage("Saved to your library.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update library.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="grid gap-1 text-xs font-semibold uppercase text-neutral-600">
        <span>My shelf</span>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as LibraryStatus | "")
          }
          className="min-w-44 border border-neutral-300 bg-white px-3 py-2 text-sm font-medium normal-case text-neutral-900"
        >
          <option value="">Choose a shelf</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={saveBook}
        disabled={!status || saving}
        className="bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save to shelf"}
      </button>
      {message && (
        <p role="status" className="basis-full text-sm text-neutral-600">
          {message}
        </p>
      )}
    </div>
  );
}
