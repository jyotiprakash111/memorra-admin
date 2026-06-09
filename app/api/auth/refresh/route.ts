import { NextRequest, NextResponse } from "next/server"
import { verifyJWT, createJWT } from "@/lib/security"

/**
 * POST /api/auth/refresh
 * Refresh expired access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("adminRefreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 })
    }

    // Verify refresh token
    const payload = await verifyJWT(refreshToken)

    if (!payload) {
      // Invalid refresh token - clear all cookies
      const response = NextResponse.json({ message: "Invalid refresh token" }, { status: 401 })
      response.cookies.delete("adminToken")
      response.cookies.delete("adminRefreshToken")
      response.cookies.delete("csrfToken")
      return response
    }

    // Create new access token
    const newToken = createJWT(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      },
      3600, // 1 hour
    )

    const response = NextResponse.json(
      {
        message: "Token refreshed",
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
        },
      },
      { status: 200 },
    )

    // Set new access token cookie
    response.cookies.set("adminToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[Auth] Refresh error:", error)
    return NextResponse.json({ message: "Refresh failed" }, { status: 500 })
  }
}
