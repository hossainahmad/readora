import { toNextJsHandler } from "better-auth/next-js";

import type { NextRequest } from "next/server";

async function handleAuthRequest(request: NextRequest, method: "GET" | "POST") {
  if (!process.env.BETTER_AUTH_SECRET) {
    return Response.json(
      { error: "Authentication is not configured on this server." },
      { status: 503 },
    );
  }

  const { auth } = await import("@/lib/auth");
  const handlers = toNextJsHandler(auth);
  return method === "GET" ? handlers.GET(request) : handlers.POST(request);
}

export function GET(request: NextRequest) {
  return handleAuthRequest(request, "GET");
}

export function POST(request: NextRequest) {
  return handleAuthRequest(request, "POST");
}
