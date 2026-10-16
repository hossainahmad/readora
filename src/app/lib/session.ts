import { headers } from "next/headers";

export async function getSession() {
  if (!process.env.BETTER_AUTH_SECRET) return null;
  const { auth } = await import("@/lib/auth");
  return auth.api.getSession({ headers: await headers() });
}
