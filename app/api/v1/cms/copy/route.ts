import { stubRoute } from "@/lib/api/stub-route"

const handlers = stubRoute("cms/copy")

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const PATCH = handlers.PATCH
export const DELETE = handlers.DELETE
