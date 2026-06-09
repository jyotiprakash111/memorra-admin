"use client"

import { motion } from "framer-motion"
import { Menu, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/lib/theme-context"

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  rightContent?: React.ReactNode
}

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const Header = ({ onMenuClick, title, rightContent }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200",
      )}
    >
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              theme === "dark"
                ? "hover:bg-slate-700 text-slate-300"
                : "hover:bg-gray-100 text-gray-700",
            )}
          >
            <Menu size={24} />
          </motion.button>

          <div>
            <h1
              className={cn(
                "text-xl md:text-2xl font-bold transition-colors",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {title || "Dashboard"}
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === "dark"
                ? "hover:bg-slate-700 text-yellow-400"
                : "hover:bg-gray-100 text-blue-600",
            )}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {rightContent}
        </div>
      </div>
    </header>
  )
}
