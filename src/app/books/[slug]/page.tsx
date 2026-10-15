import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type BookPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const book = await db.collection("books").findOne({ slug });

  return book
    ? { title: `${book.title} | BookNest`, description: book.description }
    : { title: "Book not found | BookNest" };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const book = await db.collection("books").findOne({ slug });
  if (!book) notFound();

  const categorySlugs: string[] = book.category_slugs ?? [];
  const [author, categories, similarBooks] = await Promise.all([
    db.collection("authors").findOne({ slug: book.author }),
    db
      .collection("categories")
      .find({ slug: { $in: categorySlugs } })
      .sort({ name: 1 })
      .toArray(),
    categorySlugs.length
      ? db
          .collection("books")
          .find({
            slug: { $ne: book.slug },
            category_slugs: { $in: categorySlugs },
          })
          .sort({ rating_avg: -1 })
          .limit(4)
          .toArray()
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href="/books" className="hover:text-neutral-900">
          Books
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-800">{book.title}</span>
      </nav>

      <article className="grid gap-8 py-8 md:grid-cols-[minmax(15rem,0.8fr)_1.2fr] md:gap-12">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-md bg-neutral-100 md:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            className="aspect-2/3 w-full object-cover"
          />
        </div>
        <div className="self-center">
          {book.category_names?.[0] && (
            <p className="text-sm font-semibold uppercase text-amber-800">
              {book.category_names[0]}
            </p>
          )}
          <h1 className="mt-2 text-4xl font-bold">{book.title}</h1>
          {author && (
            <p className="mt-3 text-lg text-neutral-600">
              by{" "}
              <Link
                href={`/authors/${author.slug}`}
                className="font-medium text-neutral-900 underline underline-offset-4"
              >
                {author.name}
              </Link>
            </p>
          )}
          <p className="mt-4 text-amber-700">
            <span aria-label={`${book.rating_avg} out of 5 stars`}>
              ★ {Number(book.rating_avg ?? 0).toFixed(1)}
            </span>
          </p>
          <p className="mt-6 max-w-2xl leading-7 text-neutral-700">
            {book.description}
          </p>
          <dl className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-y border-neutral-200 py-5 text-sm">
            {book.published_year && (
              <div>
                <dt className="text-neutral-500">Published</dt>
                <dd className="mt-1 font-medium">{book.published_year}</dd>
              </div>
            )}
            {book.pages && (
              <div>
                <dt className="text-neutral-500">Pages</dt>
                <dd className="mt-1 font-medium">{book.pages}</dd>
              </div>
            )}
            {book.isbn && (
              <div>
                <dt className="text-neutral-500">ISBN</dt>
                <dd className="mt-1 font-medium">{book.isbn}</dd>
              </div>
            )}
          </dl>
          {categories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="text-amber-800 underline underline-offset-4"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>

      {similarBooks.length > 0 && (
        <section className="border-t border-neutral-200 py-8">
          <h2 className="text-2xl font-bold">You might also like</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {similarBooks.map((relatedBook) => (
              <BookCard
                key={relatedBook._id.toString()}
                slug={relatedBook.slug}
                title={relatedBook.title}
                author={relatedBook.author_name}
                coverUrl={relatedBook.cover_url}
                rating={relatedBook.rating_avg}
                category={relatedBook.category_names?.[0]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
