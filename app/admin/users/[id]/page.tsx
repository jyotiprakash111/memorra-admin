"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, CheckCircle, AlertCircle, Edit2, Download, Trash2, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface UserPlan {
  type: string; name: string; price: number; status: string; startDate: string; endDate: string; features: string[]; billingCycle: string
}

interface UserData {
  id: string; name: string; email: string; phone: string; avatar: string; status: string; joinedDate: string; lastLogin: string; location: string; verified: boolean; plan: UserPlan; storageUsed: number; totalStorage: number; totalMemorials: number; trustedContacts: number; documentsUploaded: number
}

const mockUserData: UserData = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "JD",
  status: "active",
  joinedDate: "2024-01-15",
  lastLogin: "2024-04-07",
  location: "San Francisco, CA",
  verified: true,
  plan: {
    type: "premium",
    name: "Premium Plus",
    price: 29.99,
    status: "active",
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    billingCycle: "monthly",
    features: [
      "Unlimited memorials",
      "Advanced sharing controls",
      "Priority support",
      "Lifetime storage",
      "Video uploads",
      "Custom branding"
    ]
  },
  storageUsed: 2.5,
  totalStorage: 100,
  totalMemorials: 5,
  trustedContacts: 3,
  documentsUploaded: 12
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { theme } = useTheme()
  const [user, setUser] = useState<UserData>(mockUserData)
  const [isEditing, setIsEditing] = useState(false)

  const storagePercent = (user.storageUsed / user.totalStorage) * 100

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <motion.button whileHover={{ x: -4 }} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
            <ArrowLeft size={24} />
          </motion.button>
        </Link>
        <div className="flex-1">
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>User Details</h1>
          <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-blue-500">
            <Edit2 size={20} />
          </button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.avatar}
              </div>
              <div className="flex-1">
                <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-semibold">
                    {user.status.toUpperCase()}
                  </span>
                  {user.verified && <CheckCircle size={16} className="text-blue-500" />}
                </div>
                <p className={cn("text-sm mt-3", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Phone", value: user.phone },
                { icon: MapPin, label: "Location", value: user.location },
                { icon: Calendar, label: "Last Login", value: new Date(user.lastLogin).toLocaleDateString() },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className={cn("p-3 rounded-lg border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
                    <p className={cn("text-xs font-medium mb-1 flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                      <Icon size={14} /> {item.label}
                    </p>
                    <p className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>{item.value}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Usage Statistics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Account Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Memorials", value: user.totalMemorials, icon: "📝" },
                { label: "Documents", value: user.documentsUploaded, icon: "📄" },
                { label: "Trusted Contacts", value: user.trustedContacts, icon: "🤝" },
                { label: "Account Age", value: "3M", icon: "📅" },
              ].map((stat) => (
                <div key={stat.label} className={cn("p-3 rounded-lg border text-center", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Storage Usage */}
            <div className="mt-6">
              <h4 className={cn("text-sm font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>Storage Usage</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className={cn("h-2 rounded-full overflow-hidden", theme === "dark" ? "bg-slate-700" : "bg-gray-200")}>
                    <motion.div
                      className="h-full bg-linear-to-r from-green-500 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${storagePercent}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </div>
                </div>
                <p className={cn("text-sm font-semibold whitespace-nowrap", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {user.storageUsed.toFixed(1)}GB / {user.totalStorage}GB
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Plan Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <h3 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            <CreditCard size={20} /> Current Plan
          </h3>

          <div className={cn("p-4 rounded-lg mb-4 border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-linear-to-br from-green-50 to-green-100 border-green-200")}>
            <p className="text-2xl font-bold text-green-600">{user.plan.name}</p>
            <p className="text-sm text-green-600 mt-1">${user.plan.price}/month</p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-semibold">Active</span>
            </div>
          </div>

          <div className={cn("p-3 rounded-lg mb-4 border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
            <p className="text-xs font-semibold mb-1">Billing Cycle</p>
            <p className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{user.plan.billingCycle.toUpperCase()}</p>
            <p className={cn("text-xs mt-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
              Renews on {new Date(user.plan.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            <h4 className={cn("text-sm font-semibold mb-3", theme === "dark" ? "text-white" : "text-gray-900")}>Features Included</h4>
            <div className="space-y-2">
              {user.plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-opacity-20">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
              <Edit2 size={14} /> Modify Plan
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium">
              <MessageSquare size={14} /> Send Message
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium">
              <Trash2 size={14} /> Suspend Account
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
