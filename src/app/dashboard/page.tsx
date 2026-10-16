import { redirect } from "next/navigation";
import DashboardLibrary, {
  type DashboardBook,
} from "@/components/DashboardLibrary";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Library | BookNest" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = await getDb();
  const entries = await db
    .collection("library")
    .find({ user_id: session.user.id })
    .sort({ updated_at: -1 })
    .toArray();
  const bookIds = entries.map((entry) => entry.book_id);
  const [books, progress] = await Promise.all([
    bookIds.length
      ? db
          .collection("books")
          .find({ _id: { $in: bookIds } })
          .toArray()
      : Promise.resolve([]),
    db
      .collection("reading_progress")
      .find({ user_id: session.user.id })
      .toArray(),
  ]);

  const booksById = new Map(books.map((book) => [book._id.toString(), book]));
  const progressByBook = new Map(
    progress.map((item) => [item.book_id.toString(), item]),
  );
  const libraryBooks: DashboardBook[] = entries.flatMap((entry) => {
    const book = booksById.get(entry.book_id.toString());
    if (!book) return [];
    const savedProgress = progressByBook.get(entry.book_id.toString());
    const status = ["want_to_read", "reading", "finished"].includes(
      entry.status,
    )
      ? entry.status
      : "want_to_read";
    return [
      {
        slug: book.slug,
        title: book.title,
        author: book.author_name,
        coverUrl: book.cover_url,
        status: status as DashboardBook["status"],
        progressPercent: Math.min(
          100,
          Math.max(0, Number(savedProgress?.percent) || 0),
        ),
        chapterOrder: Math.max(1, Number(savedProgress?.chapter_order) || 1),
      },
    ];
  });
  const counts = {
    reading: libraryBooks.filter((book) => book.status === "reading").length,
    wantToRead: libraryBooks.filter((book) => book.status === "want_to_read")
      .length,
    finished: libraryBooks.filter((book) => book.status === "finished").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="border-b border-neutral-300 pb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-900">
          Reading room
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">My library</h1>
        <p className="mt-2 text-neutral-600">
          Welcome back, {session.user.name}.
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="inline text-neutral-500">Reading </dt>
            <dd className="inline font-semibold">{counts.reading}</dd>
          </div>
          <div>
            <dt className="inline text-neutral-500">Want to read </dt>
            <dd className="inline font-semibold">{counts.wantToRead}</dd>
          </div>
          <div>
            <dt className="inline text-neutral-500">Finished </dt>
            <dd className="inline font-semibold">{counts.finished}</dd>
          </div>
        </dl>
      </header>
      <section className="pt-7" aria-labelledby="shelves-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2
            id="shelves-heading"
            className="font-serif text-2xl font-semibold"
          >
            Your shelves
          </h2>
          <span className="text-sm text-neutral-500">
            {libraryBooks.length} {libraryBooks.length === 1 ? "book" : "books"}
          </span>
        </div>
        <DashboardLibrary initialBooks={libraryBooks} />
      </section>
    </div>
  );
}
