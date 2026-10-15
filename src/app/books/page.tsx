import Link from "next/link";
import type { Document, Filter, Sort } from "mongodb";
import BookCard from "@/components/BookCard";
import CatalogFilters from "@/components/CatalogFilters";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
}>;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const queryText = typeof params.q === "string" ? params.q.trim() : "";
  const categorySlug =
    typeof params.category === "string" ? params.category : "";
  const sortValue = typeof params.sort === "string" ? params.sort : "popular";
  const filter: Filter<Document> = {};

  if (queryText) {
    const expression = { $regex: escapeRegex(queryText), $options: "i" };
    filter.$or = [
      { title: expression },
      { author_name: expression },
      { description: expression },
    ];
  }

  if (categorySlug) filter.category_slugs = categorySlug;

  const sortOptions: Record<string, Sort> = {
    popular: { featured: -1, rating_avg: -1 },
    newest: { published_year: -1, title: 1 },
    az: { title: 1 },
    rating: { rating_avg: -1, title: 1 },
  };

  const db = await getDb();
  const [books, categories] = await Promise.all([
    db
      .collection("books")
      .find(filter)
      .sort(sortOptions[sortValue] ?? sortOptions.popular)
      .toArray(),
    db.collection("categories").find().sort({ name: 1 }).toArray(),
  ]);
  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="border-b border-neutral-200 pb-7">
        <p className="text-sm font-semibold uppercase text-amber-800">
          The catalog
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Browse books</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {books.length} {books.length === 1 ? "book" : "books"}
              {selectedCategory ? ` in ${selectedCategory.name}` : ""}
              {queryText ? ` matching “${queryText}”` : " in the collection"}
            </p>
          </div>
        </div>
      </header>

      <CatalogFilters
        categories={categories.map((category) => ({
          slug: category.slug,
          name: category.name,
        }))}
        initialQuery={queryText}
        initialCategory={categorySlug}
        initialSort={sortValue}
      />

      {books.length ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-8 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book._id.toString()}
              slug={book.slug}
              title={book.title}
              author={book.author_name}
              coverUrl={book.cover_url}
              rating={book.rating_avg}
              category={book.category_names?.[0]}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">No books found</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Try a different search or remove a filter.
          </p>
          <Link
            href="/books"
            className="mt-4 inline-block text-sm font-semibold text-amber-800 underline underline-offset-4"
          >
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
