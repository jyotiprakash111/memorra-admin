"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SlidersHorizontal, Lock, Link as LinkIcon, ShieldAlert } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { SettingsLogoutButton } from "@/src/components/shared/SettingsLogoutButton"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

const settingsTabs = [
  { label: "General", href: "/admin/settings/general", icon: SlidersHorizontal },
  { label: "Security", href: "/admin/settings/security", icon: Lock },
  { label: "Integrations", href: "/admin/settings/integrations", icon: LinkIcon },
  { label: "Safety", href: "/admin/settings/safety", icon: ShieldAlert },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border",
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
        )}
      >
        <div>
          <h2
            className={cn(
              "text-2xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            Settings
          </h2>
          <p className={cn("text-sm mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage admin preferences and account session
          </p>
        </div>
        <SettingsLogoutButton variant="card" />
      </div>

      <div className="flex flex-wrap gap-2">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                active
                  ? "bg-green-500 text-white border-green-500"
                  : theme === "dark"
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}
