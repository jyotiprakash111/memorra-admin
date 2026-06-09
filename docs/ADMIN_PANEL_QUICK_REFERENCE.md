# ADMIN PANEL - QUICK REFERENCE CHECKLIST

## Core 20 Modules Summary

| Module | Priority | Complexity | Est. Dev Time |
|--------|----------|-----------|---------------|
| Dashboard/Analytics | 🔴 Critical | High | 3-4 days |
| Death Verification | 🔴 Critical | High | 2-3 days |
| Final Messages Mgmt | 🔴 Critical | Medium | 2 days |
| Wallet/Payments | 🔴 Critical | High | 3 days |
| Content Moderation | 🔴 Critical | Medium | 2 days |
| User Management (Enhanced) | 🟠 High | Medium | 2 days |
| Trusted Contacts | 🟠 High | Low | 1 day |
| Support Tickets | 🟠 High | Low | 1-2 days |
| Live Streaming Mgmt | 🟠 High | Medium | 2 days |
| Subscription Plans | 🟠 High | Medium | 2 days |
| Document Management | 🟡 Medium | Low | 1 day |
| Audit Logs | 🟡 Medium | Low | 1 day |
| Chat Moderation | 🟡 Medium | Low | 1 day |
| Gifts/Donations | 🟡 Medium | Low | 1 day |
| Notifications Config | 🟡 Medium | Medium | 2 days |
| System Settings | 🟡 Medium | Low | 1 day |
| Reports/Insights | 🟡 Medium | High | 3 days |
| Parent Monitoring | 🟡 Medium | Medium | 2 days |
| Affiliate Management | 🟢 Nice-to-Have | Low | 1 day |
| Admin Roles (Enhanced) | 🟢 Nice-to-Have | Medium | 2 days |

**Total Estimated: 35-45 development days** (with parallel work)

---

## Key Business Logic to Implement

### Death Verification Workflow
```
User reports death
    ↓
Admin gets notification
    ↓
Admin reviews documents (death cert, obituary, etc.)
    ↓
Approve/Reject decision
    ↓
IF APPROVED:
  - Trigger final message delivery
  - Mark profile as "Memorial"
  - Notify trusted contacts
  - Archive/preserve data
```

### Payment Reconciliation
```
User initiates transaction
    ↓
Payment gateway (Stripe/PayPal)
    ↓
Webhook to backend
    ↓
Database update
    ↓
Admin reconciliation check
    ↓
IF MISSING: Flag for admin review
IF DUPLICATE: Mark as fraudulent
IF FAILED: Enable retry
```

### Content Moderation Flow
```
User flags content
    ↓
Added to moderation queue
    ↓
Admin reviews content
    ↓
Decision: Approve/Remove/Warn User
    ↓
If removed: Notify content creator
If warned: Update user warnings count
If 3+ warnings: Ban user
```

---

## Admin Features to Consider

### Security & Compliance
- ✅ Role-based access control
- ✅ Audit trail for all admin actions
- ✅ IP logging for suspicious activities
- ✅ 2FA for admin accounts
- ✅ Permission hierarchy

### User Experience
- ✅ Bulk operations (approve multiple, ban multiple)
- ✅ Quick filters & search
- ✅ Customizable dashboards
- ✅ Dark mode support (already in Next.js)
- ✅ Mobile-responsive admin panel

### Analytics & Reporting
- ✅ Export data as CSV/PDF
- ✅ Scheduled reports
- ✅ Real-time KPI updates
- ✅ Trend analysis (week over week, month over month)
- ✅ Cohort analysis

---

## Database Collections Snapshot

### Critical for Phase 1:
```
{
  "analytics_metrics": {
    "daily_active_users": number,
    "monthly_revenue": number,
    "churn_rate": number,
    "engagement_rate": number,
    "date": timestamp
  },
  
  "death_requests": {
    "user_id": string,
    "status": "pending|approved|rejected",
    "documents": ["url1", "url2"],
    "submitted_date": timestamp,
    "reviewed_by": admin_id,
    "review_notes": string
  },
  
  "final_messages": {
    "user_id": string,
    "recipients": ["id1", "id2"],
    "content": string,
    "content_type": "video|audio|text",
    "delivery_trigger": "on_death|scheduled",
    "delivery_date": timestamp,
    "status": "draft|approved|scheduled|delivered",
    "approved_by": admin_id
  },
  
  "transactions": {
    "user_id": string,
    "amount": number,
    "type": "deposit|withdrawal|purchase|refund",
    "status": "pending|success|failed",
    "payment_method": string,
    "provider_transaction_id": string,
    "created_at": timestamp
  },
  
  "flagged_content": {
    "content_id": string,
    "content_type": "post|story|comment|message",
    "flagged_by": user_id,
    "violation_type": string,
    "status": "pending|reviewed|approved|removed",
    "reviewed_by": admin_id,
    "review_date": timestamp
  }
}
```

---

## Admin Panel Navigation Structure (Recommended)

```
Main Sidebar
├── 📊 Dashboard
├── 👥 Users
│   ├── Active Users
│   ├── Suspended/Banned
│   └── Verification Queue
├── 💬 Messages & Legacy
│   ├── Final Messages (pending approval)
│   ├── Message Deliveries
│   ├── Chat Moderation
│   └── Message Templates
├── 💰 Payments & Wallet
│   ├── Transactions
│   ├── Refunds/Disputes
│   ├── Wallet Balances
│   └── Reconciliation
├── 📝 Content Management
│   ├── Moderation Queue
│   ├── User Posts
│   ├── Live Streams
│   └── Reported Content
├── 🔍 Death Verification
│   ├── Pending Requests
│   ├── Approved Deaths
│   └── Verification History
├── 🎁 Products & Orders
│   ├── Products (existing)
│   ├── Gifts/Donations
│   └── Wishlist Items
├── 📱 Subscriptions
│   ├── Plans Management
│   ├── Active Subscriptions
│   └── Churn Analytics
├── 📚 Insurance & Docs
│   ├── Uploaded Docs
│   ├── Expiry Alerts
│   └── Partner Management
├── 🤝 Trusted Contacts
│   ├── Verification Queue
│   ├── Verified Contacts
│   └── Relationship Mapping
├── 📢 Notifications
│   ├── Templates
│   ├── Campaigns
│   └── Email/SMS Config
├── 🎥 Live Streaming
│   ├── Active Streams
│   ├── Archived Streams
│   └── Chat Moderation
├── 🎫 Support
│   ├── Support Tickets
│   ├── FAQs
│   └── User Feedback
├── 📊 Reports
│   ├── Analytics Export
│   ├── Revenue Reports
│   └── User Engagement
├── 🛡️ Security & Compliance
│   ├── Audit Logs
│   ├── Admin Actions
│   ├── GDPR Requests
│   └── Data Export
├── ⚙️ System
│   ├── Settings
│   ├── Feature Flags
│   ├── API Keys
│   └── Integrations
└── 👮 Admin Management
    ├── Admin Users
    ├── Roles & Permissions
    └── Activity Logs
```

---

## Quick Implementation Tips

### Use existing Shadcn components:
- ✅ Table (for listings)
- ✅ Charts (for Dashboard - Recharts)
- ✅ Modal/Dialog (for confirmations)
- ✅ Tabs (for different views)
- ✅ Badge (for status)
- ✅ Button (actions)
- ✅ Select/Combobox (filters)
- ✅ Calendar (date ranges)

### API Endpoints to Create:
```
GET    /api/admin/dashboard/metrics
POST   /api/admin/death-requests/approve
POST   /api/admin/death-requests/reject
POST   /api/admin/final-messages/approve
POST   /api/admin/final-messages/trigger-delivery
GET    /api/admin/transactions/list
POST   /api/admin/transactions/refund
POST   /api/admin/content/moderate
POST   /api/admin/users/ban
POST   /api/admin/users/suspend
GET    /api/admin/reports/generate
POST   /api/admin/audit-log/query
POST   /api/admin/notifications/send
```

### Firebase Security Rules:
```javascript
// Only admins can access admin collections
match /admin_data/{document=**} {
  allow read, write: if request.auth.token.admin == true
}

// Audit all modifications
match /audit_logs/{document=**} {
  allow read: if request.auth.token.admin == true
  allow write: if request.auth.token.admin == true
}
```

---

## Testing Checklist for Each Module

- [ ] Happy path (normal operation)
- [ ] Edge cases (empty states, boundary values)
- [ ] Error handling (API failures, network issues)
- [ ] Permission checks (non-admins can't access)
- [ ] Data validation (invalid inputs rejected)
- [ ] Batch operations (multiple items processed)
- [ ] Audit logging (all actions logged)
- [ ] Real-time updates (when data changes)
- [ ] Mobile responsiveness (tablet/mobile views)
- [ ] Performance (large datasets load smoothly)

---

## Recommended Tool Stack (Already Available)

✅ **Frontend**: Next.js 16 + TypeScript + TailwindCSS
✅ **UI Components**: Shadcn/UI (50+ components)
✅ **Charts**: Recharts
✅ **Icons**: Lucide React
✅ **Backend**: Firebase + Firestore
✅ **Forms**: React Hook Form + Zod
✅ **Theme**: next-themes (dark mode ready)
✅ **Notifications**: Sonner (toast notifications)

**No additional libraries needed!** ✨

---

## Quick Decision Matrix

Choose based on your needs:

**If you want user trust:**
→ Priority: Death Verification + Final Messages

**If you want revenue clarity:**
→ Priority: Dashboard + Payment Management

**If you want platform safety:**
→ Priority: Content Moderation + User Management

**If you want complete control:**
→ Priority: Admin Roles + Audit Logs

**If you want growth insights:**
→ Priority: Dashboard + Reports

---

Would you like me to generate UI code for any specific module? Start with:
1. **Dashboard** (gives instant value)
2. **Death Verification** (core business logic)
3. **Content Moderation** (safety/compliance)

Let me know! 🚀
