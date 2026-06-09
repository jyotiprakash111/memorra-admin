"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  children?: NavItem[]
}

interface SidebarProps {
  items: NavItem[]
  isOpen: boolean
  onClose: () => void
}

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const Sidebar = ({ items, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const isActive = (href: string) => pathname === href

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const bgClass = theme === "dark" ? "bg-slate-800" : "bg-white"
  const textClass = theme === "dark" ? "text-slate-300" : "text-gray-700"
  const hoverClass = theme === "dark" 
    ? "hover:bg-slate-700 hover:text-white" 
    : "hover:bg-gray-100 hover:text-gray-900"
  const borderClass = theme === "dark" ? "border-slate-700" : "border-gray-200"

  const renderNavItem = (item: NavItem, depth = 0) => (
    <div key={item.label}>
      {item.children ? (
        <>
          <button
            onClick={() => toggleExpand(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
              hoverClass,
              textClass,
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                expandedItems.has(item.label) && "rotate-180",
              )}
            />
          </button>
          {expandedItems.has(item.label) && (
            <div className="ml-4 mt-2 space-y-1 border-l border-opacity-30">
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </>
      ) : (
        <Link href={item.href}>
          <motion.div
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
              hoverClass,
              isActive(item.href)
                ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-md"
                : textClass,
            )}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </motion.div>
        </Link>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className={cn(
          "fixed md:static w-64 h-screen flex flex-col z-50 md:z-auto",
          bgClass,
          theme === "dark" ? "border-slate-700" : "border-gray-200",
          "border-r transition-all duration-300",
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-opacity-10" onClick={(e) => e.preventDefault()}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">{theme === "dark" ? "Memorra" : "Memorra"}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t",
          borderClass,
          theme === "dark" ? "bg-slate-900" : "bg-gray-50",
        )}>
          <p className="text-xs text-center opacity-60">Memorra Admin © 2026</p>
        </div>
      </motion.aside>
    </>
  )
}
