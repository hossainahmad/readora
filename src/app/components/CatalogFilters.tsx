"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

interface CatalogCategory {
  slug: string;
  name: string;
}

interface CatalogFiltersProps {
  categories: CatalogCategory[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
}

export default function CatalogFilters({
  categories,
  initialQuery,
  initialCategory,
  initialSort,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [isPending, startTransition] = useTransition();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      if (sort !== "popular") params.set("sort", sort);
      const search = params.toString();

      startTransition(() =>
        router.replace(search ? `${pathname}?${search}` : pathname, {
          scroll: false,
        }),
      );
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [category, pathname, query, router, sort, startTransition]);

  function submitFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (sort !== "popular") params.set("sort", sort);
    const search = params.toString();

    startTransition(() =>
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      }),
    );
  }

  return (
    <form
      action="/books"
      onSubmit={submitFilters}
      className="grid gap-3 border-b border-neutral-200 py-5 sm:grid-cols-[minmax(12rem,1fr)_minmax(10rem,14rem)_minmax(9rem,12rem)_auto] sm:items-end"
    >
      <label className="grid gap-1.5 text-sm font-medium">
        Search
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Title, author, or keyword"
          className="h-10 rounded border border-neutral-300 px-3 font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Category
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded border border-neutral-300 bg-white px-3 font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Sort by
        <select
          name="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-10 rounded border border-neutral-300 bg-white px-3 font-normal outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="az">Title A–Z</option>
          <option value="rating">Top rated</option>
        </select>
      </label>
      <button className="h-10 rounded bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-700">
        {isPending ? "Updating…" : "Apply"}
      </button>
    </form>
  );
}
