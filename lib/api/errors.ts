export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const Errors = {
  badRequest: (message = "Bad request") => new ApiError(400, message, "BAD_REQUEST"),
  unauthorized: (message = "Unauthorized") => new ApiError(401, message, "UNAUTHORIZED"),
  forbidden: (message = "Forbidden") => new ApiError(403, message, "FORBIDDEN"),
  notFound: (message = "Not found") => new ApiError(404, message, "NOT_FOUND"),
  conflict: (message = "Conflict") => new ApiError(409, message, "CONFLICT"),
  notImplemented: (message = "Not implemented") =>
    new ApiError(501, message, "NOT_IMPLEMENTED"),
} as const
