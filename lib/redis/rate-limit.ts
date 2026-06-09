import { getRedis } from "./client"

const RATE_LIMIT_PREFIX = "memorra:ratelimit:"

/** In-memory fallback when Redis is not configured (dev only). */
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export type RateLimitOptions = {
  maxRequests?: number
  windowSeconds?: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetInSeconds: number
  source: "redis" | "memory"
}

function memoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  const entry = memoryStore.get(key)

  if (!entry || entry.resetTime < now) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds,
      source: "memory",
    }
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
      source: "memory",
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
    source: "memory",
  }
}

/**
 * Distributed rate limit (Redis) with in-memory fallback for local dev.
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests ?? 100
  const windowSeconds = options.windowSeconds ?? 900

  const redis = getRedis()
  if (!redis) {
    return memoryRateLimit(identifier, maxRequests, windowSeconds)
  }

  const key = `${RATE_LIMIT_PREFIX}${identifier}`

  try {
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, windowSeconds)
    }

    const allowed = count <= maxRequests
    const remaining = Math.max(0, maxRequests - count)

    return {
      allowed,
      remaining,
      resetInSeconds: windowSeconds,
      source: "redis",
    }
  } catch (error) {
    console.error("[Redis] Rate limit error, falling back to memory:", error)
    return memoryRateLimit(identifier, maxRequests, windowSeconds)
  }
}

export async function resetRateLimit(identifier: string): Promise<void> {
  const redis = getRedis()
  const key = `${RATE_LIMIT_PREFIX}${identifier}`

  if (redis) {
    await redis.del(key)
  }
  memoryStore.delete(identifier)
}
