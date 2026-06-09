import { ok } from "@/lib/api/response"
import { getRedisProvider, isRedisEnabled, pingRedis } from "@/lib/redis"

export async function GET() {
  const redisEnabled = isRedisEnabled()
  const redisConnected = redisEnabled ? await pingRedis() : false

  return ok({
    status: "ok",
    service: "memorra-api",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
    redis: {
      enabled: redisEnabled,
      provider: getRedisProvider(),
      connected: redisConnected,
    },
  })
}
