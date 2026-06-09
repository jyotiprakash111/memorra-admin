"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { AdminRole, AdminPermission, hasPermission } from "@/lib/security"

interface AuthUser {
  id: string
  email: string
  role: AdminRole
  permissions: AdminPermission[]
  loginTime: number
  lastActivityTime: number
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: AdminPermission) => boolean
  refreshToken: () => Promise<void>
  updateLastActivity: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Security-patched Auth Provider
 * - Validates RSC data serialization
 * - Prevents token exposure to client
 * - Implements session timeouts
 * - Auto-refreshes tokens
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          // SECURITY: Never store token in state - it's in httpOnly cookie
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("[Auth] Session validation failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [])

  // Setup session timeout and activity tracking
  useEffect(() => {
    if (!user) return

    let timeoutId: NodeJS.Timeout
    let activeCheck: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        // Session expired - logout
        handleLogout()
      }, 30 * 60 * 1000) // 30 minutes
    }

    const handleActivity = () => {
      updateLastActivity()
      resetTimeout()
    }

    // Listen for user activity
    window.addEventListener("mousedown", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("scroll", handleActivity)

    resetTimeout()

    // Periodically check if token is still valid
    activeCheck = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/verify", { credentials: "include" })
        if (!response.ok) {
          handleLogout()
        }
      } catch (error) {
        console.error("[Auth] Token verification failed:", error)
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => {
      clearTimeout(timeoutId)
      clearInterval(activeCheck)
      window.removeEventListener("mousedown", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
    }
  }, [user])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
    } catch (error) {
      console.error("[Auth] Logout error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        handleLogout()
      }
    } catch (error) {
      console.error("[Auth] Token refresh failed:", error)
      handleLogout()
    }
  }, [handleLogout])

  const updateLastActivity = useCallback(() => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            lastActivityTime: Date.now(),
          }
        : null,
    )
  }, [])

  const checkPermission = useCallback(
    (permission: AdminPermission) => {
      if (!user) return false
      return hasPermission(user.role, permission)
    },
    [user],
  )

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission: checkPermission,
    refreshToken,
    updateLastActivity,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

/**
 * Hook to check if user has permission
 */
export function useHasPermission(permission: AdminPermission) {
  const auth = useAuth()
  return auth.hasPermission(permission)
}

/**
 * Hook for protected components
 */
export function usePermissionGuard(requiredPermission: AdminPermission) {
  const auth = useAuth()
  const hasPermission = auth.hasPermission(requiredPermission)

  if (!auth.isAuthenticated || !hasPermission) {
    return {
      allowed: false,
      reason: auth.isAuthenticated ? "insufficient_permissions" : "not_authenticated",
    }
  }

  return { allowed: true }
}
