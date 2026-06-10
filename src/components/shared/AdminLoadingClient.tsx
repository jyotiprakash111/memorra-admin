"use client"

import { useEffect, useState } from "react"
import { AdminLoader } from "./AdminLoader"
import { ADMIN_LOADER_DURATION_MS } from "./admin-loader-constants"

export function AdminLoadingClient({ label = "Loading page..." }: { label?: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), ADMIN_LOADER_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return <AdminLoader variant="minimal" label={label} />
}
