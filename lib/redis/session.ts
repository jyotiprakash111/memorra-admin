import { cacheDelete, cacheGet, cacheKey, cacheSet } from "./cache"

const SESSION_PREFIX = "session"
const DEFAULT_TTL = 3600 // 1 hour

export type CachedSession = {
  userId: string
  email: string
  role: string
  permissions?: string[]
  loginTime: number
}

/**
 * Store a server-side session in Redis (optional; JWT cookies may still be primary).
 */
export async function setSession(
  sessionId: string,
  data: CachedSession,
  ttlSeconds = DEFAULT_TTL,
): Promise<boolean> {
  return cacheSet(cacheKey(SESSION_PREFIX, sessionId), data, ttlSeconds)
}

export async function getSession(sessionId: string): Promise<CachedSession | null> {
  return cacheGet<CachedSession>(cacheKey(SESSION_PREFIX, sessionId))
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  return cacheDelete(cacheKey(SESSION_PREFIX, sessionId))
}
