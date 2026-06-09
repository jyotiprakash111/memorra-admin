import { notImplemented } from "./route-handler"

/** Generates standard 501 handlers for scaffolded API routes */
export function stubRoute(feature: string) {
  return {
    GET: () => notImplemented(feature),
    POST: () => notImplemented(feature),
    PUT: () => notImplemented(feature),
    PATCH: () => notImplemented(feature),
    DELETE: () => notImplemented(feature),
  }
}
