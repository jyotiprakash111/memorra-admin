import { NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/security"

/**
 * GET /api/auth/verify
 * Verify current session token
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from httpOnly cookie
    const token = request.cookies.get("adminToken")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const payload = await verifyJWT(token)

    if (!payload) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    // Return user info (with sensitive data removed)
    return NextResponse.json(
      {
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
          loginTime: (payload as any).loginTime || Date.now(),
          lastActivityTime: (payload as any).lastActivityTime || Date.now(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Auth] Verification error:", error)
    return NextResponse.json({ message: "Verification failed" }, { status: 500 })
  }
}
