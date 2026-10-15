import Link from "next/link";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Authors | BookNest",
  description: "Explore the authors represented in the Readora collection.",
};

export default async function AuthorsPage() {
  const db = await getDb();
  const [authors, totals] = await Promise.all([
    db.collection("authors").find().sort({ name: 1 }).toArray(),
    db
      .collection("books")
      .aggregate([{ $group: { _id: "$author", count: { $sum: 1 } } }])
      .toArray(),
  ]);
  const bookCounts = new Map(
    totals.map((total) => [total._id as string, total.count as number]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="border-b border-neutral-200 pb-6">
        <p className="text-sm font-semibold uppercase text-amber-800">
          The people behind the pages
        </p>
        <h1 className="mt-2 text-3xl font-bold">Authors</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {authors.length} authors in the collection
        </p>
      </header>

      <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author._id.toString()}
            href={`/authors/${author.slug}`}
            className="group border-b border-neutral-200 py-6 focus-visible:outline-2 focus-visible:outline-amber-800"
          >
            <h2 className="text-xl font-semibold group-hover:text-amber-800">
              {author.name}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
              {author.bio}
            </p>
            <p className="mt-3 text-xs font-medium uppercase text-neutral-500">
              {bookCounts.get(author.slug) ?? 0} books
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
