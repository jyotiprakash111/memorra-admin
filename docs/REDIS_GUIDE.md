# Memorra Redis Guide

**Implementation, benefits, and setup**  
Memorra Admin Panel + API · Version 1.0 · May 2026

---

## 1. Overview

Redis is a **fast in-memory data store** used by the Memorra backend for rate limiting, caching, and optional sessions. It sits alongside **PostgreSQL (Neon)** — Postgres holds permanent data; Redis holds short-lived or high-frequency data.

The backend lives in `memorra-adminpanel` (Next.js). Mobile and admin clients call `/api/v1/*`.

---

## 2. Benefits for Memorra

| Benefit | Why it matters |
|---------|----------------|
| **Faster responses** | Cache funeral music, homes, FAQs, CMS theme — serve many reads without repeated DB queries |
| **Shared across servers** | Vercel runs many serverless instances; in-memory `Map` does not sync — Redis does |
| **Rate limiting** | Protect admin login and mobile APIs from brute-force and abuse |
| **Less database load** | Neon Postgres stays for durable data; Redis absorbs hot reads |
| **Sessions / revocation** | Optional server-side sessions; logout-everywhere, token blocklists |
| **Future real-time** | Pub/sub for live stream counts, notifications (later phase) |

### Without Redis

- Development still works via **in-memory fallback** in `lib/redis/rate-limit.ts`
- Fine on a single machine
- **Not suitable for production** with multiple instances or strict security requirements

---

## 3. Architecture

```
┌─────────────┐     ┌─────────────┐
│ Mobile app  │     │ Admin panel │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 ▼
       ┌─────────────────────┐
       │  Next.js API        │
       │  /api/v1/*          │
       └─────────┬───────────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Redis     │     │  Postgres   │
│ cache/rate  │     │  (Prisma)   │
│ sessions    │     │  permanent  │
└─────────────┘     └─────────────┘
```

---

## 4. Project structure

```
memorra-adminpanel/lib/redis/
├── client.ts       → Upstash (prod) or ioredis (local Docker)
├── rate-limit.ts   → Distributed limits + memory fallback
├── cache.ts        → JSON cache with TTL
├── session.ts      → Optional server-side sessions
└── index.ts        → Public exports
```

### Provider priority

1. `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (Vercel / serverless)
2. `REDIS_URL=redis://localhost:6379` (local Docker)
3. Neither set → in-memory fallback

### Key prefixes

| Prefix | Use |
|--------|-----|
| `memorra:ratelimit:*` | Rate limiting |
| `memorra:session:*` | Server-side sessions |
| `memorra:*` | General cache (`cacheKey()` helper) |

---

## 5. Setup

### 5.1 Local development (Docker)

```bash
cd memorra-adminpanel
npm run redis:up
```

Add to `.env`:

```
REDIS_URL=redis://localhost:6379
```

Start the app:

```bash
npm run dev
```

Verify: open `http://localhost:3000/api/v1/health`

Expected response includes:

```json
{
  "redis": {
    "enabled": true,
    "provider": "ioredis",
    "connected": true
  }
}
```

Stop Redis:

```bash
npm run redis:down
```

View logs:

```bash
npm run redis:logs
```

### 5.2 Production (Upstash on Vercel)

1. Create a database at https://console.upstash.com
2. Copy **REST URL** and **REST Token**
3. Add to Vercel project environment variables:

```
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx
```

If both Upstash and `REDIS_URL` are set, **Upstash takes priority**.

### 5.3 Environment variables

| Variable | Purpose |
|----------|---------|
| `REDIS_URL` | Local or TCP Redis (e.g. `redis://localhost:6379`) |
| `UPSTASH_REDIS_REST_URL` | Upstash REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash auth token |

---

## 6. Code usage

### 6.1 Rate limiting

Already wired on **admin login** (`/api/auth/login`).

```typescript
import { checkRateLimit } from "@/lib/redis"

const result = await checkRateLimit(`admin-login:${clientIP}`, {
  maxRequests: 10,
  windowSeconds: 900,
})

if (!result.allowed) {
  return NextResponse.json(
    { message: "Too many login attempts." },
    { status: 429, headers: { "Retry-After": String(result.resetInSeconds) } },
  )
}
```

**Recommended also on:** mobile login/register, post creation, password reset, report spam.

### 6.2 Caching catalog data

```typescript
import { cacheKey, cacheGet, cacheSet, cacheDelete } from "@/lib/redis"

const key = cacheKey("catalog", "funeral-music")

const cached = await cacheGet(key)
if (cached) return cached

const songs = await prisma.funeralMusic.findMany({ where: { isActive: true } })
await cacheSet(key, songs, 300) // 5 minutes TTL
return songs
```

**Invalidate on admin update:**

```typescript
await cacheDelete(cacheKey("catalog", "funeral-music"))
```

**Good cache candidates:** FuneralMusic, FuneralHome, WishlistOption, Faq, AppTheme, FeatureFlag.

### 6.3 Sessions (optional)

```typescript
import { setSession, getSession, deleteSession } from "@/lib/redis/session"

await setSession(sessionId, {
  userId,
  email,
  role,
  loginTime: Date.now(),
}, 3600)
```

Use for logout-everywhere or token revocation alongside JWT.

### 6.4 Health check

`GET /api/v1/health` reports Redis `enabled`, `provider`, and `connected`.

---

## 7. Implementation roadmap

| Priority | Feature | Redis use |
|----------|---------|-----------|
| 1 | Mobile auth routes | `checkRateLimit` on login/register |
| 2 | Funeral music / homes APIs | `cacheGet` / `cacheSet` + invalidate on admin save |
| 3 | CMS theme / feature flags | Cache 1–5 minutes |
| 4 | Wishlist options CMS | Cache dropdown options |
| 5 | Logout / token revoke | `deleteSession` or token blocklist |

---

## 8. npm scripts

| Command | Description |
|---------|-------------|
| `npm run redis:up` | Start local Redis (Docker) |
| `npm run redis:down` | Stop local Redis |
| `npm run redis:logs` | Follow Redis container logs |
| `npm run dev` | Start admin + API |

---

## 9. Related files

| Path | Purpose |
|------|---------|
| `lib/redis/client.ts` | Upstash + ioredis client |
| `lib/redis/rate-limit.ts` | Distributed rate limits |
| `lib/redis/cache.ts` | JSON cache helpers |
| `lib/redis/session.ts` | Session storage |
| `docker-compose.redis.yml` | Local Redis container |
| `docs/REDIS_SETUP.md` | Quick reference |
| `docs/API_BACKEND.md` | API overview |

---

## 10. Summary

| Question | Answer |
|----------|--------|
| What is Redis used for? | Rate limits, cache, sessions |
| Is it required locally? | No — memory fallback exists |
| Is it required in production? | Strongly recommended |
| How to enable locally? | `npm run redis:up` + `REDIS_URL` |
| How to enable on Vercel? | Upstash env vars |
| What's already done? | Client, cache, rate limit, login protection, health check |

---

*Memorra · Confidential internal documentation*
