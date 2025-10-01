import { NextResponse } from "next/server";

// Logout route: clears all cookies (best-effort) including the JWT token
export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  // Parse incoming cookies and expire them
  const raw = req.headers.get("cookie");
  if (raw) {
    const parts = raw.split(/;\s*/);
    for (const part of parts) {
      const [name] = part.split("=");
      if (name) {
        response.cookies.set({
          name: name.trim(),
          value: "",
          path: "/",
          maxAge: 0,
        });
      }
    }
  }

  // Explicitly ensure the auth token is cleared
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}

export async function GET(req: Request) {
  // Allow GET as well for convenience
  return POST(req);
}
