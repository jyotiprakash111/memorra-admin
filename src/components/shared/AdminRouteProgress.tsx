"use client"

import { useTheme } from "@/lib/theme-context"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminLoader } from "./AdminLoader"
import { ADMIN_LOADER_DURATION_MS } from "./admin-loader-constants"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface AdminRouteProgressProps {
  children: React.ReactNode
}

/**
 * Shows a top progress bar + minimal loader for ADMIN_LOADER_DURATION_MS on route changes.
 */
export function AdminRouteProgress({ children }: AdminRouteProgressProps) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const isFirstRoute = useRef(true)

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false
      return
    }

    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), ADMIN_LOADER_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 overflow-hidden"
          >
            <motion.div
              className={cn(
                "h-full w-1/3 rounded-full",
                theme === "dark" ? "bg-green-400" : "bg-green-600",
              )}
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{ duration: ADMIN_LOADER_DURATION_MS / 1000, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center",
              theme === "dark" ? "bg-slate-900/50" : "bg-white/60",
            )}
          >
            <AdminLoader variant="minimal" label="Loading page..." className="py-0" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "transition-opacity duration-300",
          loading && "pointer-events-none opacity-40",
        )}
      >
        {children}
      </div>
    </>
  )
}
