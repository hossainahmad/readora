import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

const libraryStatuses = ["want_to_read", "reading", "finished"] as const;

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { error: "Sign in to update your library." },
      { status: 401 },
    );
  }

  let body: { bookSlug?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body.bookSlug !== "string" ||
    !body.bookSlug.trim() ||
    typeof body.status !== "string" ||
    !libraryStatuses.includes(body.status as (typeof libraryStatuses)[number])
  ) {
    return Response.json(
      { error: "Choose a valid book and shelf." },
      { status: 400 },
    );
  }

  const db = await getDb();
  const book = await db.collection("books").findOne({ slug: body.bookSlug });
  if (!book) {
    return Response.json({ error: "Book not found." }, { status: 404 });
  }

  const now = new Date();
  await db.collection("library").updateOne(
    { user_id: session.user.id, book_id: book._id },
    {
      $set: { status: body.status, updated_at: now },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  return Response.json({ status: body.status });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { error: "Sign in to update your library." },
      { status: 401 },
    );
  }

  let body: { bookSlug?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.bookSlug !== "string" || !body.bookSlug.trim()) {
    return Response.json({ error: "Choose a valid book." }, { status: 400 });
  }

  const db = await getDb();
  const book = await db.collection("books").findOne({ slug: body.bookSlug });
  if (!book) {
    return Response.json({ error: "Book not found." }, { status: 404 });
  }

  await db.collection("library").deleteOne({
    user_id: session.user.id,
    book_id: book._id,
  });
  return Response.json({ removed: true });
}
