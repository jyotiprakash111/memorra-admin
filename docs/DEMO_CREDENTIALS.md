# 🔐 Admin Panel Login Credentials - Demo Setup

## ⚡ Quick Start

### 1. Show all demo credentials:
```bash
npm run seed:demo
```

### 2. Start development server:
```bash
npm run dev
```

### 3. Navigate to login:
```
http://localhost:3000/login
```

---

## 📝 Demo Login Credentials

Use any of these credentials in development:

### 1️⃣ Super Admin (Full Access)
```
Email:    admin@memorra.local
Password: SecurePassword123!@#
```
**Access:** Everything - Users, Content, Payments, Settings, Admin Management

### 2️⃣ Admin (Most Features)
```
Email:    admin2@memorra.local
Password: AdminPass123!@#
```
**Access:** Users, Content, Payments, Analytics, Death Verification, Messages

### 3️⃣ Moderator (Content Only)
```
Email:    moderator@memorra.local
Password: ModeratorPass123!@#
```
**Access:** Content Moderation, User Viewing, Audit Logs

### 4️⃣ Finance (Payments Only)
```
Email:    finance@memorra.local
Password: FinancePass123!@#
```
**Access:** Transactions, Refunds, Financial Analytics

### 5️⃣ Support (Help Desk)
```
Email:    support@memorra.local
Password: SupportPass123!@#
```
**Access:** User Support, Tickets, Basic User Management

---

## 🔄 Switching to Production Auth

### Step 1: Identify your auth method
Choose one:
- ✅ **Firebase Authentication** (recommended)
- ✅ **Firebase Firestore** (custom database)
- ✅ **PostgreSQL/MySQL** (external database)
- ✅ **AWS Cognito**

### Step 2: Replace demo implementation

In `app/api/auth/login/route.ts`:

```typescript
// ❌ REMOVE THIS (demo):
import { verifyDemoUser } from "@/lib/demo-users"
const adminUser = await verifyDemoUser(sanitizedEmail, password)

// ✅ ADD YOUR REAL AUTH:
// Example: Firebase
import { getAuth } from "firebase-admin/auth"
const auth = getAuth()
const userRecord = await auth.getUserByEmail(sanitizedEmail)
const passwordValid = await bcrypt.compare(password, userRecord.passwordHash)
```

### Step 3: Remove demo files
```bash
rm lib/demo-users.ts
rm scripts/seed-demo-users.js
```

### Step 4: Update environment variables
```env
# Old (demo - remove)
# None needed

# New (Firebase example):
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_ADMIN_SDK_KEY=path/to/serviceAccount.json
```

### Step 5: Test production auth
```bash
npm run build
npm run start
```

---

## 🛠️ Implementing Real Database Auth

### Firebase Authentication Solution:

```typescript
// app/api/auth/login/route.ts
import { getAuth } from "firebase-admin/auth"
import { initializeApp } from "firebase-admin/app"

const app = initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY!)),
})

const auth = getAuth(app)

// Replace verifyDemoUser with:
export async function verifyUser(email: string, password: string) {
  try {
    const userRecord = await auth.getUserByEmail(email)
    
    // Verify password (assuming stored as custom claim or in Firestore)
    // If using Firebase Auth, password is managed by Firebase
    
    return {
      id: userRecord.uid,
      email: userRecord.email,
      role: userRecord.customClaims?.role || "user",
      permissions: userRecord.customClaims?.permissions || [],
    }
  } catch (error) {
    return null
  }
}
```

### Firestore Database Solution:

```typescript
// lib/firestore-auth.ts
import { db } from './firebase-admin'
import bcrypt from 'bcryptjs'

export async function verifyFirestoreUser(email: string, password: string) {
  const usersRef = db.collection('admin_users')
  const query = await usersRef.where('email', '==', email).get()
  
  if (query.empty) return null
  
  const userDoc = query.docs[0]
  const user = userDoc.data()
  
  // Verify password
  const passwordValid = await bcrypt.compare(password, user.passwordHash)
  if (!passwordValid) return null
  
  return {
    id: userDoc.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  }
}
```

---

## 🧪 Testing Your Auth Integration

### 1. Test with your implementation:
```bash
npm run dev
# Navigate to http://localhost:3000/login
# Try logging in with real credentials
```

### 2. Check browser console for errors:
```javascript
// DevTools → Console
// Look for [Auth] or [Security] messages
```

### 3. Verify tokens in cookies:
```
DevTools → Application → Cookies
- adminToken (httpOnly: true ✓)
- adminRefreshToken (httpOnly: true ✓)
- csrfToken (httpOnly: false ✓)
```

### 4. Test permission checks:
```bash
# Try accessing routes with limited user
# Should see permission errors in browser console
```

---

## ⚠️ Important Security Notes

### Development Only:
- 🔴 Demo credentials are hardcoded
- 🔴 Passwords visible in source code
- 🔴 No actual password hashing
- 🔴 Anyone with source code has access

### Production Checklist:
- ✅ Never hardcode credentials
- ✅ Use proper password hashing (bcrypt)
- ✅ Store hashed passwords in database
- ✅ Implement 2FA/MFA
- ✅ Use secure credential storage
- ✅ Audit login attempts
- ✅ Rate limit login endpoint
- ✅ Use HTTPS only
- ✅ Rotate secrets regularly
- ✅ Document credential management

---

## 🔒 File Locations

**Demo credentials defined in:**
- `lib/demo-users.ts` - All demo user data
- `app/api/auth/login/route.ts` - Uses `verifyDemoUser()`
- `app/login/page.tsx` - Shows demo credentials in dev mode

**To replace with real auth:**
1. Update `app/api/auth/login/route.ts`
2. Replace `verifyDemoUser()` with your auth function
3. Remove `lib/demo-users.ts`
4. Update `app/api/auth/refresh/route.ts` if needed

---

## 📞 Common Issues

**Q: "Email or password incorrect" but I'm using correct credentials**
- A: Demo auth is case-sensitive. Use exact email: `admin@memorra.local`

**Q: Session expires too quickly**
- A: Default is 30 minutes. Change in `.env.local`: `ADMIN_SESSION_TIMEOUT=3600`

**Q: Can't login, getting CSRF error**
- A: Clear browser cookies and refresh the page

**Q: Need to change demo passwords**
- A: Edit `lib/demo-users.ts` and restart dev server

**Q: How to add more demo users?**
- A: Add to `DEMO_ADMIN_USERS` object in `lib/demo-users.ts`

---

## 🚀 Next Steps

1. ✅ Use demo credentials to explore admin panel
2. ✅ Test all features with different roles
3. ✅ Plan real auth implementation
4. ✅ Implement real database integration
5. ✅ Remove demo-users.ts before production

---

## 📚 Related Documentation

- [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) - Full security guide
- [SECURITY_QUICKSTART.md](SECURITY_QUICKSTART.md) - Security setup
- [NEXTJS_REACT_VULNERABILITIES.md](NEXTJS_REACT_VULNERABILITIES.md) - Vulnerability details

---

**Demo Setup Ready!** 🎉

Start with: `npm run dev`

Login at: http://localhost:3000/login
