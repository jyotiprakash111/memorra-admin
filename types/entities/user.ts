export type UserEntity = {
  id: string
  email: string
  name: string | null
  role: "user" | "admin" | "moderator" | "support"
  status: "active" | "suspended" | "pending"
  plan: string | null
  createdAt: string
  updatedAt: string
}
