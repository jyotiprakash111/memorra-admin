"use client"

import { AnimatePresence } from "framer-motion"
import React, { Suspense, useState, useEffect } from "react"
import { Sidebar, type NavItem } from "./Sidebar"
import { Header } from "./Header"
import { AdminLoader } from "./AdminLoader"
import { AdminRouteProgress } from "./AdminRouteProgress"
import { Toaster } from "react-hot-toast"
import { useTheme } from "@/lib/theme-context"

interface AdminLayoutProps {
  children: React.ReactNode
  navItems?: NavItem[]
  headerTitle?: string
  headerRightContent?: React.ReactNode
}

import { 
  LayoutDashboard, Users, Image as ImageIcon, ShoppingBag, 
  BookHeart, Archive, Building2, Newspaper, Video, Music, 
  MessageSquare, Handshake, FileText, FileJson, 
  Palette, HelpCircle, MessageCircle, ShieldAlert, Settings, 
  Lock, Link as LinkIcon 
} from "lucide-react"

const defaultNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "User Management", href: "/admin/users", icon: <Users size={20} /> },
  { label: "User Posts", href: "/admin/posts", icon: <ImageIcon size={20} />, badge: 12 },
  // { label: "Products", href: "/admin/products", icon: <ShoppingBag size={20} /> },
  // { label: "Funeral Plans", href: "/admin/funeral-plans", icon: <BookHeart size={20} /> },
  { label: "Casket Design", href: "/admin/casket-design", icon: <Archive size={20} /> },
  { label: "Funeral Homes", href: "/admin/funeral-homes", icon: <Building2 size={20} /> },
  { label: "Obituaries", href: "/admin/obituaries", icon: <Newspaper size={20} /> },
  { label: "Video Messages", href: "/admin/video-messages", icon: <Video size={20} /> },
  { label: "Funeral Music", href: "/admin/funeral-music", icon: <Music size={20} /> },
  { label: "Cremation Urns", href: "/admin/cremation-urns", icon: <Archive size={20} /> },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare size={20} /> },
  { label: "Trusted Contacts", href: "/admin/trusted-contacts", icon: <Handshake size={20} /> },
  { label: "Legal Documents", href: "/admin/legal", icon: <FileText size={20} /> },
  { label: "Digital Legacy", href: "/admin/contents", icon: <FileJson size={20} />, badge: 3 },
  // { label: "Cascade Design", href: "/admin/cascade-design", icon: <Palette size={20} /> },
  { label: "FAQs", href: "/admin/faqs", icon: <HelpCircle size={20} /> },
  { label: "Feedback", href: "/admin/feedback", icon: <MessageCircle size={20} /> },
  { label: "Safety & Reports", href: "/admin/reports", icon: <ShieldAlert size={20} /> },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={20} />,
    children: [
      { label: "General", href: "/admin/settings/general", icon: <Settings size={18} /> },
      { label: "Security", href: "/admin/settings/security", icon: <Lock size={18} /> },
      { label: "Integrations", href: "/admin/settings/integrations", icon: <LinkIcon size={18} /> },
      { label: "Safety", href: "/admin/settings/safety", icon: <ShieldAlert size={18} /> },
    ],
  },
]

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const AdminLayout = ({
  children,
  navItems = defaultNavItems,
  headerTitle,
  headerRightContent,
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <AdminLoader variant="fullscreen" label="Loading admin panel..." />
  }

  return (
    <div
      className={cn(
        "flex h-screen transition-colors duration-300",
        theme === "dark" ? "bg-slate-900" : "bg-gray-50",
      )}
    >
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={headerTitle}
          rightContent={headerRightContent}
        />

        {/* Page Content */}
        <main
          className={cn(
            "relative flex-1 overflow-y-auto transition-colors duration-300",
            theme === "dark" ? "bg-slate-900" : "bg-gray-50",
          )}
        >
          <AdminRouteProgress />
          <AnimatePresence mode="wait">
            <div className="px-4 md:px-8 py-6">
              <Suspense fallback={<AdminLoader variant="page" label="Loading content..." />}>
                {children}
              </Suspense>
            </div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1e293b" : "#ffffff",
            color: theme === "dark" ? "#f1f5f9" : "#111827",
            border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
          },
        }}
      />
    </div>
  )
}
