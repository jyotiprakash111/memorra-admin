import { NextRequest, NextResponse } from "next/server"
import { sanitizeInput, isValidEmail, verifyPassword, createJWT, createSession, generateCSRFToken } from "@/lib/security"
import { verifyDemoUser } from "@/lib/demo-users"
import { checkRateLimit } from "@/lib/redis"

/**
 * POST /api/auth/login
 * Secure login endpoint with rate limiting and CSRF protection
 */
export async function POST(request: NextRequest) {
  try {
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const rateLimit = await checkRateLimit(`admin-login:${clientIP}`, {
      maxRequests: 10,
      windowSeconds: 900,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      )
    }

    const body = await request.json()

    // Validate input
    const { email, password, csrfToken } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email)

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Verify CSRF token (if available)
    // In production: validate against session CSRF token
    if (!csrfToken) {
      return NextResponse.json({ message: "CSRF token required" }, { status: 403 })
    }

    // DEMO: Use demo users for development
    // In production: Replace with actual database lookup (Firebase, PostgreSQL, etc.)
    const adminUser = await verifyDemoUser(sanitizedEmail, password)

    if (!adminUser) {
      // Generic error - don't reveal if user exists
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create session with user role and permissions
    const session = createSession({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role as any,
      permissions: adminUser.permissions,
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
      ipAddress: clientIP,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Generate tokens
    const token = createJWT(
      {
        userId: session.userId,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      },
      3600,
    )

    const refreshToken = createJWT(
      {
        userId: session.userId,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      },
      604800,
    )

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
          permissions: session.permissions,
          loginTime: session.loginTime,
          lastActivityTime: session.lastActivityTime,
        },
      },
      { status: 200 },
    )

    // Set secure httpOnly cookies (tokens never exposed to JavaScript)
    response.cookies.set("adminToken", token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 3600, // 1 hour
      path: "/",
    })

    response.cookies.set("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800, // 7 days
      path: "/",
    })

    // Set CSRF token in regular cookie (can be accessed by JavaScript for form submission)
    const csrfTokenNew = generateCSRFToken()
    response.cookies.set("csrfToken", csrfTokenNew, {
      httpOnly: false, // JavaScript can access for forms
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    })

    // Log successful login
    console.log(`[Auth] Successful login: ${sanitizedEmail} from ${clientIP}`)

    return response
  } catch (error) {
    console.error("[Auth] Login error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
