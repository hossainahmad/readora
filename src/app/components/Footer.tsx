import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">📚 BookNest</p>
          <p className="mt-2 text-sm text-neutral-500">
            Discover and read great books, comfortably.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Browse</p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-500">
            <li>
              <Link href="/books" className="hover:text-neutral-800">
                All books
              </Link>
            </li>
            <li>
              <Link href="/authors" className="hover:text-neutral-800">
                Authors
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-neutral-800">
                Categories
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">About</p>
          <p className="mt-2 text-sm text-neutral-500">
            A cozy home for readers. Built with love for books.
          </p>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} BookNest. All rights reserved.
      </p>
    </footer>
  );
}
