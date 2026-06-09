"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export type AdminLoaderVariant = "fullscreen" | "page" | "inline"

export interface AdminLoaderProps {
  /** fullscreen = initial app mount; page = route/content area; inline = compact */
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

function Spinner({ size = 48, theme }: { size?: number; theme: "light" | "dark" }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full border-2",
          theme === "dark" ? "border-slate-600" : "border-gray-200",
        )}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 border-r-green-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[22%] rounded-full bg-green-500/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

function SkeletonBlocks({ theme }: { theme: "light" | "dark" }) {
  const bar = theme === "dark" ? "bg-slate-700/80" : "bg-gray-200"
  return (
    <div className="w-full max-w-3xl mt-10 space-y-4 px-4">
      <motion.div
        className={cn("h-8 rounded-lg w-2/5", bar)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <motion.div
        className={cn("h-4 rounded-lg w-4/5", bar)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.1 }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("h-20 rounded-xl", bar)}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.15 * (i + 1) }}
          />
        ))}
      </div>
      <motion.div
        className={cn("h-32 rounded-xl", bar)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
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

  const containerClass =
    variant === "fullscreen"
      ? cn(
          "fixed inset-0 z-[100] flex flex-col items-center justify-center",
          isDark ? "bg-slate-900" : "bg-gray-50",
          className,
        )
      : cn(
          "flex flex-col items-center justify-center w-full min-h-[min(70vh,560px)] py-16",
          className,
        )

  return (
    <div className={containerClass} role="status" aria-live="polite" aria-label={label}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center"
      >
        <Spinner size={variant === "fullscreen" ? 56 : 48} theme={theme} />
        <motion.p
          className={cn(
            "mt-6 text-lg font-bold tracking-tight",
            isDark ? "text-white" : "text-gray-900",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Memorra
        </motion.p>
        <motion.p
          className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-gray-500")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {label}
        </motion.p>
      </motion.div>

      {variant === "page" && <SkeletonBlocks theme={theme} />}
    </div>
  )
}
