import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing");
const client = new MongoClient(uri);
const DB_NAME = process.env.MONGODB_DB ?? "booknest";

const cover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

const authors = [
  {
    slug: "jane-austen",
    name: "Jane Austen",
    born: 1775,
    died: 1817,
    bio: "English novelist known for wit and sharp social commentary.",
  },
  {
    slug: "herman-melville",
    name: "Herman Melville",
    born: 1819,
    died: 1891,
    bio: "American writer of sea adventures and philosophical fiction.",
  },
  {
    slug: "arthur-conan-doyle",
    name: "Arthur Conan Doyle",
    born: 1859,
    died: 1930,
    bio: "Creator of Sherlock Holmes, the world's most famous detective.",
  },
  {
    slug: "mary-shelley",
    name: "Mary Shelley",
    born: 1797,
    died: 1851,
    bio: "Pioneer of science fiction with her debut novel Frankenstein.",
  },
  {
    slug: "bram-stoker",
    name: "Bram Stoker",
    born: 1847,
    died: 1912,
    bio: "Irish author whose Dracula defined vampire fiction.",
  },
  {
    slug: "f-scott-fitzgerald",
    name: "F. Scott Fitzgerald",
    born: 1896,
    died: 1940,
    bio: "Chronicler of the Jazz Age and its disillusionments.",
  },
  {
    slug: "charlotte-bronte",
    name: "Charlotte Brontë",
    born: 1816,
    died: 1855,
    bio: "Author of Jane Eyre, a landmark of English literature.",
  },
  {
    slug: "emily-bronte",
    name: "Emily Brontë",
    born: 1818,
    died: 1848,
    bio: "Wrote Wuthering Heights, one of the great gothic romances.",
  },
  {
    slug: "robert-louis-stevenson",
    name: "Robert Louis Stevenson",
    born: 1850,
    died: 1894,
    bio: "Master of adventure tales and dark psychological fiction.",
  },
  {
    slug: "lewis-carroll",
    name: "Lewis Carroll",
    born: 1832,
    died: 1898,
    bio: "Mathematician turned storyteller of Wonderland's nonsense.",
  },
];

const categories = [
  { slug: "classics", name: "Classics" },
  { slug: "fiction", name: "Fiction" },
  { slug: "mystery", name: "Mystery" },
  { slug: "romance", name: "Romance" },
  { slug: "horror", name: "Horror" },
  { slug: "gothic", name: "Gothic" },
  { slug: "adventure", name: "Adventure" },
  { slug: "childrens", name: "Children's" },
];

const books = [
  {
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    description:
      "Spirited Elizabeth Bennet navigates love, class, and first impressions in Regency England.",
    isbn: "9780141439518",
    author: "jane-austen",
    author_name: "Jane Austen",
    category_slugs: ["classics", "romance"],
    category_names: ["Classics", "Romance"],
    published_year: 1813,
    pages: 432,
    rating_avg: 4.5,
    featured: true,
  },
  {
    slug: "moby-dick",
    title: "Moby-Dick",
    description:
      "A sailor's obsession-fueled hunt for the white whale that scarred him.",
    isbn: "9781853260087",
    author: "herman-melville",
    author_name: "Herman Melville",
    category_slugs: ["classics", "adventure"],
    category_names: ["Classics", "Adventure"],
    published_year: 1851,
    pages: 720,
    rating_avg: 4.1,
    featured: true,
  },
  {
    slug: "the-adventures-of-sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    description:
      "Twelve cases of deduction, disguise, and Victorian London fog.",
    isbn: "9780553212419",
    author: "arthur-conan-doyle",
    author_name: "Arthur Conan Doyle",
    category_slugs: ["mystery", "classics"],
    category_names: ["Mystery", "Classics"],
    published_year: 1892,
    pages: 307,
    rating_avg: 4.5,
    featured: true,
  },
  {
    slug: "frankenstein",
    title: "Frankenstein",
    description:
      "A scientist's creation turns on him in the founding tale of science gone wrong.",
    isbn: "9780486282114",
    author: "mary-shelley",
    author_name: "Mary Shelley",
    category_slugs: ["horror", "gothic", "classics"],
    category_names: ["Horror", "Gothic", "Classics"],
    published_year: 1818,
    pages: 280,
    rating_avg: 4.3,
    featured: false,
  },
  {
    slug: "dracula",
    title: "Dracula",
    description:
      "Letters and diaries chronicle the Count's move from Transylvania to England.",
    isbn: "9780486411095",
    author: "bram-stoker",
    author_name: "Bram Stoker",
    category_slugs: ["horror", "gothic"],
    category_names: ["Horror", "Gothic"],
    published_year: 1897,
    pages: 418,
    rating_avg: 4.2,
    featured: false,
  },
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    description:
      "Jay Gatsby throws lavish parties chasing a dream just out of reach.",
    isbn: "9780743273565",
    author: "f-scott-fitzgerald",
    author_name: "F. Scott Fitzgerald",
    category_slugs: ["fiction", "classics"],
    category_names: ["Fiction", "Classics"],
    published_year: 1925,
    pages: 180,
    rating_avg: 4.2,
    featured: true,
  },
  {
    slug: "jane-eyre",
    title: "Jane Eyre",
    description:
      "An orphaned governess insists on equality — and love — on her own terms.",
    isbn: "9780141441146",
    author: "charlotte-bronte",
    author_name: "Charlotte Brontë",
    category_slugs: ["romance", "gothic", "classics"],
    category_names: ["Romance", "Gothic", "Classics"],
    published_year: 1847,
    pages: 528,
    rating_avg: 4.4,
    featured: true,
  },
  {
    slug: "wuthering-heights",
    title: "Wuthering Heights",
    description:
      "A destructive, all-consuming love plays out on the Yorkshire moors.",
    isbn: "9780141439556",
    author: "emily-bronte",
    author_name: "Emily Brontë",
    category_slugs: ["romance", "gothic", "classics"],
    category_names: ["Romance", "Gothic", "Classics"],
    published_year: 1847,
    pages: 416,
    rating_avg: 4.0,
    featured: false,
  },
  {
    slug: "treasure-island",
    title: "Treasure Island",
    description:
      "Young Jim Hawkins joins a hunt for pirate gold — with a mutineer as cook.",
    isbn: "9780486275598",
    author: "robert-louis-stevenson",
    author_name: "Robert Louis Stevenson",
    category_slugs: ["adventure", "classics"],
    category_names: ["Adventure", "Classics"],
    published_year: 1883,
    pages: 240,
    rating_avg: 4.2,
    featured: false,
  },
  {
    slug: "alices-adventures-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    description:
      "A curious girl falls down a rabbit hole into a world of nonsense.",
    isbn: "9780141439761",
    author: "lewis-carroll",
    author_name: "Lewis Carroll",
    category_slugs: ["childrens", "classics"],
    category_names: ["Children's", "Classics"],
    published_year: 1865,
    pages: 176,
    rating_avg: 4.1,
    featured: true,
  },
];

async function seed() {
  await client.connect();
  const db = client.db(DB_NAME);

  await Promise.all([
    db.collection("authors").deleteMany({}),
    db.collection("categories").deleteMany({}),
    db.collection("books").deleteMany({}),
  ]);

  const authorIds: Record<string, ObjectId> = {};
  const aRes = await db
    .collection("authors")
    .insertMany(authors.map((a) => ({ ...a, created_at: new Date() })));
  authors.forEach(
    (a, i) => (authorIds[a.slug] = aRes.insertedIds[i] as ObjectId),
  );

  const categoryIds: Record<string, ObjectId> = {};
  const cRes = await db
    .collection("categories")
    .insertMany(categories.map((c) => ({ ...c, created_at: new Date() })));
  categories.forEach(
    (c, i) => (categoryIds[c.slug] = cRes.insertedIds[i] as ObjectId),
  );

  await db.collection("books").insertMany(
    books.map((b) => ({
      ...b,
      cover_url: cover(b.isbn),
      author_id: authorIds[b.author],
      category_ids: b.category_slugs.map((s) => categoryIds[s]),
      created_at: new Date(),
      updated_at: new Date(),
    })),
  );

  await db.collection("books").createIndex({ slug: 1 }, { unique: true });
  await db
    .collection("books")
    .createIndex({ title: "text", description: "text", author_name: "text" });
  await db.collection("books").createIndex({ author_id: 1 });
  await db.collection("authors").createIndex({ slug: 1 }, { unique: true });
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });

  console.log(
    `✅ Seeded ${books.length} books, ${authors.length} authors, ${categories.length} categories`,
  );
  await client.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
