import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type CategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const category = await db.collection("categories").findOne({ slug });

  return category
    ? {
        title: `${category.name} Books | BookNest`,
        description: `Browse books in the ${category.name} category.`,
      }
    : { title: "Category not found | BookNest" };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const category = await db.collection("categories").findOne({ slug });
  if (!category) notFound();

  const books = await db
    .collection("books")
    .find({ category_slugs: slug })
    .sort({ rating_avg: -1, title: 1 })
    .toArray();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href="/categories" className="hover:text-neutral-900">
          Categories
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-800">{category.name}</span>
      </nav>
      <header className="border-b border-neutral-200 py-8">
        <p className="text-sm font-semibold uppercase text-amber-800">
          Browse by category
        </p>
        <h1 className="mt-2 text-4xl font-bold">{category.name}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {books.length} {books.length === 1 ? "book" : "books"}
        </p>
      </header>
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
              category={category.name}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-sm text-neutral-600">
          No books are listed in this category yet.
        </p>
      )}
    </div>
  );
}
