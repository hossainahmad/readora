import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { error: "Sign in to sync reading progress." },
      { status: 401 },
    );
  }

  let body: {
    bookSlug?: unknown;
    chapterOrder?: unknown;
    position?: unknown;
    percent?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body.bookSlug !== "string" ||
    !body.bookSlug.trim() ||
    !Number.isInteger(body.chapterOrder) ||
    (body.chapterOrder as number) < 1 ||
    typeof body.position !== "number" ||
    !Number.isFinite(body.position) ||
    body.position < 0 ||
    body.position > 50_000_000 ||
    typeof body.percent !== "number" ||
    !Number.isFinite(body.percent) ||
    body.percent < 0 ||
    body.percent > 100
  ) {
    return Response.json(
      { error: "Invalid reading progress." },
      { status: 400 },
    );
  }

  const db = await getDb();
  const book = await db.collection("books").findOne({ slug: body.bookSlug });
  if (!book) {
    return Response.json({ error: "Book not found." }, { status: 404 });
  }

  const chapter = await db.collection("chapters").findOne({
    book_id: book._id,
    order: body.chapterOrder,
  });
  if (!chapter) {
    return Response.json({ error: "Chapter not found." }, { status: 404 });
  }

  const now = new Date();
  await db.collection("reading_progress").updateOne(
    { user_id: session.user.id, book_id: book._id },
    {
      $set: {
        chapter_id: chapter._id,
        chapter_order: body.chapterOrder,
        position: body.position,
        percent: body.percent,
        updated_at: now,
      },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  return Response.json({ saved: true });
}
