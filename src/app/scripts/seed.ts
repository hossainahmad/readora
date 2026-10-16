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

const chapterSamples: Record<string, { title: string; content: string }[]> = {
  "pride-and-prejudice": [
    {
      title: "An Unexpected Invitation",
      content:
        "A letter arrived at Longbourn just as the household was settling into its ordinary rhythm. Its news was small in itself, yet it sent every conversation toward the new neighbor and the gathering planned for the week.\n\nElizabeth listened with an amused patience, more interested in the certainty with which others judged a person they had not met. By evening, curiosity had become the chief guest at the family table.",
    },
    {
      title: "A First Impression",
      content:
        "The assembly rooms glowed with candlelight, and introductions moved from one group to another. Elizabeth watched the evening unfold with the alertness of someone who preferred observation to ceremony.\n\nA brief exchange left her with a firm opinion of the proud stranger. It was an opinion she carried away lightly, not knowing how often the smallest judgment can ask to be reconsidered.",
    },
  ],
  "moby-dick": [
    {
      title: "A Room by the Harbor",
      content:
        "The wind off the water followed the traveler through the narrow streets and into a crowded inn. He had come seeking work and a horizon wide enough to quiet the restless thoughts that had brought him there.\n\nAmong the sailors, one quiet man stood apart. Their first conversation was cautious, but the night made room for an unexpected friendship.",
    },
    {
      title: "A Ship at Dawn",
      content:
        "At daybreak the harbor stirred with ropes, gulls, and the low calls of men preparing to leave. The Pequod waited beyond the pier, its dark timbers carrying the marks of many voyages.\n\nThe crew gathered beneath a pale sky while their captain remained unseen. Every face seemed to hold a different reason for going, and none yet knew how singular the voyage would become.",
    },
  ],
  "the-adventures-of-sherlock-holmes": [
    {
      title: "The Visitor's Calling Card",
      content:
        "A visitor left a card on the sitting-room table, though no one had seen him enter. Holmes studied the paper, then the faint dust along its edge, as if the small object had arrived carrying a complete account of its journey.\n\nWatson offered the obvious explanation. Holmes smiled, not because it was foolish, but because it overlooked the one detail that did not belong.",
    },
    {
      title: "A Clue in the Rain",
      content:
        "Rain blurred the tracks outside the house, turning the lane to a dark ribbon. Holmes crouched beside the gate and examined a mark nearly washed away.\n\nThe clue was not a footprint but the space between two of them. When he stood, his attention had already moved from the muddy path to the upstairs window.",
    },
  ],
  frankenstein: [
    {
      title: "Letters from the North",
      content:
        "The ship pressed through a field of ice while its crew searched the white distance for a safe passage. In the captain's cabin, a stranger spoke of a pursuit that had outlasted every sensible hope.\n\nHis voice weakened as the wind rose. Still, he insisted that the story be heard from the beginning, before the frozen sea decided how it would end.",
    },
    {
      title: "The Spark in the Workshop",
      content:
        "For months the student had shut himself away among instruments and notebooks. Each discovery narrowed his world until the work seemed to be the only thing left in it.\n\nOn a storm-lit night, the room answered his labor with a movement he had imagined a thousand times. The moment he had wanted most arrived without the triumph he expected.",
    },
  ],
  dracula: [
    {
      title: "The Road East",
      content:
        "The train carried the young solicitor away from familiar streets and into a country of steep valleys and sudden shadows. At every stop, the people he met offered a warning in a different way.\n\nHe thanked them politely and kept his appointment. The road ahead grew quieter as the mountains gathered close around it.",
    },
    {
      title: "A Shadow at the Window",
      content:
        "The castle was larger inside than its silent halls suggested from the road. His host received him with courtesy, yet the doors seemed to close behind them one by one.\n\nThat night, a movement beyond the window held his attention. The moon showed the stone wall empty, but the feeling of being watched did not pass.",
    },
  ],
  "the-great-gatsby": [
    {
      title: "Across the Bay",
      content:
        "From the small house, the neighbor's parties appeared as bright weather on the far shore. Music crossed the water in fragments, joined by laughter and the restless hum of cars arriving after dark.\n\nThe host remained a mystery to most of the guests. Their stories about him changed with each telling, while the lights at his windows never seemed to dim.",
    },
    {
      title: "An Invitation in Blue Ink",
      content:
        "The invitation was written in careful blue ink and delivered without explanation. Its sender had been a familiar name for weeks, though a real conversation had never taken place.\n\nBy evening, the garden was full of strangers who behaved like old friends. The host watched the crowd from a little distance, waiting for one arrival in particular.",
    },
  ],
  "jane-eyre": [
    {
      title: "The Red Room's Echo",
      content:
        "The house was quiet except for the clock and the wind worrying at the windows. In the red room, every polished surface returned a distorted reflection of the child who had been sent there.\n\nShe tried to be brave, but loneliness gave ordinary shadows the weight of warning. When the door finally opened, the room had already become a place she would remember.",
    },
    {
      title: "A Place at Thornfield",
      content:
        "The new position offered a long road, a different household, and the chance to begin again. Thornfield stood on the hill with its windows catching the late light, composed and difficult to read.\n\nThe first days passed in lessons and quiet routines. Then a sound from the upper floor interrupted the calm, followed by a laugh that no one was willing to explain.",
    },
  ],
  "wuthering-heights": [
    {
      title: "A Visit to the Heights",
      content:
        "The house on the ridge looked built to withstand weather rather than welcome visitors. Its windows faced the open moor, where the wind moved over the grass without meeting a tree.\n\nInside, the greetings were spare and the silences long. The newcomer sensed that the household had kept its own history for years, closed against anyone who might ask about it.",
    },
    {
      title: "Names in the Margins",
      content:
        "A few names had been written again and again in the margins of an old book. The letters were uneven, sometimes pressed so hard they marked the page beneath.\n\nReading them in the fading light, the visitor began to imagine a life tied to the house by more than family. The moor outside answered only with the sound of rain.",
    },
  ],
  "treasure-island": [
    {
      title: "The Map in the Chest",
      content:
        "The old sailor's belongings were packed away after the inn grew quiet. Beneath a stack of papers lay a folded map, its edges worn soft and its ink faded by time.\n\nA red cross marked a place beyond the known shipping lanes. The map promised no easy fortune, but it gave the people who found it a reason to leave shore.",
    },
    {
      title: "The Cook with One Leg",
      content:
        "The ship's cook was cheerful, helpful, and always ready with a story. He moved quickly across the deck, learning every name before the voyage had properly begun.\n\nThe boy trusted him more than most of the crew. That trust would be tested when the island appeared as a dark line beneath the morning clouds.",
    },
  ],
  "alices-adventures-in-wonderland": [
    {
      title: "The White Rabbit",
      content:
        "A white rabbit hurried past with a watch in its paw, speaking as though it were already late for something important. Curiosity proved stronger than caution, and the girl followed it beneath the hedge.\n\nThe passage opened into a place where distance behaved strangely. A small door stood at the end, and beyond it waited a garden she could see but not yet reach.",
    },
    {
      title: "A Room of Small Doors",
      content:
        "The room was lined with doors, each one locked and each one the wrong size. On a glass table sat a key beside a bottle with a neat label.\n\nOne sip changed the room around her. The garden drew closer, the ceiling seemed to rise, and the key became a puzzle all over again.",
    },
  ],
};

async function seed() {
  await client.connect();
  const db = client.db(DB_NAME);

  await Promise.all([
    db.collection("authors").deleteMany({}),
    db.collection("categories").deleteMany({}),
    db.collection("books").deleteMany({}),
    db.collection("chapters").deleteMany({}),
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

  const bookInsert = await db.collection("books").insertMany(
    books.map((b) => ({
      ...b,
      cover_url: cover(b.isbn),
      author_id: authorIds[b.author],
      category_ids: b.category_slugs.map((s) => categoryIds[s]),
      created_at: new Date(),
      updated_at: new Date(),
    })),
  );

  const chapterDocuments = books.flatMap((book, bookIndex) =>
    chapterSamples[book.slug].map((chapter, chapterIndex) => ({
      book_id: bookInsert.insertedIds[bookIndex],
      order: chapterIndex + 1,
      ...chapter,
      is_sample: true,
      created_at: new Date(),
    })),
  );
  await db.collection("chapters").insertMany(chapterDocuments);

  await db.collection("books").createIndex({ slug: 1 }, { unique: true });
  await db
    .collection("books")
    .createIndex({ title: "text", description: "text", author_name: "text" });
  await db.collection("books").createIndex({ author_id: 1 });
  await db
    .collection("chapters")
    .createIndex({ book_id: 1, order: 1 }, { unique: true });
  await db.collection("authors").createIndex({ slug: 1 }, { unique: true });
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });

  console.log(
    `Seeded ${books.length} books, ${authors.length} authors, ${categories.length} categories, and ${chapterDocuments.length} sample chapters`,
  );
  await client.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
