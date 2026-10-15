Readora — Book Reading Website Plan
A web platform where visitors can discover, search, and read books online.

1. Project Overview
   Goal: Beautiful card-based browsing, powerful search/filtering, and adistraction-free, eye-comfortable reading experience with social login.
   Status: Phases 1–2 complete ✅
2. Tech Stack
   Layer Choice Why
   Framework Next.js (React, TypeScript) SEO-friendly SSR, API routes built-in
   Styling Tailwind CSS Fast, consistent design system
   Database MongoDB (Atlas free tier / local) Document model fits denormalized book data
   Auth Better Auth (MongoDB adapter) TS-native, Google/Facebook/GitHub built-in
   File/Covers Open Library covers (seed) → Cloudinary later No storage setup needed to start
   Search MongoDB text index → Atlas Search later Start simple, upgrade for relevance
   Deployment Vercel + MongoDB Atlas Simple CI/CD, free tier
3. Features
   3.1 Core Features (Requested)
   Home page — card-style grid of books (cover, title, author, rating, category badge)
   Author cards/sections — featured authors with photo, bio, book count
   Book search — instant search by title/author/keyword
   Category browse & filter — filter by genre + sort (newest, popular, A–Z, rating)
   Reader UI — eye-comfortable reading mode (see §5)
   Social login setup — Google, Facebook, GitHub
   ⚠️ Instagram: no standard OAuth support in Better Auth — revisit via genericOAuth plugin later
   3.2 Suggested Additional Features
   Book detail page (description, chapters, reviews, "similar books")
   Author detail pages (bio + all their books)
   Reading progress tracking (auto-save position)
   Personal library shelves: Want to Read / Reading / Finished
   Bookmarks
   Ratings & text reviews
   "Continue Reading" section on home
   Recently viewed books
   Admin panel — add/edit books, authors, categories
   Responsive design (mobile-first)
   PWA support (read offline)
4. Routes / Pages
   Route Purpose Status
   / Home: featured books, hero, search ✅ Built
   /books Browse all + filters + sort ✅ Built
   /books/[slug] Book details ✅ Built
   /authors All authors ✅ Built
   /authors/[slug] Author bio + books ✅ Built
   /categories All categories ✅ Built
   /categories/[slug] Books in a category ✅ Built
   /read/[bookSlug]/[chapter] Reader UI Phase 3
   /login Auth page (smoke test ✅, polish in Phase 4) 🔧
   /dashboard User library, progress, settings Phase 4
   /admin Content management (role-gated) Phase 5
5. Reader UI — Eye Comfort Guidelines
   Themes: Light, Sepia, Dark (warm-tinted dark, not pure black)
   Typography: Serif font (Literata/Merriweather), line-height 1.7, ~70 chars/line max
   Controls: Font size (14–28px), reading width, theme — saved per user
   Distraction-free mode: hides header/nav; tap or f key to toggle
   Progress: thin progress bar + "% complete" + auto-saved position
   Navigation: TOC drawer, prev/next chapter, arrow-key support
   Shortcuts: ←/→ page turn, t TOC, +/- font size
6. Database Schema (MongoDB)
   Collections:

users — Better Auth managed (+ role: "user" | "admin")
session, account, verification — Better Auth managed
books — slug, title, description, cover_url, isbn, author_id,author_name (denormalized), category_ids, category_names (denormalized),published_year, pages, rating_avg, featured, created_at, updated_at
authors — slug, name, bio, born, died, created_at
categories — slug, name, created_at
chapters — book_id, order, title, content
reviews — user_id, book_id, rating (1–5), comment
reading_progress — user_id, book_id, chapter_id, position, percent
bookmarks — user_id, book_id, chapter_id, note, created_at
library — user_id, book_id, status (want_to_read | reading | finished)
Indexes:

books: slug (unique), text index on title/description/author_name, author_id
authors / categories: slug (unique) 7. Authentication
Providers configured: Google, Facebook, GitHub (Better Auth)
Email/account linking across providers (by verified email)
Roles: user (default), admin
Polish /login page with branding + error states (Phase 4)
⚠️ Instagram: use genericOAuth plugin (requires Meta app review) — deferred 8. Development Phases
Phase 1 — Foundation ✅ DONE

Project scaffold (Next.js + TS + Tailwind)
MongoDB connection singleton (lib/db.ts)
Better Auth setup (lib/auth.ts, catch-all route, auth client)
Seed script — 10 books, 10 authors, 8 categories
Layout: Navbar (live session state), Footer, BookCard
Home page with featured books from DB
/login smoke-test page
Phase 2 — Discovery ✅ DONE

/books browse page: search, category filter, sorting ✅
Book detail page ✅
Authors & categories pages + detail pages ✅
Link BookCard → book detail ✅
Phase 3 — Reader

Reader UI with themes & typography controls
Chapter navigation + progress bar
Seed chapter content for books
Phase 4 — Auth & Users

Polish login page + error handling
Dashboard, library shelves
Reading progress sync
Phase 5 — Community & Admin

Ratings/reviews, bookmarks
Admin panel (role-gated)
Phase 6 — Polish & Launch

SEO (meta tags, structured data, sitemap)
Performance (image optimization, caching)
Cross-device testing, accessibility
Deploy (Vercel + Atlas) → Analytics/Search Console 9. Environment Variables (.env.local)
MONGODB_URI=MONGODB_DB=booknestBETTER_AUTH_SECRET=BETTER_AUTH_URL=http://localhost:3000GOOGLE_CLIENT_ID=GOOGLE_CLIENT_SECRET=FACEBOOK_CLIENT_ID=FACEBOOK_CLIENT_SECRET=GITHUB_CLIENT_ID=GITHUB_CLIENT_SECRET= 10. Future Enhancements (v2)
Downloads (EPUB/PDF export)
Text highlighting & margin notes
Recommendations engine ("readers also liked")
Email notifications
Chapter discussions
Multi-language support
Audiobook support
A couple of notes:

I updated it to match reality — Phase 1 items are checked off, the tech stack reflects MongoDB + Better Auth, and the schema/indexes match what we actually built in the seed script.
Keep it living — check off items as you go; it doubles as your progress tracker and project documentation.
