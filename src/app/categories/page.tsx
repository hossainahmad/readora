import Link from "next/link";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories | BookNest",
  description: "Browse books by category in the Readora collection.",
};

export default async function CategoriesPage() {
  const db = await getDb();
  const [categories, totals] = await Promise.all([
    db.collection("categories").find().sort({ name: 1 }).toArray(),
    db
      .collection("books")
      .aggregate([
        { $unwind: "$category_slugs" },
        { $group: { _id: "$category_slugs", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);
  const bookCounts = new Map(
    totals.map((total) => [total._id as string, total.count as number]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="border-b border-neutral-200 pb-6">
        <p className="text-sm font-semibold uppercase text-amber-800">
          Find your next shelf
        </p>
        <h1 className="mt-2 text-3xl font-bold">Categories</h1>
      </header>
      <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category._id.toString()}
            href={`/categories/${category.slug}`}
            className="group flex items-center justify-between gap-4 border-b border-neutral-200 py-5 focus-visible:outline-2 focus-visible:outline-amber-800"
          >
            <span className="text-lg font-semibold group-hover:text-amber-800">
              {category.name}
            </span>
            <span className="text-sm text-neutral-500">
              {bookCounts.get(category.slug) ?? 0} books
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
