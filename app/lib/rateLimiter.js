/**
 * In-memory rate limiter using a Map.
 *
 * IMPORTANT: Works within a single Node.js process instance. In Vercel
 * serverless, warm instances share state between invocations but cold starts
 * reset the Map. This provides best-effort protection — suitable for abusive
 * patterns but not a hard guarantee. Upgrade to Upstash/Redis for strict limits.
 *
 * Never import this in edge-runtime files (proxy.js) — use Node.js API routes only.
 */

const store = new Map();

// Cleanup every 5 minutes — removes entries whose window has expired.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS).unref?.(); // .unref() so it doesn't block process exit
}

/**
 * checkRateLimit(identifier, limit, windowMs)
 *
 * @param {string} identifier  Unique key (e.g. userId, IP, "userId:solutionId")
 * @param {number} limit       Max requests allowed in the window
 * @param {number} windowMs    Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetAt: number, retryAfterSec: number }}
 */
export function checkRateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const windowKey = Math.floor(now / windowMs);
  const key = `${identifier}:${windowKey}`;

  let entry = store.get(key);
  if (!entry) {
    entry = { count: 0, resetAt: (windowKey + 1) * windowMs };
    store.set(key, entry);
  }

  entry.count += 1;

  const allowed = entry.count <= limit;
  const retryAfterSec = allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000);

  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
    retryAfterSec,
  };
}

/** Pre-configured limits for each route */
export const LIMITS = {
  WORKSPACE_CHAT:  { limit: 20, windowMs: 60 * 60 * 1000 },   // 20 req/user/hour
  LOGIN:           { limit: 5,  windowMs: 15 * 60 * 1000 },   // 5 req/IP/15 min
  CHECKOUT:        { limit: 10, windowMs: 60 * 60 * 1000 },   // 10 req/user/hour
  PROFILE_UPDATE:  { limit: 20, windowMs: 60 * 60 * 1000 },   // 20 req/user/hour
};
