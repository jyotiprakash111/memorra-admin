import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/auth/logout
 * Clear authentication tokens
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    )

    // Clear all security cookies
    response.cookies.delete("adminToken")
    response.cookies.delete("adminRefreshToken")
    response.cookies.delete("csrfToken")

    // Log logout
    console.log("[Auth] User logged out")

    return response
  } catch (error) {
    console.error("[Auth] Logout error:", error)
    return NextResponse.json({ message: "Logout failed" }, { status: 500 })
  }
}
