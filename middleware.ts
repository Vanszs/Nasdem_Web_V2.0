import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const config = {
  matcher: ["/api/:path*"],
};

// Konfigurasi
const DEFAULT_LIMIT = 100; // 100 request / menit / IP
const AUTH_REQUIRED_LIMIT = 300; // Endpoint authenticated bisa lebih longgar
const WINDOW_MS = 60_000;
const SENSITIVE_PATHS = [
  /^\/api\/upload/,
  /^\/api\/members/,
  /^\/api\/programs/,
];

const ALLOWED_ORIGINS = (process.env.API_ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Optional shared API key (untuk server2server) -> tambahkan ke env: INTERNAL_API_KEY
const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

function isSensitive(pathname: string) {
  return SENSITIVE_PATHS.some((r) => r.test(pathname));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // CORS / Origin Gate (deny external)
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.length) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }
  }

  // API Key (optional bypass if provided and valid)
  const apiKey = req.headers.get("x-api-key");
  const hasValidInternalKey = INTERNAL_KEY && apiKey === INTERNAL_KEY;

  // Hit basic abuse patterns (block very large bodies for non-upload)
  const contentLength = req.headers.get("content-length");
  if (
    contentLength &&
    !pathname.startsWith("/api/upload") &&
    parseInt(contentLength) > 1_000_000 // 1MB
  ) {
    return NextResponse.json(
      { success: false, error: "Payload too large" },
      { status: 413 }
    );
  }

  // Rate limit
  const ip = getClientIp(req);
  const baseKey = `${ip}:${pathname}`;

  // Lebih ketat untuk path sensitif (POST/PUT/DELETE)
  const method = req.method.toUpperCase();
  let limit = DEFAULT_LIMIT;

  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (isWrite && isSensitive(pathname)) limit = 40;

  // Jika ada cookie token (authenticated) beri limit berbeda
  const hasAuthCookie = req.cookies.get("token");
  if (hasAuthCookie) {
    limit = AUTH_REQUIRED_LIMIT;
    if (isWrite && isSensitive(pathname)) limit = 120;
  }

  // Jika internal key valid → skip rate limit
  if (!hasValidInternalKey) {
    const rl = rateLimit(baseKey, limit, WINDOW_MS);
    if (rl.limited) {
      const res = NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(rl.retryAfter ?? 60));
      res.headers.set("X-RateLimit-Limit", String(rl.limit));
      res.headers.set("X-RateLimit-Remaining", String(0));
      return res;
    }
    // Tambahkan header info rate limit
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", String(rl.limit));
    res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
    return res;
  }

  // Internal key valid → lanjut tanpa limit
  return NextResponse.next();
}
