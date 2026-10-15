"use client";

import { signIn } from "@/lib/auth-client";

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "facebook", label: "Continue with Facebook" },
  { id: "github", label: "Continue with GitHub" },
];

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-center text-2xl font-bold">Sign in to BookNest</h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        Temporary smoke-test page — will be polished in Phase 4.
      </p>
      <div className="mt-8 space-y-3">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => signIn.social({ provider: p.id, callbackURL: "/" })}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
