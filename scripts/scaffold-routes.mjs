#!/usr/bin/env node
/**
 * Creates stub route.ts files for API directories that don't have one yet.
 * Run: node scripts/scaffold-routes.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app", "api", "v1")

function featureFromPath(dir) {
  const rel = path.relative(root, dir).replace(/\\/g, "/")
  return rel || "health"
}

function routeContent(feature) {
  return `import { stubRoute } from "@/lib/api/stub-route"

const handlers = stubRoute("${feature}")

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const PATCH = handlers.PATCH
export const DELETE = handlers.DELETE
`
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const hasRoute = entries.some((e) => e.isFile() && e.name === "route.ts")
  const subdirs = entries.filter((e) => e.isDirectory())

  if (!hasRoute && dir !== root) {
    const feature = featureFromPath(dir)
    fs.writeFileSync(path.join(dir, "route.ts"), routeContent(feature))
    console.log("created", path.relative(root, dir))
  }

  for (const sub of subdirs) {
    walk(path.join(dir, sub.name))
  }
}

walk(root)
console.log("Done.")
