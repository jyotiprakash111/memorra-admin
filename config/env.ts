import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16).optional(),
  ADMIN_APP_URL: z.string().url().optional(),
  MOBILE_APP_ORIGIN: z.string().url().optional(),
  // Redis — at least one recommended in production
  REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

export function getEnv(): Env {
  return envSchema.parse(process.env)
}

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.REDIS_URL ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
  )
}
