"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

type LoginProvider = { id: string; label: string };

export default function LoginOptions({
  providers,
}: {
  providers: LoginProvider[];
}) {
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(provider: string) {
    setPendingProvider(provider);
    setError(null);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
      if (result.error) {
        setError(result.error.message ?? "Sign-in could not be completed.");
        setPendingProvider(null);
      }
    } catch {
      setError("Sign-in could not be completed. Please try again.");
      setPendingProvider(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="border-y border-neutral-200 py-9">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-amber-800">
          Your reading room
        </p>
        <h1 className="mt-3 text-center font-serif text-3xl font-semibold">
          Sign in to BookNest
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Keep your bookshelves and reading progress together.
        </p>
      </div>
      {providers.length ? (
        <div className="mt-7 space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleSignIn(provider.id)}
              disabled={pendingProvider !== null}
              className="w-full border border-neutral-300 px-4 py-3 text-sm font-semibold transition hover:border-neutral-500 hover:bg-neutral-50 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingProvider === provider.id
                ? "Connecting..."
                : provider.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-7 border-l-2 border-amber-700 bg-amber-50 px-3 py-3 text-sm text-neutral-700">
          Social sign-in is not configured yet. Add OAuth client IDs and secrets
          to the server environment to continue.
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-900"
        >
          {error}
        </p>
      )}
      {providers.length > 0 && (
        <p className="mt-6 text-center text-xs text-neutral-500">
          Sign in with the account you want to use for your library.
        </p>
      )}
    </div>
  );
}
