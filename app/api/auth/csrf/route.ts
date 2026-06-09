import { NextRequest, NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/security"

/**
 * GET /api/auth/csrf
 * Get a fresh CSRF token for the login form
 */
export async function GET(request: NextRequest) {
  try {
    const csrfToken = generateCSRFToken()

    const response = NextResponse.json({ csrfToken }, { status: 200 })

    // Set CSRF token in cookie
    response.cookies.set("csrfToken", csrfToken, {
      httpOnly: false, // JavaScript can access for forms
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[CSRF] Error generating token:", error)
    return NextResponse.json({ message: "Failed to generate CSRF token" }, { status: 500 })
  }
}
