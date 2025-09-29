// Simple in-memory sliding window (per instance). For production, ganti Redis.
interface WindowCounter {
  hits: number;
  start: number;
}
const store = new Map<string, WindowCounter>();

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

export function rateLimit(
  key: string,
  limit = 60,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.start >= windowMs) {
    store.set(key, { hits: 1, start: now });
    return { limited: false, remaining: limit - 1, limit };
  }
  entry.hits++;
  if (entry.hits > limit) {
    return {
      limited: true,
      remaining: 0,
      limit,
      retryAfter: Math.ceil((windowMs - (now - entry.start)) / 1000),
    };
  }
  return { limited: false, remaining: limit - entry.hits, limit };
}
