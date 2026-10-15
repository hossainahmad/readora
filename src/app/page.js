import Link from "next/link";
import { getDb } from "@/lib/db";
import BookCard from "@/components/BookCard";

export const dynamic = "force-dynamic"; // DB isn't available at build time

export default async function HomePage() {
  const db = await getDb();
  const books = await db
    .collection("books")
    .find({ featured: true })
    .sort({ rating_avg: -1 })
    .limit(8)
    .toArray();

  return (
    <>
      <section className="bg-linear-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Discover your next great read
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Browse a growing library and read in a comfortable, distraction-free
            reader.
          </p>
          <form action="/books" className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="search"
              name="q"
              aria-label="Search books and authors"
              placeholder="Search books and authors"
              className="min-w-0 flex-1 rounded border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
            <button className="rounded bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-700">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <Link
            href="/books"
            className="text-sm font-medium text-amber-800 underline underline-offset-4"
          >
            Browse all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard
              key={b._id.toString()}
              slug={b.slug}
              title={b.title}
              author={b.author_name}
              coverUrl={b.cover_url}
              rating={b.rating_avg}
              category={b.category_names?.[0]}
            />
          ))}
        </div>
        {books.length === 0 && (
          <p className="py-10 text-center text-neutral-500">
            No books yet — run `npm run seed`.
          </p>
        )}
      </section>
    </>
  );
}
