# Admin Panel Login Credentials

## Development Demo Accounts

Use the following credentials to test the admin panel. **These are for development only.**

### Super Admin (Full Access)
- **Email**: `admin@memorra.local`
- **Password**: `SecurePassword123!@#`
- **Role**: `super_admin`
- **Permissions**: All permissions including user management, content moderation, analytics, settings

### Admin (Moderation)
- **Email**: `moderator@memorra.local`
- **Password**: `ModeratorPass123!@#`
- **Role**: `admin`
- **Permissions**: User management, content moderation, transactions, analytics, audit logs

### Moderator (Content Moderation)
- **Email**: `moderator2@memorra.local`
- **Password**: `ModeratorPass123!@#`
- **Role**: `moderator`
- **Permissions**: User viewing, content moderation, audit logs

### Finance (Transactions)
- **Email**: `finance@memorra.local`
- **Password**: `FinancePass123!@#`
- **Role**: `finance`
- **Permissions**: Transaction viewing, refund processing, analytics

### Support (User Support)
- **Email**: `support@memorra.local`
- **Password**: `SupportPass123!@#`
- **Role**: `support`
- **Permissions**: User viewing, user editing, transaction viewing

---

## Login Flow

1. Navigate to http://localhost:3000/login
2. Enter email and password from above
3. Click "Sign In"
4. You'll be redirected to `/admin` dashboard

## Troubleshooting

- **CSRF Token Error**: Clear browser cookies and try again
- **Invalid Credentials**: Ensure email and password match exactly (case-sensitive)
- **Session Expired**: Log out and log back in
- **Token Expired**: The token expires after 1 hour; refresh the page to get a new one

## Environment Setup

Ensure `.env.local` exists with required variables:
```
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_1234567890
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters_long_1234567890
```
