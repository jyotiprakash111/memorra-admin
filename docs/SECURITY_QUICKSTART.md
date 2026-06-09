# SECURITY SETUP QUICK START

## ⚡ 5-Minute Setup Guide

### Step 1: Update Dependencies (2 min)
```bash
# Use the secure package configuration
cp package.security.json package.json

# Install dependencies with security fixes
npm ci
npm audit fix
```

### Step 2: Configure Environment (1 min)
```bash
# Copy example to local config
cp .env.example .env.local

# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to JWT_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to JWT_REFRESH_SECRET
```

### Step 3: Edit `.env.local` (2 min)
```env
# Add your actual Firebase credentials
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
# ... other Firebase vars ...

# Add JWT secrets from step 2
JWT_SECRET=generated_random_value_32_chars_min
JWT_REFRESH_SECRET=generated_random_value_32_chars_min

# Set your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Validate & Run
```bash
# Validate security setup
npm run security:validate

# Start development server
npm run dev
```

✅ **Done!** Your admin panel is now secure.

---

## 🔒 What's Protected?

### ✅ Implemented:
- [x] JWT authentication with httpOnly cookies
- [x] CSRF protection on all forms
- [x] XSS prevention (input sanitization + CSP headers)
- [x] Middleware-based route protection
- [x] Role-based access control
- [x] Rate limiting on login
- [x] Session timeout (30 min)
- [x] Security headers (X-Frame-Options, CSP, HSTS, etc.)
- [x] Input validation & sanitization
- [x] Audit logging
- [x] Password strength validation
- [x] Secure environment variable handling

### 🚀 Production Ready:
- HTTPS enforced
- Cookie flags (httpOnly, secure, sameSite)
- Content Security Policy
- OWASP Top 10 coverage

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set in production
- [ ] JWT secrets are strong (min 32 chars, random)
- [ ] Firebase Security Rules configured
- [ ] HTTPS certificate installed
- [ ] Rate limiting configured with Redis (production)
- [ ] Audit logs database set up
- [ ] Backup strategy in place
- [ ] Monitoring & alerting configured
- [ ] Team trained on security practices
- [ ] Security headers validated
- [ ] Dependencies audited: `npm audit`
- [ ] Build succeeds: `npm run build`
- [ ] All tests pass
- [ ] WAF (Web Application Firewall) enabled (if applicable)
- [ ] DDoS protection active

---

## 🛡️ Security Best Practices for Team

### For Every API Endpoint:

```typescript
// ✅ ALWAYS do this:
import { protectRoute, AdminPermission } from '@/app/api/lib/protected-route'

export async function POST(request: NextRequest) {
  return protectRoute(
    request,
    async (request, auth) => {
      // Your logic here
      // auth contains: userId, email, role, permissions
      return NextResponse.json({ success: true })
    },
    {
      method: 'POST',
      requiredPermissions: [AdminPermission.VIEW_USERS],
      sanitizeInput: true,
    },
  )
}
```

### For Every Form Input:

```typescript
// ✅ ALWAYS sanitize:
import { sanitizeInput } from '@/lib/security'

const userEmail = sanitizeInput(formData.email)
// Now safe to use in database or display
```

### For Every Admin Action:

```typescript
// ✅ ALWAYS log:
import { createAuditLog } from '@/lib/security'

const audit = createAuditLog('user_ban', adminId, adminEmail, {
  targetId: userId,
  targetType: 'user',
  status: 'success',
  reason: 'Inappropriate content',
  ipAddress: request.ip,
})

await db.collection('audit_logs').add(audit)
```

---

## 🔐 Testing Security

### Manual Testing Checklist:

- [ ] Try accessing `/admin` without login → redirects to `/login`
- [ ] Login with invalid password → error message
- [ ] Login with valid credentials → redirects to `/admin`
- [ ] Try accessing API without auth header → 401
- [ ] Test CSRF by removing token → 403
- [ ] Check that tokens are in httpOnly cookies (DevTools → Application → Cookies)
- [ ] Test input sanitization with `<script>alert(1)</script>` → should be escaped
- [ ] Session timeout after 30 min inactivity → auto logout
- [ ] Test permission check with limited user → specific endpoints blocked
- [ ] Multiple rapid logins → rate limited after 5 attempts
- [ ] Check security headers in response (DevTools → Network → Response Headers)

### Automated Testing:

```bash
# Check for vulnerabilities
npm audit

# Fix known issues
npm audit fix

# Type checking
npm run build

# Linting
npm run lint
```

---

## 🚨 If Security Issue Found:

1. **Immediately stop** production deployments
2. **Investigate** using audit logs in Firestore
3. **Patch** the vulnerability
4. **Deploy** fix to production
5. **Monitor** for exploitation attempts
6. **Document** lessons learned

---

## 📞 Support

### Common Issues:

**Q: "Not authenticated" error on login**
- Check `.env.local` has JWT secrets
- Verify Firebase credentials
- Check browser cookies are enabled

**Q: CSRF token validation failed**
- Clear browser cookies
- Refresh page
- Try login again

**Q: Permission denied error**
- Check user role in Firebase
- Verify permission assignments
- Check audit logs for access attempts

**Q: Session timeout too quick**
- Edit `ADMIN_SESSION_TIMEOUT` in `.env.local` (seconds)
- Default is 1800 (30 minutes)

---

## 📚 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web security risks
- [Next.js Security](https://nextjs.org/docs/getting-started/security) - Framework security
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security) - Deep dives
- [NIST Cybersecurity](https://www.nist.gov/cyberframework/) - Industry standards

---

## 💡 Pro Tips

1. **Rotate secrets regularly** → Generate new JWT_SECRET quarterly
2. **Review audit logs weekly** → Catch suspicious patterns early
3. **Keep dependencies updated** → `npm update` monthly
4. **Test after updates** → Security patches can affect functionality
5. **Document everything** → Future you will thank current you
6. **Train your team** → Security is everyone's responsibility

---

## Version Info

- **Next.js**: 16.1.6
- **Node.js**: ≥18.16.0
- **Security Standard**: OWASP Top 10 2023
- **Last Updated**: April 8, 2026

---

## 🎯 Next Steps

1. ✅ Complete setup (5 min)
2. ✅ Review SECURITY_IMPLEMENTATION.md (20 min)
3. ✅ Run manual security tests (10 min)
4. ✅ Train team on security practices (30 min)
5. ✅ Deploy to production with confidence 🚀

---

Need help? Check SECURITY_IMPLEMENTATION.md for detailed documentation.
