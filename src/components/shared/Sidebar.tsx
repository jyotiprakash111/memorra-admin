"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { ChevronDown, Settings } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { SettingsLogoutButton } from "./SettingsLogoutButton"

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  action?: "logout"
  children?: NavItem[]
}

interface SidebarProps {
  items: NavItem[]
  isOpen: boolean
  onClose: () => void
}

const SETTINGS_LABEL = "Settings"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const Sidebar = ({ items, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isDesktop, setIsDesktop] = useState(false)

  const { mainItems, settingsItem } = useMemo(() => {
    const settings = items.find(
      (item) => item.label === SETTINGS_LABEL || item.href === "/admin/settings",
    )
    return {
      mainItems: settings ? items.filter((item) => item !== settings) : items,
      settingsItem: settings ?? null,
    }
  }, [items])

  const isOnSettingsRoute = pathname.startsWith("/admin/settings")

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (isOnSettingsRoute) {
      setExpandedItems((prev) => new Set(prev).add(SETTINGS_LABEL))
    }
  }, [isOnSettingsRoute])

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

  const renderLinkItem = (item: NavItem) => (
    <Link key={item.label} href={item.href} onClick={onClose}>
      <motion.div
        className={cn(
          "flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200",
          hoverClass,
          isActive(item.href)
            ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-md"
            : textClass,
        )}
        whileHover={{ x: 4 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-base">{item.icon}</span>
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {item.badge ? (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        ) : null}
      </motion.div>
    </Link>
  )

  const renderNavItem = (item: NavItem) => (
    <div key={item.label}>
      {item.children ? (
        <>
          <button
            type="button"
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
              {item.children.map((child) =>
                child.action === "logout" ? null : renderLinkItem(child),
              )}
            </div>
          )}
        </>
      ) : (
        renderLinkItem(item)
      )}
    </div>
  )

  const settingsLinks =
    settingsItem?.children?.filter((child) => child.action !== "logout") ?? []
  const settingsExpanded = expandedItems.has(SETTINGS_LABEL)

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isDesktop || isOpen ? 0 : -320 }}
        className={cn(
          "fixed md:static inset-y-0 left-0 w-64 flex flex-col z-50 md:z-auto",
          "h-screen md:h-full md:min-h-0 overflow-hidden",
          bgClass,
          theme === "dark" ? "border-slate-700" : "border-gray-200",
          "border-r transition-transform duration-300",
        )}
      >
        <div className="shrink-0 px-6 py-5 border-b border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">Memorra</span>
          </div>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
          {mainItems.map((item) => renderNavItem(item))}
        </nav>

        {settingsItem && (
          <div
            className={cn(
              "shrink-0 border-t p-4",
              borderClass,
              theme === "dark" ? "bg-slate-900/40" : "bg-gray-50/80",
            )}
          >
            <button
              type="button"
              onClick={() => toggleExpand(SETTINGS_LABEL)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200",
                hoverClass,
                theme === "dark" ? "text-slate-200" : "text-gray-800",
              )}
              aria-expanded={settingsExpanded}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span className="text-sm font-semibold">{SETTINGS_LABEL}</span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform duration-200",
                  settingsExpanded && "rotate-180",
                )}
              />
            </button>

            {settingsExpanded && (
              <div className="mt-2 space-y-1">
                {settingsLinks.map((child) => renderLinkItem(child))}
                <SettingsLogoutButton variant="sidebar" className="mt-2" />
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "shrink-0 px-4 py-3 border-t",
            borderClass,
            theme === "dark" ? "bg-slate-900/50" : "bg-gray-50",
          )}
        >
          <p className="text-xs text-center opacity-60">Memorra Admin © 2026</p>
        </div>
      </motion.aside>
    </>
  )
}
