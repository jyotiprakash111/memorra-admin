# Memorra API (hosted in admin panel)

The backend lives in this Next.js app alongside the admin UI.

## URLs

| Purpose | Path |
|---------|------|
| Admin UI | `/admin/*` |
| Legacy admin auth | `/api/auth/*` (cookies) |
| **Versioned API** | `/api/v1/*` (mobile + future admin clients) |
| Health | `GET /api/v1/health` |

Development: `http://localhost:3000/api/v1/health`

## Project layout

```
memorra-adminpanel/
├── app/
│   ├── admin/           # Admin dashboard UI
│   ├── api/
│   │   ├── auth/        # Existing admin login (cookies)
│   │   └── v1/          # REST API for mobile + services
│   └── login/
├── lib/
│   ├── api/             # Response helpers, stub routes
│   ├── db/              # Prisma client
│   └── security.ts      # JWT, permissions, sanitization
├── services/            # Business logic
├── repositories/        # Prisma queries
├── types/
├── config/env.ts
└── prisma/schema.prisma
```

## Commands

```bash
npm run dev              # UI + API on :3000
npm run api:scaffold     # Add 501 stubs for new route folders
npm run db:generate      # After DATABASE_URL is set
npm run db:migrate
```

## Mobile app

Set in Expo:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Calls: `${EXPO_PUBLIC_API_URL}/api/v1/...`

## Auth strategy

| Client | Path | Token |
|--------|------|-------|
| Admin panel (browser) | `/api/auth/login` | httpOnly cookies |
| Mobile app | `/api/v1/auth/mobile/*` | Bearer JWT (to implement) |
| Admin API clients | `/api/v1/auth/admin/*` | Bearer or cookies |

Implement mobile auth in `services/auth` using `lib/security.ts` JWT helpers.

## Database

Full model reference: **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**

## Redis

Rate limiting, sessions, and cache: **[REDIS_SETUP.md](./REDIS_SETUP.md)**

```bash
npm run redis:up   # local Docker
# REDIS_URL=redis://localhost:6379 in .env
```

## Next steps

1. Copy `.env.example` → `.env` and set `DATABASE_URL`
2. `npm run db:migrate`
3. Implement routes domain-by-domain (users → posts → funeral catalog)
4. Point admin pages from mock data to `fetch('/api/v1/...')`
