import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const config = {
  matcher: ["/api/:path*", "/admin", "/admin/:path*"],
};

const isDev = process.env.NODE_ENV === "development";

// Konfigurasi rate limiting yang lebih ketat
const DEFAULT_LIMIT = 60; // Dikurangi dari 100 ke 60
const AUTH_REQUIRED_LIMIT = 200; // Dikurangi dari 300 ke 200
const WINDOW_MS = 60_000;
const SENSITIVE_PATHS = [
  /^\/api\/upload/,
  /^\/api\/members/,
  /^\/api\/programs/,
  /^\/api\/users/,
  /^\/api\/auth\/login/,
];

// CORS configuration - selalu enforce, bahkan di development
const ALLOWED_ORIGINS = (process.env.API_ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Optional shared API key (untuk server2server) -> tambahkan ke env: INTERNAL_API_KEY
const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") || // Cloudflare
    "0.0.0.0"
  );
}

function isSensitive(pathname: string) {
  return SENSITIVE_PATHS.some((r) => r.test(pathname));
}

// Security headers helper
function addSecurityHeaders(response: NextResponse) {
  // HSTS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Content Security Policy (basic)
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

  // Protect admin pages (not API) - require login token
  if (pathname.startsWith("/admin")) {
    const hasAuthCookie = req.cookies.get("token");
    if (!hasAuthCookie) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/auth";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Existing API handling
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // CORS / Origin Gate - selalu enforce
  if (origin && ALLOWED_ORIGINS.length) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }
  }

  // API Key validation
  const apiKey = req.headers.get("x-api-key");
  const hasValidInternalKey = INTERNAL_KEY && apiKey === INTERNAL_KEY;

  // Block suspicious user agents
  const userAgent = req.headers.get("user-agent") || "";
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /curl/i,
    /wget/i,
  ];
  
  if (!hasValidInternalKey && suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return NextResponse.json(
      { success: false, error: "Access denied" },
      { status: 403 }
    );
  }

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

  // Rate limiting dengan logika yang lebih ketat
  const ip = getClientIp(req);
  const baseKey = `${ip}:${pathname}`;

  // Lebih ketat untuk path sensitif dan method tertentu
  let limit = DEFAULT_LIMIT;
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  
  if (isWrite && isSensitive(pathname)) {
    limit = 20; // Dikurangi dari 40 ke 20
  } else if (pathname.startsWith("/api/auth/login")) {
    limit = 5; // Sangat ketat untuk login
  }

  // Jika ada cookie token (authenticated) beri limit berbeda
  const hasAuthCookie = req.cookies.get("token");
  if (hasAuthCookie && !pathname.startsWith("/api/auth/login")) {
    limit = AUTH_REQUIRED_LIMIT;
    if (isWrite && isSensitive(pathname)) limit = 60; // Dikurangi dari 120 ke 60
  }

  // Rate limiting tetap berlaku untuk internal key tapi dengan limit lebih tinggi
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

  // Tambahkan header info rate limit dan security headers
  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(effectiveLimit));
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
  
  // Add CORS headers for API responses
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
  }

  return addSecurityHeaders(res);
}
