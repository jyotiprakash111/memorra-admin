import { NextRequest, NextResponse } from "next/server"
import { ApiError, Errors } from "./errors"
import { fail } from "./response"

export type RouteContext = {
  params: Promise<Record<string, string>>
}

export type AuthContext = {
  userId: string
  email: string
  role: "user" | "admin" | "moderator"
  permissions: string[]
}

type HandlerFn = (
  request: NextRequest,
  context: RouteContext,
  auth?: AuthContext,
) => Promise<NextResponse>

export function createHandler(handler: HandlerFn, options?: { requireAuth?: boolean }) {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      // TODO: resolve session/JWT when auth is implemented
      if (options?.requireAuth) {
        throw Errors.unauthorized()
      }

      return await handler(request, context)
    } catch (error) {
      if (error instanceof ApiError) {
        return fail(error)
      }
      console.error(`[API] ${request.method} ${request.nextUrl.pathname}`, error)
      return fail(new ApiError(500, "Internal server error"))
    }
  }
}

/** Placeholder for routes not yet implemented */
export function notImplemented(feature: string) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: `${feature} is not implemented yet`,
        code: "NOT_IMPLEMENTED",
      },
    },
    { status: 501 },
  )
}
