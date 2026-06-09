import { NextRequest, NextResponse } from "next/server"
import { sanitizeObject, createAuditLog, AdminPermission, hasPermission } from "@/lib/security"
import { verifyJWT } from "@/lib/security"

/**
 * Generic API route protection wrapper
 * Validates authentication and permissions
 */

export interface ProtectedRouteOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  requiredPermissions?: AdminPermission[]
  sanitizeInput?: boolean
}

export async function protectRoute(
  request: NextRequest,
  handler: (
    request: NextRequest,
    auth: {
      userId: string
      email: string
      role: string
      permissions: string[]
    },
  ) => Promise<NextResponse>,
  options: ProtectedRouteOptions,
) {
  try {
    // Verify request method
    if (request.method !== options.method) {
      return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
    }

    // Extract and verify token
    const token = request.cookies.get("adminToken")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJWT(token)

    if (!payload) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    // Check permissions if required
    if (options.requiredPermissions && options.requiredPermissions.length > 0) {
      const hasAllPermissions = options.requiredPermissions.every((permission) =>
        hasPermission(payload.role as any, permission),
      )

      if (!hasAllPermissions) {
        // Log unauthorized access attempt
        console.warn(
          `[Security] Unauthorized access attempt by ${payload.email} for ${options.method} ${request.nextUrl.pathname}`,
        )

        return NextResponse.json(
          { message: "Insufficient permissions" },
          { status: 403 },
        )
      }
    }

    // Sanitize input if requested
    let sanitizedBody: any = null
    if (options.method !== "GET" && options.sanitizeInput) {
      try {
        const body = await request.json()
        sanitizedBody = sanitizeObject(body)
      } catch (error) {
        // Invalid JSON
      }
    }

    // Call handler with auth context
    const response = await handler(request, {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    })

    // Add security headers to response
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")

    return response
  } catch (error) {
    console.error("[API] Route protection error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * Example protected API route
 */
export async function exampleProtectedRoute(request: NextRequest) {
  // Import protectRoute wrapper and use it:
  // const handler = async (request: NextRequest, auth) => {
  //   // Your logic here
  //   return NextResponse.json({ data: "..." })
  // }
  //
  // return protectRoute(request, handler, {
  //   method: "GET",
  //   requiredPermissions: [AdminPermission.VIEW_USERS],
  // })
}
