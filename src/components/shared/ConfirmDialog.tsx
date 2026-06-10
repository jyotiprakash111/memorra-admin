"use client"

import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        disabled={loading}
        onClick={onCancel}
        className={cn(
          "absolute inset-0 transition-opacity",
          isDark ? "bg-black/70" : "bg-black/50",
        )}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={cn(
          "relative w-full max-w-md rounded-2xl border shadow-2xl",
          "transition-all duration-200 ease-out",
          isDark ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200",
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={cn(
            "absolute right-4 top-4 rounded-lg p-1.5 transition-colors",
            isDark
              ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
            loading && "pointer-events-none opacity-50",
          )}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-6 pt-7">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                variant === "danger"
                  ? isDark
                    ? "bg-red-500/20 text-red-400"
                    : "bg-red-100 text-red-600"
                  : isDark
                    ? "bg-green-500/20 text-green-400"
                    : "bg-green-100 text-green-600",
              )}
            >
              <AlertTriangle size={22} />
            </div>
            <div className="min-w-0 pr-6">
              <h2
                id="confirm-dialog-title"
                className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-message"
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  isDark ? "text-slate-400" : "text-gray-600",
                )}
              >
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors",
                isDark
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50",
                loading && "opacity-60 cursor-not-allowed",
              )}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors",
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700",
                loading && "opacity-70 cursor-not-allowed",
              )}
            >
              {loading ? "Please wait…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
