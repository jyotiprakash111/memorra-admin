# Redis setup (Memorra backend)

Redis is used for **rate limiting**, **session cache**, and general **caching**. The app works without Redis in dev (in-memory fallback) but you should enable it in production.

## Choose your provider

| Environment | Recommended | Env vars |
|-------------|-------------|----------|
| Local dev | Docker Redis | `REDIS_URL=redis://localhost:6379` |
| Vercel / serverless | [Upstash](https://upstash.com) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Managed (Railway, AWS, etc.) | TCP Redis | `REDIS_URL=redis://...` |

If **both** Upstash and `REDIS_URL` are set, **Upstash wins** (better for serverless).

## Local development (Docker)

```bash
cd memorra-adminpanel
npm run redis:up
```

Add to `.env`:

```
REDIS_URL=redis://localhost:6379
```

Stop Redis:

```bash
npm run redis:down
```

## Upstash (production)

1. Create a database at [console.upstash.com](https://console.upstash.com)
2. Copy **REST URL** and **REST Token**
3. Add to Vercel project env:

```
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx
```

## Code usage

```typescript
import {
  checkRateLimit,
  cacheSet,
  cacheGet,
  isRedisEnabled,
  pingRedis,
} from "@/lib/redis"

// Rate limit (login, API abuse)
const result = await checkRateLimit(`login:${ip}`, {
  maxRequests: 10,
  windowSeconds: 900,
})
if (!result.allowed) {
  // 429 Too Many Requests
}

// Cache
await cacheSet("memorra:catalog:music", songs, 300) // 5 min TTL
const cached = await cacheGet("memorra:catalog:music")
```

## Health check

`GET /api/v1/health` includes:

```json
{
  "redis": {
    "enabled": true,
    "provider": "ioredis",
    "connected": true
  }
}
```

## Key prefixes

| Prefix | Use |
|--------|-----|
| `memorra:ratelimit:*` | Rate limiting |
| `memorra:session:*` | Server-side sessions |
| `memorra:*` | General cache (`cacheKey()` helper) |

## Files

| Path | Purpose |
|------|---------|
| `lib/redis/client.ts` | Upstash + ioredis client |
| `lib/redis/rate-limit.ts` | Distributed rate limits |
| `lib/redis/cache.ts` | JSON cache helpers |
| `lib/redis/session.ts` | Session storage |
| `docker-compose.redis.yml` | Local Redis container |
