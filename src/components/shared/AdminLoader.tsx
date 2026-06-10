"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export type AdminLoaderVariant = "fullscreen" | "page" | "minimal" | "inline"

export interface AdminLoaderProps {
  variant?: AdminLoaderVariant
  label?: string
  className?: string
}

function useResolvedTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const resolve = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    }
    resolve()
    const observer = new MutationObserver(resolve)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return theme
}

function Spinner({ size = 40, theme }: { size?: number; theme: "light" | "dark" }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full animate-spin",
          theme === "dark"
            ? "border-[3px] border-slate-700 border-t-green-500"
            : "border-[3px] border-gray-200 border-t-green-600",
        )}
      />
      <div
        className={cn(
          "rounded-full",
          theme === "dark" ? "bg-green-500/25" : "bg-green-500/15",
        )}
        style={{ width: size * 0.35, height: size * 0.35 }}
      />
    </div>
  )
}

export function AdminLoader({
  variant = "page",
  label = "Loading...",
  className,
}: AdminLoaderProps) {
  const theme = useResolvedTheme()
  const isDark = theme === "dark"

  if (variant === "inline") {
    return (
      <span
        className={cn("inline-flex items-center gap-2", className)}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <Spinner size={18} theme={theme} />
        <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-600")}>
          {label}
        </span>
      </span>
    )
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center py-16", className)}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <Spinner size={36} theme={theme} />
        <p className={cn("mt-4 text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>
          {label}
        </p>
      </div>
    )
  }

  if (variant === "fullscreen") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[100] flex flex-col items-center justify-center",
          isDark ? "bg-slate-900" : "bg-gray-50",
          className,
        )}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <Spinner size={44} theme={theme} />
          <p className={cn("mt-5 text-sm", isDark ? "text-slate-400" : "text-gray-500")}>{label}</p>
        </motion.div>
      </div>
    )
  }

  // page — content-area placeholder, no branding duplicate
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center py-20",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Spinner size={40} theme={theme} />
      <p className={cn("mt-4 text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>
        {label}
      </p>
    </div>
  )
}
