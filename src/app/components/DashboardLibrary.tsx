"use client";

import Link from "next/link";
import { useState } from "react";

export type DashboardBook = {
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  status: "want_to_read" | "reading" | "finished";
  progressPercent: number;
  chapterOrder: number;
};

const statusLabels = {
  want_to_read: "Want to read",
  reading: "Reading",
  finished: "Finished",
} as const;

export default function DashboardLibrary({
  initialBooks,
}: {
  initialBooks: DashboardBook[];
}) {
  const [books, setBooks] = useState(initialBooks);
  const [message, setMessage] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  async function updateStatus(
    bookSlug: string,
    status: DashboardBook["status"],
  ) {
    setBusySlug(bookSlug);
    setMessage("");
    try {
      const response = await fetch("/api/library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, status }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not update your shelf.");
      setBooks((current) =>
        current.map((book) =>
          book.slug === bookSlug ? { ...book, status } : book,
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update your shelf.",
      );
    } finally {
      setBusySlug(null);
    }
  }

  async function removeBook(bookSlug: string) {
    setBusySlug(bookSlug);
    setMessage("");
    try {
      const response = await fetch("/api/library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not remove this book.");
      setBooks((current) => current.filter((book) => book.slug !== bookSlug));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not remove this book.",
      );
    } finally {
      setBusySlug(null);
    }
  }

  if (books.length === 0) {
    return (
      <div className="border-y border-neutral-200 py-12 text-center">
        <p className="font-serif text-xl">Your shelves are waiting.</p>
        <p className="mt-2 text-sm text-neutral-600">
          Browse the catalog and save a book to get started.
        </p>
        <Link
          href="/books"
          className="mt-5 inline-block text-sm font-semibold text-amber-900 underline underline-offset-4"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <>
      {message && (
        <p role="alert" className="mb-4 text-sm text-red-800">
          {message}
        </p>
      )}
      <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
        {books.map((book) => (
          <li
            key={book.slug}
            className="grid gap-4 py-5 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"
          >
            <Link
              href={`/books/${book.slug}`}
              className="block w-20 overflow-hidden bg-neutral-100 sm:w-16"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="aspect-2/3 w-full object-cover"
              />
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-amber-900">
                {statusLabels[book.status]}
              </p>
              <Link
                href={`/books/${book.slug}`}
                className="mt-1 block truncate font-serif text-xl font-semibold hover:underline"
              >
                {book.title}
              </Link>
              <p className="mt-1 text-sm text-neutral-600">{book.author}</p>
              {book.progressPercent > 0 && (
                <div className="mt-3 max-w-sm">
                  <div className="mb-1 flex justify-between text-xs text-neutral-500">
                    <span>Reading progress</span>
                    <span>{book.progressPercent}%</span>
                  </div>
                  <div
                    className="h-1.5 bg-neutral-200"
                    role="progressbar"
                    aria-label={`${book.title} reading progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={book.progressPercent}
                  >
                    <div
                      className="h-full bg-amber-800"
                      style={{ width: `${book.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <Link
                href={`/read/${book.slug}/${book.chapterOrder}`}
                className="text-sm font-semibold text-amber-900 underline underline-offset-4"
              >
                {book.progressPercent > 0 ? "Continue" : "Start reading"}
              </Link>
              <label className="sr-only" htmlFor={`shelf-${book.slug}`}>
                Shelf for {book.title}
              </label>
              <select
                id={`shelf-${book.slug}`}
                value={book.status}
                disabled={busySlug === book.slug}
                onChange={(event) =>
                  updateStatus(
                    book.slug,
                    event.target.value as DashboardBook["status"],
                  )
                }
                className="border border-neutral-300 bg-white px-2 py-1.5 text-sm"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeBook(book.slug)}
                disabled={busySlug === book.slug}
                className="text-sm text-neutral-500 underline underline-offset-4 hover:text-red-800 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
