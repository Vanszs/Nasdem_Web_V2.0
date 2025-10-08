import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const config = {
  matcher: ["/api/:path*", "/admin", "/admin/:path*", "/auth"],
};

const DEFAULT_LIMIT = 60;
const AUTH_REQUIRED_LIMIT = 200;
const WINDOW_MS = 60_000;

const SENSITIVE_PATHS = [
  /^\/api\/upload/,
  /^\/api\/members/,
  /^\/api\/programs/,
  /^\/api\/users/,
  /^\/api\/auth\/login/,
];

const ALLOWED_ORIGINS = (
  process.env.API_ALLOWED_ORIGINS || "http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "0.0.0.0"
  );
}

function isSensitive(pathname: string) {
  return SENSITIVE_PATHS.some((r) => r.test(pathname));
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");
  const method = req.method.toUpperCase();
  const hasAuthCookie = req.cookies.get("token");

  /**
   * 🧱 1. Prevent logged-in users from going to /auth
   */
  if (pathname.startsWith("/auth") && hasAuthCookie) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/admin"; // arahkan ke dashboard
    return NextResponse.redirect(redirectUrl);
  }

  /**
   * 🔐 2. Protect admin pages
   */
  if (pathname.startsWith("/admin")) {
    if (!hasAuthCookie) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/auth";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /**
   * 🌐 3. Handle API requests
   */
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // CORS / Origin enforcement
  if (origin && ALLOWED_ORIGINS.length) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }
  }

  // Internal key validation
  const apiKey = req.headers.get("x-api-key");
  const hasValidInternalKey = INTERNAL_KEY && apiKey === INTERNAL_KEY;

  // Block bots / crawlers
  const userAgent = req.headers.get("user-agent") || "";
  const suspiciousPatterns = [/bot/i, /crawler/i, /scanner/i, /curl/i, /wget/i];
  if (
    !hasValidInternalKey &&
    suspiciousPatterns.some((pattern) => pattern.test(userAgent))
  ) {
    return NextResponse.json(
      { success: false, error: "Access denied" },
      { status: 403 }
    );
  }

  // Block oversized payloads (non-upload)
  const contentLength = req.headers.get("content-length");
  if (
    contentLength &&
    !pathname.startsWith("/api/upload") &&
    parseInt(contentLength) > 1_000_000
  ) {
    return NextResponse.json(
      { success: false, error: "Payload too large" },
      { status: 413 }
    );
  }

  /**
   * 🚦 4. Rate limiting
   */
  const ip = getClientIp(req);
  const baseKey = `${ip}:${pathname}`;
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  let limit = DEFAULT_LIMIT;
  if (isWrite && isSensitive(pathname)) limit = 20;
  else if (pathname.startsWith("/api/auth/login")) limit = 5;

  if (hasAuthCookie && !pathname.startsWith("/api/auth/login")) {
    limit = AUTH_REQUIRED_LIMIT;
    if (isWrite && isSensitive(pathname)) limit = 60;
  }

  const effectiveLimit = hasValidInternalKey ? limit * 2 : limit;
  const rl = rateLimit(baseKey, effectiveLimit, WINDOW_MS);

  if (rl.limited) {
    const res = NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
    res.headers.set("Retry-After", String(rl.retryAfter ?? 60));
    res.headers.set("X-RateLimit-Limit", String(effectiveLimit));
    res.headers.set("X-RateLimit-Remaining", String(0));
    return addSecurityHeaders(res);
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(effectiveLimit));
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));

  // CORS headers
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-API-Key"
    );
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Max-Age", "86400");
  }

  return addSecurityHeaders(res);
}
