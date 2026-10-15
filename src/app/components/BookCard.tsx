interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  category?: string;
}

export default function BookCard({
  title,
  author,
  coverUrl,
  rating,
  category,
}: BookCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
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
        <h3 className="mt-1 truncate font-semibold">{title}</h3>
        <p className="truncate text-sm text-neutral-500">{author}</p>
        <p className="text-sm text-amber-500">★ {rating.toFixed(1)}</p>
      </div>
    </div>
  );
}
