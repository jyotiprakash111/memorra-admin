import { NextResponse } from "next/server"
import { ApiError } from "./errors"

export type ApiSuccess<T> = {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export type ApiFailure = {
  success: false
  error: {
    message: string
    code?: string
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  const body: ApiSuccess<T> = { success: true, data }
  return NextResponse.json(body, init)
}

export function fail(error: ApiError | Error, status?: number) {
  if (error instanceof ApiError) {
    const body: ApiFailure = {
      success: false,
      error: { message: error.message, code: error.code },
    }
    return NextResponse.json(body, { status: error.status })
  }

  const body: ApiFailure = {
    success: false,
    error: { message: error.message || "Internal server error" },
  }
  return NextResponse.json(body, { status: status ?? 500 })
}
