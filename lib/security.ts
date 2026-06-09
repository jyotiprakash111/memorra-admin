import crypto from "crypto"

/**
 * SECURITY UTILITIES FOR ADMIN PANEL
 */

// ===========================================
// 1. CSRF TOKEN GENERATION & VALIDATION
// ===========================================

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 3600000 // 1 hour in ms

export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex")
}

export function validateCSRFToken(token: string, sessionToken: string | undefined): boolean {
  if (!token || !sessionToken) return false

  // Token should match session token
  // In production, you'd store hashed tokens in secure storage
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken))
}

// ===========================================
// 2. INPUT SANITIZATION & VALIDATION
// ===========================================

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value)
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === "string" ? sanitizeInput(item) : item))
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
  isStrong: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isStrong: errors.length === 0,
    errors,
  }
}

// ===========================================
// 3. JWT TOKEN MANAGEMENT
// ===========================================

export interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
  iat: number
  exp: number
}

/**
 * Create JWT tokens
 * Note: In production, use 'jsonwebtoken' or 'jose' package
 */
export function createJWT(payload: Omit<JWTPayload, "iat" | "exp">, expirySeconds: number = 3600): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds,
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(jwtPayload))

  // In production: use proper JWT library
  // This is simplified for demonstration

  return `${encodedHeader}.${encodedPayload}.signature`
}

/**
 * Verify JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    if (!token || typeof token !== "string") return null

    const parts = token.split(".")
    if (parts.length !== 3) return null

    // In production, use proper JWT library with signature verification
    const payload = JSON.parse(atob(parts[1]))

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expired
    }

    return payload as JWTPayload
  } catch (error) {
    console.error("[Security] JWT verification error:", error)
    return null
  }
}

// ===========================================
// 4. SESSION MANAGEMENT
// ===========================================

export interface AdminSession {
  userId: string
  email: string
  role: string
  permissions: string[]
  loginTime: number
  lastActivityTime: number
  ipAddress?: string
  userAgent?: string
}

const SESSION_TIMEOUT = parseInt(process.env.ADMIN_SESSION_TIMEOUT || "1800") // 30 minutes

/**
 * Create new session
 */
export function createSession(user: AdminSession): AdminSession {
  return {
    ...user,
    loginTime: Date.now(),
    lastActivityTime: Date.now(),
  }
}

/**
 * Check if session has expired
 */
export function isSessionExpired(session: AdminSession): boolean {
  const now = Date.now()
  const timeSinceLastActivity = now - session.lastActivityTime

  return timeSinceLastActivity > SESSION_TIMEOUT * 1000
}

/**
 * Update session activity
 */
export function updateSessionActivity(session: AdminSession): AdminSession {
  return {
    ...session,
    lastActivityTime: Date.now(),
  }
}

// ===========================================
// 5. RATE LIMITING
// ===========================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

/**
 * Sync in-memory rate limit (legacy).
 * Prefer async `checkRateLimit` from `@/lib/redis` for production (Redis-backed).
 */
export function checkRateLimit(identifier: string, maxRequests: number = 100, windowSeconds: number = 900): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

// ===========================================
// 6. PASSWORD HASHING (Note: Use bcrypt in production)
// ===========================================

/**
 * Hash password - USE bcrypt IN PRODUCTION!
 * This is simplified for demonstration
 */
export async function hashPassword(password: string): Promise<string> {
  // In production:
  // import bcrypt from 'bcryptjs'
  // const salt = await bcrypt.genSalt(10)
  // return bcrypt.hash(password, salt)

  // Temporary implementation
  const hash = crypto
    .pbkdf2Sync(password, process.env.JWT_SECRET || "salt", 1000, 64, "sha512")
    .toString("hex")
  return hash
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production:
  // import bcrypt from 'bcryptjs'
  // return bcrypt.compare(password, hash)

  const hash2 = crypto
    .pbkdf2Sync(password, process.env.JWT_SECRET || "salt", 1000, 64, "sha512")
    .toString("hex")
  return hash === hash2
}

// ===========================================
// 7. LOGGING & AUDIT TRAIL
// ===========================================

export interface AuditLog {
  timestamp: number
  action: string
  adminId: string
  adminEmail: string
  targetId?: string
  targetType?: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: "success" | "failure"
  reason?: string
}

/**
 * Create audit log entry
 */
export function createAuditLog(
  action: string,
  adminId: string,
  adminEmail: string,
  options?: {
    targetId?: string
    targetType?: string
    changes?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    status?: "success" | "failure"
    reason?: string
  },
): AuditLog {
  return {
    timestamp: Date.now(),
    action,
    adminId,
    adminEmail,
    status: "success",
    ...options,
  }
}

// ===========================================
// 8. PERMISSION & ROLE CHECKING
// ===========================================

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  SUPPORT = "support",
  FINANCE = "finance",
}

export enum AdminPermission {
  // User Management
  VIEW_USERS = "view_users",
  EDIT_USERS = "edit_users",
  BAN_USERS = "ban_users",
  DELETE_USERS = "delete_users",

  // Content Moderation
  MODERATE_CONTENT = "moderate_content",
  DELETE_CONTENT = "delete_content",

  // Financial
  VIEW_TRANSACTIONS = "view_transactions",
  PROCESS_REFUNDS = "process_refunds",
  VIEW_ANALYTICS = "view_analytics",

  // System
  MANAGE_ADMINS = "manage_admins",
  MANAGE_SETTINGS = "manage_settings",
  VIEW_AUDIT_LOGS = "view_audit_logs",

  // Death Verification
  VERIFY_DEATHS = "verify_deaths",
  APPROVE_MESSAGES = "approve_messages",

  // Content Management
  MANAGE_PRODUCTS = "manage_products",
  MANAGE_FAQS = "manage_faqs",
}

const rolePermissionMap: Record<AdminRole, AdminPermission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(AdminPermission),

  [AdminRole.ADMIN]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.EDIT_USERS,
    AdminPermission.BAN_USERS,
    AdminPermission.MODERATE_CONTENT,
    AdminPermission.DELETE_CONTENT,
    AdminPermission.VIEW_TRANSACTIONS,
    AdminPermission.VIEW_ANALYTICS,
    AdminPermission.VIEW_AUDIT_LOGS,
    AdminPermission.VERIFY_DEATHS,
    AdminPermission.APPROVE_MESSAGES,
  ],

  [AdminRole.MODERATOR]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.MODERATE_CONTENT,
    AdminPermission.DELETE_CONTENT,
    AdminPermission.VIEW_AUDIT_LOGS,
  ],

  [AdminRole.SUPPORT]: [AdminPermission.VIEW_USERS, AdminPermission.EDIT_USERS, AdminPermission.VIEW_TRANSACTIONS],

  [AdminRole.FINANCE]: [AdminPermission.VIEW_TRANSACTIONS, AdminPermission.PROCESS_REFUNDS, AdminPermission.VIEW_ANALYTICS],
}

/**
 * Check if role has permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const permissions = rolePermissionMap[role] || []
  return permissions.includes(permission)
}

/**
 * Check if admin has multiple permissions
 */
export function hasAllPermissions(roleOrPermissions: AdminRole | AdminPermission[], requiredPermissions: AdminPermission[]): boolean {
  let permissions: AdminPermission[]

  if (typeof roleOrPermissions === "string" && Object.values(AdminRole).includes(roleOrPermissions as AdminRole)) {
    permissions = rolePermissionMap[roleOrPermissions as AdminRole] || []
  } else {
    permissions = roleOrPermissions as AdminPermission[]
  }

  return requiredPermissions.every((permission) => permissions.includes(permission))
}

// ===========================================
// 9. SECURE HEADERS GENERATION
// ===========================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=(), usb=()",
    "Strict-Transport-Security": process.env.NODE_ENV === "production" ? "max-age=31536000; includeSubDomains" : "",
  }
}

// ===========================================
// 10. ENVIRONMENT VALIDATION
// ===========================================

export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required variables
  const required = ["JWT_SECRET", "JWT_REFRESH_SECRET"]

  for (const variable of required) {
    if (!process.env[variable]) {
      errors.push(`Missing required environment variable: ${variable}`)
    }
  }

  // Validate secret lengths
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters")
  }

  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    errors.push("JWT_REFRESH_SECRET must be at least 32 characters")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
