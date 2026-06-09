import { NextRequest, NextResponse } from "next/server"
import type { NextMiddleware } from "next/server"

// Middleware to protect admin routes and enforce security policies
export const middleware: NextMiddleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Mobile + external clients: CORS for versioned API (no admin cookie required)
  if (pathname.startsWith("/api/v1")) {
    return applyApiCors(request)
  }

  // Skip middleware for these paths
  const publicPaths = ["/login", "/forgot-password", "/reset-password", "/health"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  if (isPublicPath) {
    // Add security headers to public paths too
    return applySecurityHeaders(request)
  }

  // All /admin routes require authentication
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("cookie")
    const token = extractTokenFromCookie(authHeader)

    // No token found - redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token validity
    try {
      const isValid = await verifyJWT(token)
      if (!isValid) {
        // Token invalid - clear cookies and redirect
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("adminToken")
        response.cookies.delete("adminRefreshToken")
        return response
      }
    } catch (error) {
      console.error("[Security] Token verification failed:", error)
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("adminToken")
      response.cookies.delete("adminRefreshToken")
      return response
    }

    // Add security headers
    return applySecurityHeaders(request)
  }

  return applySecurityHeaders(request)
}

const API_CORS_ORIGINS = [
  process.env.MOBILE_APP_ORIGIN,
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:3000",
].filter(Boolean) as string[]

/**
 * CORS + security headers for /api/v1 (Memorra mobile app)
 */
function applyApiCors(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin")
  const headers = new Headers()

  if (origin && API_CORS_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Access-Control-Allow-Credentials", "true")
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token",
  )
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("X-Frame-Options", "DENY")

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers })
  }

  const response = NextResponse.next()
  headers.forEach((value, key) => response.headers.set(key, value))
  return response
}

/**
 * Apply comprehensive security headers to all responses
 */
function applySecurityHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next()

  // Prevent Clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // Enable XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.vercel-insights.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://www.googleapis.com https://www.gstatic.com https://firestore.googleapis.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\n/g, " "),
  )

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  )

  // Strict Transport Security (HTTPS only - production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

/**
 * Extract JWT token from cookies
 */
function extractTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "adminToken") {
      return value
    }
  }
  return null
}

/**
 * Verify JWT token
 * In production, use your JWT verification library (jsonwebtoken or jose)
 */
async function verifyJWT(token: string): Promise<boolean> {
  try {
    // Import jose or jsonwebtoken in actual implementation
    // For now, basic validation
    if (!token || token.split(".").length !== 3) {
      return false
    }

    // TODO: Implement actual JWT verification with expiry check
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // if (decoded.exp && decoded.exp < Date.now() / 1000) {
    //   return false;
    // }

    return true
  } catch (error) {
    console.error("[Security] JWT verification error:", error)
    return false
  }
}

/**
 * Config for middleware matcher - which paths should run middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
