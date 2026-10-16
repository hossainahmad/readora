"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ReaderTheme = "light" | "sepia" | "dark";

interface ReaderChapterLink {
  order: number;
  title: string;
}

interface SavedReadingProgress {
  chapterOrder: number;
  position: number;
  percent: number;
  updatedAt: string;
}

interface ReaderExperienceProps {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  chapterContent: string;
  chapterOrder: number;
  chapters: ReaderChapterLink[];
  previousOrder?: number;
  nextOrder?: number;
  isSample: boolean;
  isAuthenticated: boolean;
  initialProgress: SavedReadingProgress | null;
}

const defaultPreferences = {
  theme: "light" as ReaderTheme,
  fontSize: 18,
  width: 70,
  focusMode: false,
};

const themeClasses: Record<ReaderTheme, string> = {
  light: "bg-[#fffdf8] text-[#29251f]",
  sepia: "bg-[#f1e5ca] text-[#493b2a]",
  dark: "bg-[#2b2924] text-[#eee4d1]",
};

export default function ReaderExperience({
  bookSlug,
  bookTitle,
  chapterTitle,
  chapterContent,
  chapterOrder,
  chapters,
  previousOrder,
  nextOrder,
  isSample,
  isAuthenticated,
  initialProgress,
}: ReaderExperienceProps) {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [chapterProgress, setChapterProgress] = useState(0);
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.order === chapterOrder,
  );
  const progressPercent = Math.round(
    ((Math.max(0, currentChapterIndex) + chapterProgress) / chapters.length) *
      100,
  );
  const progressKey = `readora:progress:${bookSlug}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("readora:reader-preferences");
        if (saved) {
          const value = JSON.parse(saved);
          setPreferences({
            theme: ["light", "sepia", "dark"].includes(value.theme)
              ? value.theme
              : defaultPreferences.theme,
            fontSize: Math.min(28, Math.max(14, Number(value.fontSize) || 18)),
            width: Math.min(85, Math.max(55, Number(value.width) || 70)),
            focusMode: value.focusMode === true,
          });
        }
      } catch {
        setPreferences(defaultPreferences);
      }
      setPreferencesLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;

    document.body.classList.toggle("reader-focus-mode", preferences.focusMode);
    try {
      localStorage.setItem(
        "readora:reader-preferences",
        JSON.stringify(preferences),
      );
    } catch {
      // Preferences remain usable for the current visit if storage is unavailable.
    }

    return () => document.body.classList.remove("reader-focus-mode");
  }, [preferences, preferencesLoaded]);

  useEffect(() => {
    const measureProgress = () => {
      const article = articleRef.current;
      if (!article) return;

      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const scrollEnd = articleTop + article.scrollHeight - window.innerHeight;
      const fraction =
        scrollEnd <= articleTop
          ? 0
          : Math.min(
              1,
              Math.max(
                0,
                (window.scrollY - articleTop) / (scrollEnd - articleTop),
              ),
            );
      setChapterProgress(fraction);

      const savedProgress = {
        chapterOrder,
        position: window.scrollY,
        percent: Math.round(
          ((Math.max(0, currentChapterIndex) + fraction) / chapters.length) *
            100,
        ),
        updatedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(progressKey, JSON.stringify(savedProgress));
      } catch {
        // Progress still updates in the current page if storage is unavailable.
      }

      if (isAuthenticated) {
        pendingProgress = savedProgress;
        window.clearTimeout(syncTimeout);
        syncTimeout = window.setTimeout(() => {
          void syncProgress(savedProgress);
          pendingProgress = null;
        }, 900);
      }
    };

    let syncTimeout: number;
    let pendingProgress: SavedReadingProgress | null = null;
    const syncProgress = (
      savedProgress: SavedReadingProgress,
      keepalive = false,
    ) =>
      fetch("/api/reading-progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, ...savedProgress }),
        keepalive,
      }).catch(() => undefined);

    const frame = window.requestAnimationFrame(() => {
      let localProgress: SavedReadingProgress | null = null;
      try {
        const saved = JSON.parse(localStorage.getItem(progressKey) ?? "null");
        if (
          Number.isInteger(saved?.chapterOrder) &&
          Number.isFinite(saved?.position) &&
          saved.position >= 0
        ) {
          localProgress = {
            chapterOrder: saved.chapterOrder,
            position: saved.position,
            percent: Number(saved.percent) || 0,
            updatedAt:
              typeof saved.updatedAt === "string"
                ? saved.updatedAt
                : "1970-01-01T00:00:00.000Z",
          };
        }
      } catch {
        setChapterProgress(0);
      }

      const localIsNewer =
        localProgress &&
        (!initialProgress ||
          Date.parse(localProgress.updatedAt) >
            Date.parse(initialProgress.updatedAt));
      const savedProgress = localIsNewer ? localProgress : initialProgress;
      if (
        savedProgress?.chapterOrder === chapterOrder &&
        savedProgress.position > 0
      ) {
        window.scrollTo({ top: savedProgress.position, behavior: "auto" });
      }
      measureProgress();
    });

    window.addEventListener("scroll", measureProgress, { passive: true });
    window.addEventListener("resize", measureProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(syncTimeout);
      if (pendingProgress && isAuthenticated) {
        void syncProgress(pendingProgress, true);
      }
      window.removeEventListener("scroll", measureProgress);
      window.removeEventListener("resize", measureProgress);
    };
  }, [
    bookSlug,
    chapterOrder,
    chapters.length,
    currentChapterIndex,
    progressKey,
    isAuthenticated,
    initialProgress,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowLeft" && previousOrder) {
        event.preventDefault();
        router.push(`/read/${bookSlug}/${previousOrder}`);
      } else if (event.key === "ArrowRight" && nextOrder) {
        event.preventDefault();
        router.push(`/read/${bookSlug}/${nextOrder}`);
      } else if (event.key.toLowerCase() === "t") {
        setTocOpen((open) => !open);
      } else if (event.key.toLowerCase() === "f") {
        setPreferences((current) => ({
          ...current,
          focusMode: !current.focusMode,
        }));
      } else if (event.key === "+" || event.key === "=") {
        setPreferences((current) => ({
          ...current,
          fontSize: Math.min(28, current.fontSize + 2),
        }));
      } else if (event.key === "-") {
        setPreferences((current) => ({
          ...current,
          fontSize: Math.max(14, current.fontSize - 2),
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bookSlug, nextOrder, previousOrder, router]);

  const paragraphs = chapterContent
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  function changeFontSize(amount: number) {
    setPreferences((current) => ({
      ...current,
      fontSize: Math.min(28, Math.max(14, current.fontSize + amount)),
    }));
  }

  return (
    <div className={`${themeClasses[preferences.theme]} min-h-screen`}>
      <div
        className={`sticky z-40 h-1 bg-black/10 ${preferences.focusMode ? "top-0" : "top-16"}`}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div
          className="h-full bg-amber-700 transition-[width] duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {!preferences.focusMode ? (
          <div className="border-b border-current/15 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link
                  href={`/books/${bookSlug}`}
                  className="text-sm underline underline-offset-4 opacity-75 hover:opacity-100"
                >
                  Back to book
                </Link>
                <h1 className="mt-1 text-lg font-semibold">{bookTitle}</h1>
                <p className="text-sm opacity-70">
                  Chapter {chapterOrder} of {chapters.length}: {chapterTitle}
                </p>
              </div>
              <p className="text-sm font-medium" aria-live="polite">
                {progressPercent}% complete
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-4">
              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase opacity-70">
                  Theme
                </span>
                <div
                  className="flex gap-1"
                  role="group"
                  aria-label="Reading theme"
                >
                  {(["light", "sepia", "dark"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      aria-pressed={preferences.theme === theme}
                      onClick={() =>
                        setPreferences((current) => ({ ...current, theme }))
                      }
                      className={`rounded border px-3 py-1.5 text-sm capitalize ${preferences.theme === theme ? "border-current font-semibold" : "border-current/25"}`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-1 text-xs font-semibold uppercase">
                <span>Text size: {preferences.fontSize}px</span>
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="2"
                  value={preferences.fontSize}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      fontSize: Number(event.target.value),
                    }))
                  }
                  aria-label="Text size"
                  className="w-32 accent-amber-800"
                />
              </label>

              <label className="grid gap-1 text-xs font-semibold uppercase">
                <span>Reading width: {preferences.width} characters</span>
                <input
                  type="range"
                  min="55"
                  max="85"
                  step="5"
                  value={preferences.width}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      width: Number(event.target.value),
                    }))
                  }
                  aria-label="Reading width"
                  className="w-32 accent-amber-800"
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-expanded={tocOpen}
                  onClick={() => setTocOpen((open) => !open)}
                  className="rounded border border-current/25 px-3 py-2 text-sm font-medium hover:bg-black/5"
                >
                  Contents
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((current) => ({
                      ...current,
                      focusMode: true,
                    }))
                  }
                  className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                >
                  Focus mode
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setPreferences((current) => ({ ...current, focusMode: false }))
            }
            className="fixed right-4 top-4 z-50 rounded border border-current/25 bg-inherit px-3 py-2 text-sm shadow"
          >
            Exit focus mode
          </button>
        )}

        {tocOpen && (
          <nav
            aria-label="Table of contents"
            className="border-b border-current/15 py-4"
          >
            <h2 className="mb-2 text-sm font-semibold uppercase opacity-70">
              Contents
            </h2>
            <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {chapters.map((chapter) => (
                <li key={chapter.order}>
                  <Link
                    href={`/read/${bookSlug}/${chapter.order}`}
                    aria-current={
                      chapter.order === chapterOrder ? "page" : undefined
                    }
                    onClick={() => setTocOpen(false)}
                    className={`block rounded px-3 py-2 text-sm hover:bg-black/5 ${chapter.order === chapterOrder ? "font-semibold" : ""}`}
                  >
                    {chapter.order}. {chapter.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex justify-center py-10 sm:py-14">
          <article
            ref={articleRef}
            className="w-full font-serif leading-[1.7]"
            style={{
              maxWidth: `${preferences.width}ch` as CSSProperties["maxWidth"],
              fontSize: `${preferences.fontSize}px`,
            }}
          >
            <header className="mb-9 border-b border-current/15 pb-6">
              {isSample && (
                <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-wide opacity-60">
                  Sample reading content
                </p>
              )}
              <p className="font-sans text-sm opacity-60">
                Chapter {chapterOrder}
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                {chapterTitle}
              </h2>
            </header>
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 16)}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>

        <nav
          aria-label="Chapter navigation"
          className="flex items-center justify-between gap-4 border-t border-current/15 py-6"
        >
          {previousOrder ? (
            <Link
              href={`/read/${bookSlug}/${previousOrder}`}
              className="text-sm font-semibold underline underline-offset-4"
            >
              Previous chapter
            </Link>
          ) : (
            <span />
          )}
          {nextOrder ? (
            <Link
              href={`/read/${bookSlug}/${nextOrder}`}
              className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Next chapter
            </Link>
          ) : (
            <Link
              href={`/books/${bookSlug}`}
              className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Finish reading
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
