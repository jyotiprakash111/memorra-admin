import { getRedis } from "./client"

const KEY_PREFIX = "memorra:"

export function cacheKey(...parts: string[]): string {
  return `${KEY_PREFIX}${parts.join(":")}`
}

/**
 * Get a cached JSON value.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null

  const raw = await redis.get(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

/**
 * Set a cached value with optional TTL (seconds).
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false

  const serialized = typeof value === "string" ? value : JSON.stringify(value)
  await redis.set(key, serialized, ttlSeconds)
  return true
}

export async function cacheDelete(key: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  await redis.del(key)
  return true
}

/**
 * Invalidate keys by prefix (best-effort; Upstash has no SCAN in REST — use known keys in prod).
 */
export async function cacheDeletePattern(_pattern: string): Promise<void> {
  // For full pattern delete, use Redis SCAN via ioredis in a background job.
  // Documented in docs/REDIS_SETUP.md.
}
