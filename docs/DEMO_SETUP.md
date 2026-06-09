# 🚀 Admin Panel Demo Setup - Complete Guide

## Step 1: View All Demo Credentials

```bash
npm run seed:demo
```

**Output:**
```
🔐 Memorra Admin Panel - Demo Users Setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 DEMO LOGIN CREDENTIALS

⚠️  These are for DEVELOPMENT ONLY!

1. Super Admin (Full Access)
   Email:    admin@memorra.local
   Password: SecurePassword123!@#

2. Admin (Most Features)
   Email:    admin2@memorra.local
   Password: AdminPass123!@#

3. Moderator (Content Only)
   Email:    moderator@memorra.local
   Password: ModeratorPass123!@#

4. Finance (Payments Only)
   Email:    finance@memorra.local
   Password: FinancePass123!@#

5. Support (Help Desk)
   Email:    support@memorra.local
   Password: SupportPass123!@#

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 2: Start Development Server

```bash
npm run dev
```

Output will show:
```
> next dev

  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

---

## Step 3: Login to Admin Panel

### Open in Browser:
```
http://localhost:3000/login
```

### You'll see:
1. **Login Form** with email/password fields
2. **Demo Credentials Notice** (yellow box showing sample credentials)
3. **Security Notice** confirming secure setup

### Try Logging In:
```
Email:    admin@memorra.local
Password: SecurePassword123!@#
```

### Expected Result:
✅ Successfully logs in
✅ Redirects to `/admin` dashboard
✅ Shows your user role and permissions

---

## Step 4: Test Different Roles

### Role 1: Super Admin (Full Access)
```
Email:    admin@memorra.local
Password: SecurePassword123!@#
```
Can access: Everything ✓

### Role 2: Finance Admin (Payments Only)
```
Email:    finance@memorra.local
Password: FinancePass123!@#
```
Can access: Payments, Transactions, Analytics

Try accessing `/admin/users` → Should see permission denied ✓

### Role 3: Moderator (Content Only)
```
Email:    moderator@memorra.local
Password: ModeratorPass123!@#
```
Can access: Content moderation, flagged posts

---

## Step 5: Check Browser Security

### Verify secure setup:

**DevTools → Application → Cookies:**
```
adminToken
  ├─ HttpOnly: ✓ (protected from JavaScript)
  ├─ Secure: ✓ (HTTPS only in production)
  └─ SameSite: Strict ✓ (CSRF protected)

adminRefreshToken
  └─ (7-day expiry token)

csrfToken
  └─ (CSRF token for form validation)
```

**DevTools → Console:**
No security errors = ✅ Good!

**DevTools → Network:**
Look for auth requests:
- `POST /api/auth/login` → 200 OK
- `GET /api/auth/verify` → 200 OK
- Response only contains user info (NO tokens in response) ✓

---

## What's Included

### 📁 Demo Auth Files:
- `lib/demo-users.ts` - All 5 demo user definitions
- `app/api/auth/login/route.ts` - Login endpoint with demo verification
- `app/api/auth/logout/route.ts` - Logout handler
- `app/api/auth/verify/route.ts` - Session verification
- `app/api/auth/refresh/route.ts` - Token refresh
- `app/login/page.tsx` - Login UI with demo credentials display
- `middleware.ts` - Route protection middleware

### 🔒 Security Features Active:
- ✅ JWT authentication
- ✅ httpOnly secure cookies
- ✅ CSRF protection
- ✅ Rate limiting ready
- ✅ Session timeout (30 min)
- ✅ Input sanitization
- ✅ Role-based access control
- ✅ Comprehensive security headers

---

## Common Tasks

### Change Admin Password (Demo Only)
```bash
# Edit the demo users file
nano lib/demo-users.ts

# Change password in DEMO_ADMIN_USERS
export const DEMO_ADMIN_USERS = {
  super_admin: {
    ...
    password: "YourNewPassword123!@#", // Change this
    ...
  },
}

# Restart development server
npm run dev
```

### Add New Demo User
```bash
# In lib/demo-users.ts, add to DEMO_ADMIN_USERS:

test_admin: {
  id: "admin-999",
  email: "test@memorra.local",
  password: "TestPass123!@#",
  role: "admin",
  permissions: [/* your permissions */],
}
```

### Test Session Timeout
```bash
# Session timeout is 30 minutes
# To test with shorter timeout:

# In .env.local add:
ADMIN_SESSION_TIMEOUT=60  # 60 seconds for testing
```

### Logout
```bash
# Click logout button in admin panel
# Or manually clear cookies:

# DevTools → Application → Cookies
# Delete: adminToken, adminRefreshToken, csrfToken
```

---

## Before Going to Production

### ❌ Remove Demo Auth:

```bash
# 1. Delete demo files
rm lib/demo-users.ts
rm scripts/seed-demo-users.js

# 2. Remove demo credential display
# Edit app/login/page.tsx - delete yellow demo box

# 3. Update package.json
# Remove "seed:demo" script
```

### ✅ Implement Real Auth:

```bash
# 1. Choose your auth method:
#    • Firebase Auth
#    • Firebase Firestore + custom logic
#    • PostgreSQL + bcrypt
#    • AWS Cognito

# 2. Update app/api/auth/login/route.ts:
#    Replace verifyDemoUser() with real auth

# 3. Add environment variables:
#    NEXT_PUBLIC_FIREBASE_API_KEY=xxx
#    FIREBASE_ADMIN_SDK_KEY=xxx
#    etc.

# 4. Build and test:
npm run build
npm run start
```

---

## Troubleshooting

### Can't Login
```
Problem: "Email or password incorrect" but credentials seem right
Solution: 
  • Copy/paste credentials exactly (case-sensitive)
  • Check for extra spaces
  • Verify lib/demo-users.ts has correct values
  • Clear browser cache: Cmd+Shift+R
```

### Session Times Out Too Quickly
```
Problem: Gets logged out after a few minutes
Solution:
  Edit .env.local:
  ADMIN_SESSION_TIMEOUT=3600  # 1 hour instead of 30 min
  
  Restart: npm run dev
```

### CSRF Token Error
```
Problem: "CSRF token required" error on login
Solution:
  • Clear browser cookies
  • Refresh page (Cmd+R)
  • Try login again
```

### Permission Denied
```
Problem: Can't access /admin/users but logged in as finance role
Solution:
  • Login as super_admin or admin role instead
  • Finance role only has payment permissions
```

### DevTools Shows Errors
```
Check browser console (Cmd+Option+J):
  • [Auth] errors = Check .env.local
  • [Security] warnings = Expected for demo mode
  • [CORS] errors = Check middleware.ts
```

---

## File Structure

```
memorra-admin-panel-main/
├── lib/
│   ├── demo-users.ts          ← Demo credentials
│   ├── auth-context.tsx       ← Auth provider
│   ├── security.ts            ← Security utilities
│   └── theme-context.tsx
├── app/
│   ├── login/
│   │   └── page.tsx           ← Login form
│   ├── api/auth/
│   │   ├── login/route.ts     ← Login endpoint
│   │   ├── logout/route.ts
│   │   ├── verify/route.ts
│   │   └── refresh/route.ts
│   ├── admin/
│   │   ├── layout.tsx         ← Protected routes
│   │   └── page.tsx           ← Dashboard
│   ├── layout.tsx
│   └── page.tsx
├── middleware.ts              ← Route protection
├── scripts/
│   ├── validate-security.js
│   └── seed-demo-users.js     ← Show credentials
├── package.json
└── .env.example               ← Config template
```

---

## Next Steps

1. ✅ **Login with demo credentials** (now ready!)
2. ✅ **Explore admin panel** with different roles
3. ✅ **Review SECURITY_IMPLEMENTATION.md** for details
4. ✅ **Plan real auth implementation** (Firebase/DB)
5. ✅ **Deploy demo version** to staging
6. ✅ **Implement & test production auth**
7. ✅ **Remove demo-users.ts** before going live

---

## Quick Commands Reference

```bash
# View demo credentials
npm run seed:demo

# Start development server
npm run dev

# Check security configuration
npm run security:validate

# Build for production
npm run build

# Run production server
npm run start

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Documentation Reference

| Document | Purpose |
|---|---|
| `DEMO_CREDENTIALS.md` | This file - login credentials |
| `SECURITY_IMPLEMENTATION.md` | Full security documentation |
| `SECURITY_QUICKSTART.md` | Security setup guide |
| `NEXTJS_REACT_VULNERABILITIES.md` | Vulnerability details |

---

## Support

If you get stuck:

1. Check `.env.local` exists (copy from `.env.example`)
2. Verify credentials in `lib/demo-users.ts`
3. Clear browser cache and cookies
4. Restart dev server: `npm run dev`
5. Check browser console for errors

---

**🎉 You're all set! Go login and explore the admin panel!**

```
URL: http://localhost:3000/login
Email: admin@memorra.local  
Password: SecurePassword123!@#
```
