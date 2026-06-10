"use client"

import { Loader2, LogOut } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useAdminLogout } from "./useAdminLogout"
import { ConfirmDialog } from "./ConfirmDialog"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface SettingsLogoutButtonProps {
  variant?: "sidebar" | "card"
  className?: string
}

export function SettingsLogoutButton({
  variant = "sidebar",
  className,
}: SettingsLogoutButtonProps) {
  const { theme } = useTheme()
  const {
    isLoggingOut,
    confirmOpen,
    openLogoutConfirm,
    closeLogoutConfirm,
    confirmLogout,
  } = useAdminLogout()

  const icon = isLoggingOut ? (
    <Loader2 size={18} className="shrink-0 animate-spin" />
  ) : (
    <LogOut size={18} className="shrink-0" />
  )

  const buttonClass =
    variant === "card"
      ? cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors",
          theme === "dark"
            ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
          isLoggingOut && "opacity-60 cursor-not-allowed",
          className,
        )
      : cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold border transition-colors",
          theme === "dark"
            ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
          isLoggingOut && "opacity-60 cursor-not-allowed",
          className,
        )

  return (
    <>
      <button
        type="button"
        onClick={openLogoutConfirm}
        disabled={isLoggingOut}
        className={buttonClass}
      >
        {icon}
        {variant === "card" ? (
          isLoggingOut ? "Signing out…" : "Log out"
        ) : (
          <span>{isLoggingOut ? "Signing out…" : "Log out"}</span>
        )}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out of admin panel?"
        message="You will be signed out and need to sign in again to access the Memorra admin panel."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
        loading={isLoggingOut}
        onConfirm={confirmLogout}
        onCancel={closeLogoutConfirm}
      />
    </>
  )
}
