"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/authors", label: "Authors" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="text-xl font-bold">
          📚 BookNest
        </Link>
        <div className="hidden gap-4 text-sm text-neutral-600 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-neutral-900">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {isPending ? null : session ? (
            <>
              <span className="text-sm text-neutral-600">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
