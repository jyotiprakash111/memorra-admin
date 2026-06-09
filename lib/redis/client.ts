import { Redis as UpstashRedis } from "@upstash/redis"
import Redis from "ioredis"

/**
 * Minimal Redis interface used across the app (Upstash REST or TCP/ioredis).
 */
export type RedisClient = {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlSeconds?: number): Promise<void>
  del(...keys: string[]): Promise<number>
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<void>
  ping(): Promise<string>
}

export type RedisProvider = "upstash" | "ioredis" | "none"

let cachedClient: RedisClient | null | undefined
let cachedProvider: RedisProvider = "none"

function createUpstashClient(): RedisClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new UpstashRedis({ url, token })

  return {
    async get(key) {
      const value = await redis.get<string>(key)
      return value ?? null
    },
    async set(key, value, ttlSeconds) {
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds })
      } else {
        await redis.set(key, value)
      }
    },
    async del(...keys) {
      if (keys.length === 0) return 0
      return redis.del(...keys)
    },
    async incr(key) {
      return redis.incr(key)
    },
    async expire(key, seconds) {
      await redis.expire(key, seconds)
    },
    async ping() {
      const result = await redis.ping()
      return typeof result === "string" ? result : "PONG"
    },
  }
}

function createIoredisClient(): RedisClient | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  const redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  return {
    async get(key) {
      return redis.get(key)
    },
    async set(key, value, ttlSeconds) {
      if (ttlSeconds) {
        await redis.set(key, value, "EX", ttlSeconds)
      } else {
        await redis.set(key, value)
      }
    },
    async del(...keys) {
      if (keys.length === 0) return 0
      return redis.del(...keys)
    },
    async incr(key) {
      return redis.incr(key)
    },
    async expire(key, seconds) {
      await redis.expire(key, seconds)
    },
    async ping() {
      return redis.ping()
    },
  }
}

/**
 * Returns a shared Redis client, or null if Redis is not configured.
 * Priority: Upstash (serverless) → REDIS_URL (local Docker / managed TCP).
 */
export function getRedis(): RedisClient | null {
  if (cachedClient !== undefined) {
    return cachedClient
  }

  const upstash = createUpstashClient()
  if (upstash) {
    cachedClient = upstash
    cachedProvider = "upstash"
    return cachedClient
  }

  const ioredis = createIoredisClient()
  if (ioredis) {
    cachedClient = ioredis
    cachedProvider = "ioredis"
    return cachedClient
  }

  cachedClient = null
  cachedProvider = "none"
  return null
}

export function getRedisProvider(): RedisProvider {
  getRedis()
  return cachedProvider
}

export function isRedisEnabled(): boolean {
  return getRedis() !== null
}

/** Ping Redis; returns false if unavailable or misconfigured. */
export async function pingRedis(): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  try {
    const pong = await redis.ping()
    return pong === "PONG" || pong === "pong"
  } catch (error) {
    console.error("[Redis] Ping failed:", error)
    return false
  }
}
