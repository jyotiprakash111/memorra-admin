"use client"

import { motion } from "framer-motion"
import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  rightContent?: React.ReactNode
}

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const Header = ({ onMenuClick, title, rightContent }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300 shrink-0",
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200",
      )}
    >
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3 min-h-[64px]">
        {/* Left Side */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            type="button"
            onClick={onMenuClick}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors shrink-0",
              theme === "dark"
                ? "hover:bg-slate-700 text-slate-300"
                : "hover:bg-gray-100 text-gray-700",
            )}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </motion.button>

          <h1
            className={cn(
              "text-lg md:text-2xl font-bold truncate",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            {title || "Dashboard"}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {user && (
            <div
              className={cn(
                "hidden lg:flex flex-col items-end mr-1 max-w-[200px]",
                theme === "dark" ? "text-slate-300" : "text-gray-700",
              )}
            >
              <span className="text-sm font-medium truncate">{user.email}</span>
              <span className="text-xs capitalize opacity-70">{user.role.replace("_", " ")}</span>
            </div>
          )}

          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "p-2 rounded-lg transition-colors shrink-0",
              theme === "dark"
                ? "hover:bg-slate-700 text-yellow-400"
                : "hover:bg-gray-100 text-blue-600",
            )}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {rightContent}
        </div>
      </div>
    </header>
  )
}
