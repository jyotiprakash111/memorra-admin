#!/usr/bin/env node

/**
 * Seed script - Create demo admin users
 * Run: node scripts/seed-demo-users.js
 */

const DEMO_USERS = {
  super_admin: {
    email: "admin@memorra.local",
    password: "SecurePassword123!@#",
    role: "Super Admin (Full Access)",
  },
  admin: {
    email: "admin2@memorra.local",
    password: "AdminPass123!@#",
    role: "Admin (Most Features)",
  },
  moderator: {
    email: "moderator@memorra.local",
    password: "ModeratorPass123!@#",
    role: "Moderator (Content Only)",
  },
  finance: {
    email: "finance@memorra.local",
    password: "FinancePass123!@#",
    role: "Finance (Payments Only)",
  },
  support: {
    email: "support@memorra.local",
    password: "SupportPass123!@#",
    role: "Support (Help Desk)",
  },
}

console.log("\n🔐 Memorra Admin Panel - Demo Users Setup\n")
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

console.log("📝 DEMO LOGIN CREDENTIALS\n")
console.log("⚠️  These are for DEVELOPMENT ONLY!\n")

let count = 1
for (const [key, user] of Object.entries(DEMO_USERS)) {
  console.log(`${count}. ${user.role}`)
  console.log(`   Email:    ${user.email}`)
  console.log(`   Password: ${user.password}`)
  console.log()
  count++
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
console.log("✅ Demo users are configured in:\n")
console.log("   lib/demo-users.ts\n")

console.log("🔄 To use in production:\n")
console.log("   1. Replace verifyDemoUser() with real database\n")
console.log("   2. Use bcrypt for password hashing\n")
console.log("   3. Store in Firestore/PostgreSQL\n")
console.log("   4. Remove demo-users.ts from codebase\n")

console.log("🚀 Start development:\n")
console.log("   npm run dev\n")
console.log("   → Navigate to http://localhost:3000\n")
console.log("   → Login with any credentials above\n")

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
