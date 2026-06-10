"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuth } from "@/lib/auth-context"

export function useAdminLogout() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openLogoutConfirm = useCallback(() => {
    if (!isLoggingOut) setConfirmOpen(true)
  }, [isLoggingOut])

  const closeLogoutConfirm = useCallback(() => {
    if (!isLoggingOut) setConfirmOpen(false)
  }, [isLoggingOut])

  const confirmLogout = useCallback(async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success("Logged out successfully")
      setConfirmOpen(false)
      router.push("/login")
      router.refresh()
    } catch {
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      } catch {
        // ignore — still redirect
      }
      toast.error("Session ended — redirecting to login")
      setConfirmOpen(false)
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, logout, router])

  return {
    isLoggingOut,
    confirmOpen,
    openLogoutConfirm,
    closeLogoutConfirm,
    confirmLogout,
  }
}
