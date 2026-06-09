/**
 * Demo Admin Users for Development
 * WARNING: These are for development/testing ONLY
 * Replace with real database in production!
 */

// Demo users - in development, you'd fetch from Firebase/Database
export const DEMO_ADMIN_USERS = {
  super_admin: {
    id: "admin-001",
    email: "admin@memorra.local",
    password: "SecurePassword123!@#", // DEMO: Change in production
    role: "super_admin",
    permissions: [
      "view_users",
      "edit_users",
      "ban_users",
      "delete_users",
      "moderate_content",
      "delete_content",
      "view_transactions",
      "process_refunds",
      "view_analytics",
      "manage_admins",
      "manage_settings",
      "view_audit_logs",
      "verify_deaths",
      "approve_messages",
      "manage_products",
      "manage_faqs",
    ],
  },
  admin: {
    id: "admin-002",
    email: "moderator@memorra.local",
    password: "ModeratorPass123!@#", // DEMO: Change in production
    role: "admin",
    permissions: [
      "view_users",
      "edit_users",
      "ban_users",
      "moderate_content",
      "delete_content",
      "view_transactions",
      "view_analytics",
      "view_audit_logs",
      "verify_deaths",
      "approve_messages",
    ],
  },
  moderator: {
    id: "admin-003",
    email: "moderator2@memorra.local",
    password: "ModeratorPass123!@#", // DEMO: Change in production
    role: "moderator",
    permissions: ["view_users", "moderate_content", "delete_content", "view_audit_logs"],
  },
  finance: {
    id: "admin-004",
    email: "finance@memorra.local",
    password: "FinancePass123!@#", // DEMO: Change in production
    role: "finance",
    permissions: ["view_transactions", "process_refunds", "view_analytics"],
  },
  support: {
    id: "admin-005",
    email: "support@memorra.local",
    password: "SupportPass123!@#", // DEMO: Change in production
    role: "support",
    permissions: ["view_users", "edit_users", "view_transactions"],
  },
}

/**
 * Verify demo user credentials
 * In production, replace this with actual database lookup + password hashing
 */
export async function verifyDemoUser(
  email: string,
  password: string,
): Promise<(typeof DEMO_ADMIN_USERS)[keyof typeof DEMO_ADMIN_USERS] | null> {
  // Find user by email
  const user = Object.values(DEMO_ADMIN_USERS).find((u) => u.email === email)

  if (!user) {
    console.log(`[Demo Auth] User not found: ${email}`)
    return null
  }

  // Compare password (in demo, direct comparison; in production use bcrypt)
  if (user.password !== password) {
    console.log(`[Demo Auth] Invalid password for: ${email}`)
    return null
  }

  console.log(`[Demo Auth] Login successful: ${email}`)
  return user
}

/**
 * Get user by ID (for refresh token validation)
 */
export function getDemoUserById(userId: string) {
  return Object.values(DEMO_ADMIN_USERS).find((u) => u.id === userId) || null
}
