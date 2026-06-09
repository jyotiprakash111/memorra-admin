# 🔐 Memorra Admin Panel + API

This Next.js app hosts the **admin dashboard** and the **REST API** (`/api/v1/*`) for the mobile app. See [docs/API_BACKEND.md](docs/API_BACKEND.md).

## Quick Start (30 seconds)

```bash
# 1. Navigate to admin panel
cd memorra-admin-panel-main

# 2. Start development
npm run dev

# 3. Open browser
# http://localhost:3000/login

# 4. Login with:
# Email: admin@memorra.local
# Password: SecurePassword123!@#
```

---

## 📋 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Super Admin | admin@memorra.local | SecurePassword123!@# |
| 🔧 Admin | admin2@memorra.local | AdminPass123!@# |
| 👁️ Moderator | moderator@memorra.local | ModeratorPass123!@# |
| 💰 Finance | finance@memorra.local | FinancePass123!@# |
| 💬 Support | support@memorra.local | SupportPass123!@# |

**⚠️ These are for DEVELOPMENT ONLY ⚠️**

---

## 🚀 Available Commands

```bash
npm run dev                    # 🌐 Start development server
npm run build                  # 🏗️ Build for production
npm run start                  # ▶️ Run production build
npm run seed:demo              # 📝 Show all credentials
npm run creds                  # 🔑 Pretty print credentials
npm run security:validate      # 🔒 Validate security setup
npm audit                      # 🛡️ Check vulnerabilities
npm audit fix                  # 🔧 Fix vulnerabilities
```

---

## 📚 Documentation

Start here based on what you need:

### First Time Setup
- **[DEMO_SETUP.md](../DEMO_SETUP.md)** ← Start here! Complete setup guide

### Credentials
- **[DEMO_CREDENTIALS.md](../DEMO_CREDENTIALS.md)** - Login credentials & role info

### Security
- **[SECURITY_IMPLEMENTATION.md](../SECURITY_IMPLEMENTATION.md)** - Full security details (19 sections)
- **[SECURITY_QUICKSTART.md](../SECURITY_QUICKSTART.md)** - Security setup & best practices
- **[NEXTJS_REACT_VULNERABILITIES.md](../NEXTJS_REACT_VULNERABILITIES.md)** - Latest vulnerabilities & fixes

### Admin panel
- **[docs/ADMIN_PANEL_FLOW.md](docs/ADMIN_PANEL_FLOW.md)** - Full flow, modules, subscription model, and functionality reference
- **[docs/ADMIN_PANEL_QUICK_REFERENCE.md](docs/ADMIN_PANEL_QUICK_REFERENCE.md)** - Implementation checklist

### Expansion
- **[ADMIN_PANEL_EXPANSION.md](../ADMIN_PANEL_EXPANSION.md)** - 20 new admin modules

---

## 🎯 What's Included

### ✅ Authentication & Security
- [x] JWT authentication with httpOnly cookies
- [x] CSRF protection
- [x] Role-based access control (5 roles)
- [x] Session timeout (30 minutes)
- [x] Input sanitization (XSS prevention)
- [x] Rate limiting ready
- [x] Middleware-based route protection
- [x] Comprehensive security headers

### ✅ Demo Users
- [x] 5 pre-configured demo users with different roles
- [x] Different permission levels
- [x] Easy credentials display
- [x] Test different access levels

### ✅ API Routes
- [x] `/api/auth/login` - Login endpoint
- [x] `/api/auth/logout` - Logout endpoint
- [x] `/api/auth/verify` - Token verification
- [x] `/api/auth/refresh` - Token refresh

### ✅ Documentation
- [x] Complete security guide
- [x] Setup instructions
- [x] Credential management
- [x] Production deployment checklist

---

## 🔒 Security Status

### ✅ Implemented
- JWT tokens in httpOnly cookies (JavaScript can't access them)
- CSRF tokens on all forms
- Content Security Policy (CSP)
- XSS prevention through input sanitization
- Rate limiting framework
- Audit logging ready
- Permission-based access control
- Secure session management

### 🚀 Production Ready
- HTTPS enforcement ready
- Security headers configured
- Environment variables for secrets
- `.gitignore` prevents credential leaks

---

## 🧪 Testing the Security

### Quick Test
```bash
# 1. Start server
npm run dev

# 2. Try logging in with wrong password
# Should see: "Invalid email or password"

# 3. Try accessing /admin without login
# Should redirect to /login

# 4. Check DevTools → Application → Cookies
# Should see httpOnly cookies set correctly
```

### Validate Setup
```bash
npm run security:validate
```

---

## 📝 First Login Walkthrough

1. **Start server**: `npm run dev`
2. **Open**: http://localhost:3000/login
3. **See**: 
   - Login form
   - Demo credentials (yellow box)
   - Security notice
4. **Copy credentials**: Email & password from yellow box
5. **Click "Sign In"**: 
   - Validates CSRF token
   - Checks demo users
   - Creates secure session
6. **Redirects to**: http://localhost:3000/admin
7. **See**: Admin dashboard with your role

---

## 🔄 Switching to Production Auth

### Before Deploying:

1. **Remove demo auth**:
   ```bash
   rm lib/demo-users.ts
   rm scripts/seed-demo-users.js
   ```

2. **Implement real database**:
   - Firebase Auth, Firebase Firestore, PostgreSQL, or AWS Cognito
   - Update `app/api/auth/login/route.ts`

3. **Set environment variables**:
   - Generate strong JWT secrets (min 32 chars)
   - Add database credentials

4. **Test thoroughly**:
   ```bash
   npm run build
   npm run start
   ```

5. **Deploy**:
   - Use HTTPS only
   - Enable all security headers
   - Monitor audit logs

---

## 🎓 Learn More

### Security Concepts
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CSRF Protection](https://owasp.org/www-community/attacks/csrf)

### Next.js & React Security
- [Next.js Security](https://nextjs.org/docs/getting-started/security)
- [React Security Best Practices](https://react.dev/reference/react)

### Framework Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)

---

## 💡 Pro Tips

### For Development
- Use Super Admin role to test all features
- Use other roles to test permission restrictions
- Check browser console for security messages
- Review audit logs for activity tracking

### For Production
- Rotate JWT secrets quarterly
- Monitor login attempts for suspicious activity
- Review audit logs weekly
- Keep dependencies updated
- Use 2FA for admin accounts

---

## 🆘 Troubleshooting

### Can't Login?
```
1. Copy credentials exactly (case-sensitive)
2. Clear browser cookies: DevTools → Application → Cookies → Delete All
3. Refresh page: Cmd+R
4. Try again
```

### Permission Denied?
```
1. Check your role in demo credentials
2. Finance role only has payment access
3. Use Super Admin to test all features
```

### CSRF Error?
```
1. Clear cookies and cache
2. Refresh page
3. Try login again
```

---

## 📊 Architecture

```
Admin Panel
├── Authentication Layer (JWT + Cookies)
│   ├── Login Endpoint
│   ├── Token Verification
│   └── Session Management
├── Security Layer
│   ├── Input Sanitization
│   ├── CSRF Protection
│   ├── Rate Limiting
│   └── Audit Logging
├── Authorization Layer
│   ├── Role-Based Access
│   ├── Permission Checking
│   └── Route Protection
└── Admin Features
    ├── Dashboard
    ├── User Management
    ├── Content Moderation
    ├── Payment Management
    └── System Settings
```

---

## 📅 Development Roadmap

### ✅ Phase 1 (Complete)
- [x] Authentication system
- [x] Security infrastructure
- [x] Demo credentials
- [x] Login page

### 🔄 Phase 2 (Ready)
- [ ] Dashboard with analytics
- [ ] User management module
- [ ] Content moderation
- [ ] Payment tracking

### 📋 Phase 3 (Planned)
- [ ] Death verification workflow
- [ ] Final message management
- [ ] Subscription management
- [ ] Advanced reporting

---

## ✨ Get Started Now!

```bash
# 1. Run development server
npm run dev

# 2. Open browser
# http://localhost:3000/login

# 3. Login and explore!
# Email: admin@memorra.local
# Password: SecurePassword123!@#
```

---

## 📞 Support

### Quick Questions?
Check the documentation files in the root directory.

### Getting Started?
Read [DEMO_SETUP.md](../DEMO_SETUP.md)

### Security Help?
Read [SECURITY_IMPLEMENTATION.md](../SECURITY_IMPLEMENTATION.md)

---

**🎉 Happy Admin-ing! 🚀**

*Last updated: April 8, 2026*
