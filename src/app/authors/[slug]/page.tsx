import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type AuthorPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: AuthorPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const author = await db.collection("authors").findOne({ slug });

  return author
    ? { title: `${author.name} | BookNest`, description: author.bio }
    : { title: "Author not found | BookNest" };
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const db = await getDb();
  const author = await db.collection("authors").findOne({ slug });
  if (!author) notFound();

  const books = await db
    .collection("books")
    .find({ author: slug })
    .sort({ published_year: -1, title: 1 })
    .toArray();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href="/authors" className="hover:text-neutral-900">
          Authors
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-800">{author.name}</span>
      </nav>
      <header className="max-w-3xl border-b border-neutral-200 py-8">
        <p className="text-sm font-semibold uppercase text-amber-800">Author</p>
        <h1 className="mt-2 text-4xl font-bold">{author.name}</h1>
        <p className="mt-4 leading-7 text-neutral-700">{author.bio}</p>
        {(author.born || author.died) && (
          <p className="mt-4 text-sm text-neutral-500">
            {author.born ? `Born ${author.born}` : ""}
            {author.born && author.died ? " · " : ""}
            {author.died ? `Died ${author.died}` : ""}
          </p>
        )}
      </header>
      <section className="py-8">
        <h2 className="text-2xl font-bold">Books by {author.name}</h2>
        {books.length ? (
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
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
          <p className="mt-4 text-sm text-neutral-600">
            No books are listed for this author yet.
          </p>
        )}
      </section>
    </div>
  );
}
