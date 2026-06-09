"use client"

import { useTheme } from "@/lib/theme-context"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminLoader } from "./AdminLoader"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

/**
 * Shows the page loader briefly when navigating between admin routes.
 */
export function AdminRouteProgress() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 320)
    return () => window.clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex items-start justify-center pt-24 backdrop-blur-[2px]",
        theme === "dark" ? "bg-slate-900/60" : "bg-white/70",
      )}
    >
      <AdminLoader variant="page" label="Loading page..." className="min-h-0 py-8" />
    </div>
  )
}
