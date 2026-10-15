import Link from "next/link";

interface BookCardProps {
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  category?: string;
}

export default function BookCard({
  slug,
  title,
  author,
  coverUrl,
  rating,
  category,
}: BookCardProps) {
  return (
    <Link
      href={`/books/${slug}`}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
    >
      <div className="aspect-2/3 overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        {category && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
            {category}
          </span>
        )}
        <h2 className="mt-1 truncate font-semibold">{title}</h2>
        <p className="truncate text-sm text-neutral-500">{author}</p>
        <p className="text-sm text-amber-500">★ {rating.toFixed(1)}</p>
      </div>
    </Link>
  );
}
