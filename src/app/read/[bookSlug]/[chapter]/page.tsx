import { notFound } from "next/navigation";
import ReaderExperience from "@/components/ReaderExperience";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type ReaderPageProps = {
  params: Promise<{ bookSlug: string; chapter: string }>;
};

export async function generateMetadata({ params }: ReaderPageProps) {
  const { bookSlug, chapter } = await params;
  const db = await getDb();
  const book = await db.collection("books").findOne({ slug: bookSlug });
  if (!book) return { title: "Reader | BookNest" };

  const order = Number(chapter);
  const chapterData = Number.isInteger(order)
    ? await db.collection("chapters").findOne({ book_id: book._id, order })
    : null;

  return {
    title: chapterData
      ? `${chapterData.title} | ${book.title}`
      : `Read ${book.title} | BookNest`,
  };
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { bookSlug, chapter } = await params;
  const chapterOrder = Number(chapter);
  if (!Number.isInteger(chapterOrder) || chapterOrder < 1) notFound();

  const db = await getDb();
  const book = await db.collection("books").findOne({ slug: bookSlug });
  if (!book) notFound();

  const chapters = await db
    .collection("chapters")
    .find({ book_id: book._id })
    .sort({ order: 1 })
    .toArray();
  const currentIndex = chapters.findIndex(
    (item) => item.order === chapterOrder,
  );
  if (currentIndex < 0) notFound();

  const activeChapter = chapters[currentIndex];
  return (
    <ReaderExperience
      bookSlug={book.slug}
      bookTitle={book.title}
      chapterTitle={activeChapter.title}
      chapterContent={
        typeof activeChapter.content === "string"
          ? activeChapter.content
          : "This chapter does not have readable content yet."
      }
      chapterOrder={activeChapter.order}
      chapters={chapters.map((item) => ({
        order: item.order,
        title: item.title,
      }))}
      previousOrder={chapters[currentIndex - 1]?.order}
      nextOrder={chapters[currentIndex + 1]?.order}
      isSample={activeChapter.is_sample === true}
    />
  );
}
