import { NextRequest, NextResponse } from "next/server"
import {
  AdminPermission,
  hasPermission,
  verifyJWT,
  type JWTPayload,
} from "@/lib/security"
import { Errors } from "@/lib/api/errors"
import { fail } from "@/lib/api/response"

export type AuthContext = JWTPayload

type Handler = (request: NextRequest, auth: AuthContext) => Promise<NextResponse>

/**
 * Protect /api/v1 routes with Bearer token or adminToken cookie.
 */
export async function withAuth(
  request: NextRequest,
  handler: Handler,
  options?: { permissions?: AdminPermission[] },
): Promise<NextResponse> {
  const bearer = request.headers.get("authorization")
  const cookieToken = request.cookies.get("adminToken")?.value
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : cookieToken

  if (!token) {
    return fail(Errors.unauthorized())
  }

  const payload = await verifyJWT(token)
  if (!payload) {
    return fail(Errors.unauthorized("Invalid or expired token"))
  }

  if (options?.permissions?.length) {
    const allowed = options.permissions.every((p) =>
      hasPermission(payload.role as never, p),
    )
    if (!allowed) {
      return fail(Errors.forbidden())
    }
  }

  return handler(request, payload)
}
