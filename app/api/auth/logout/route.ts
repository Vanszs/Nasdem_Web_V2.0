import { NextResponse } from "next/server";
import { addToBlacklist } from "@/lib/jwt-middleware";
import { requireAuth } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

// Logout route: clears all cookies and adds token to blacklist
export async function POST(req: Request) {
  // First verify the token is valid before logging out
  const authError = requireAuth(req as any);
  if (authError) {
    // Even if token is invalid, still clear cookies
    const response = NextResponse.json({ success: true });
    clearAllCookies(response, req);
    return response;
  }

  const response = NextResponse.json({ success: true });

  // Get the token and add it to blacklist
  const token = (req as any).cookies?.get("token")?.value;
  if (token) {
    addToBlacklist(token);
  }

  // Clear all cookies
  clearAllCookies(response, req);

  return response;
}

function clearAllCookies(response: NextResponse, req: Request) {
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
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
}

export async function GET(req: Request) {
  // Allow GET as well for convenience
  return POST(req);
}
