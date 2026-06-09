"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Zap, Users, TrendingUp, ClipboardList, MessageCircle, DollarSign } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import toast from "react-hot-toast"
import { useEffect, useRef } from "react"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

const AnimatedNumber = ({ value }: { value: string }) => {
  const motionValue = useMotionValue(0)
  const displayValue = useTransform(motionValue, (latest) => {
    // Parse the numeric part from the value string
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10)
    const rounded = Math.round(latest)
    
    // Re-add currency symbol or thousands separator
    if (value.startsWith("$")) {
      return `$${rounded.toLocaleString()}`
    }
    if (value.includes(",")) {
      return rounded.toLocaleString()
    }
    return rounded.toString()
  })

  useEffect(() => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10)
    
    const animation = animate(motionValue, numericValue, {
      duration: 2,
      ease: "easeOut",
    })

    return () => animation?.stop()
  }, [value, motionValue])

  return <motion.span>{displayValue}</motion.span>
}

export default function AdminDashboard() {
  const { theme } = useTheme()

  // Mock metrics tuned to Memorra's current subscription model:
  // - App is free to explore
  // - $8.99/month to unlock full features
  const MONTHLY_PRICE = 8.99
  const TOTAL_USERS = 1234
  const ACTIVE_SUBSCRIBERS = 567
  const ESTIMATED_MRR = ACTIVE_SUBSCRIBERS * MONTHLY_PRICE

  const stats = [
    {
      label: "Total Users",
      value: TOTAL_USERS.toLocaleString(),
      icon: <Users size={28} className="text-blue-500" />,
      color: "blue",
    },
    {
      label: "Active Subscribers",
      value: ACTIVE_SUBSCRIBERS.toLocaleString(),
      icon: <ClipboardList size={28} className="text-green-500" />,
      color: "green",
    },
    {
      label: "Messages",
      value: "2,891",
      icon: <MessageCircle size={28} className="text-purple-500" />,
      color: "purple",
    },
    {
      label: "Est. MRR",
      value: `$${ESTIMATED_MRR.toFixed(0)}`,
      icon: <DollarSign size={28} className="text-amber-500" />,
      color: "amber",
    },
  ]

  // User Status Data (Active vs Inactive)
  const userStatusData = [
    { name: "Active Users", value: 892, color: "#10b981", percentage: 72.3, trend: "+5.2%" },
    { name: "Inactive Users", value: 342, color: "#ef4444", percentage: 27.7, trend: "-2.1%" },
    { name: "Joined Today", value: 45, color: "#3b82f6", percentage: 3.6, trend: "+12%" },
    { name: "Joined Last 7 Days", value: 234, color: "#f59e0b", percentage: 18.9, trend: "+8.5%" },
  ]

  // Plans Bought Today Data — aligned with Basic (free) vs Premium ($8.99) model
  const plansBoughtData = [
    { name: "Free (Basic)", value: 45, color: "#3b82f6", percentage: 61.6, trend: "+10%" },
    { name: "Premium ($8.99)", value: 28, color: "#8b5cf6", percentage: 38.4, trend: "+14%" },
  ]

  const handleNotification = () => {
    toast.success("This is a theme-aware notification!")
  }

  // Enhanced Custom Label for Pie Chart
  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`
  }

  // Enhanced Custom Tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-lg border shadow-lg",
            theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
          )}
        >
          <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
            {data.name}
          </p>
          <p className={cn("text-sm font-bold mt-1", theme === "dark" ? "text-white" : "text-gray-900")}>
            Count: {data.value}
          </p>
          <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            {data.percentage.toFixed(1)}% of total
          </p>
          <p className={cn("text-xs font-semibold mt-1", data.trend.includes("+") ? "text-green-500" : "text-red-500")}>
            {data.trend}
          </p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1
          className={cn(
            "text-3xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-900",
          )}
        >
          Subscription & Growth Overview
        </h1>
        <p
          className={cn(
            "text-sm",
            theme === "dark" ? "text-slate-400" : "text-gray-600",
          )}
        >
          Track total users, paying subscribers, and recurring revenue for the $8.99/month plan.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-6 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 relative overflow-hidden",
              theme === "dark"
                ? "bg-linear-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500"
                : "bg-white border-gray-100 hover:border-gray-200",
            )}
          >
            {/* Subtle background glow effect based on card color */}
            <div className={cn(
              "absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40",
              stat.color === 'blue' ? 'bg-blue-500' :
              stat.color === 'green' ? 'bg-green-500' :
              stat.color === 'purple' ? 'bg-purple-500' :
              'bg-amber-500'
            )} />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium mb-2",
                    theme === "dark" ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  <AnimatedNumber value={stat.value} />
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* User Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
            theme === "dark"
              ? "bg-linear-to-br from-slate-800 to-slate-900 border-slate-700"
              : "bg-linear-to-br from-white to-gray-50 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={cn(
                  "text-lg font-semibold",
                  theme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                User Status Distribution
              </h3>
              <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                Total: {userStatusData.reduce((sum, item) => sum + item.value, 0)} users
              </p>
            </div>
            <motion.div
              whileInView={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={cn("w-10 h-10 rounded-full flex items-center justify-center", "bg-linear-to-br from-green-500 to-emerald-600")}
            >
              <Users size={20} className="text-white" />
            </motion.div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={userStatusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  color: theme === "dark" ? "#cbd5e1" : "#6b7280",
                  paddingTop: "20px",
                }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {userStatusData.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, shadow: "0 12px 20px rgba(0,0,0,0.1)" }}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300 relative overflow-hidden group",
                  theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-linear-to-br from-gray-50 to-gray-100 border-gray-200",
                )}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                    item.color === "#10b981" ? "bg-green-500" : "bg-red-500",
                  )}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        theme === "dark" ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {item.name}
                    </p>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        item.percentage > 50 ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600",
                      )}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <p className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {item.value.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="w-full bg-gray-300/30 rounded-full h-2 overflow-hidden mr-2">
                      <motion.div
                        className={cn("h-full rounded-full")}
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold whitespace-nowrap",
                        item.trend.includes("+") ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Plans Bought Today Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
            theme === "dark"
              ? "bg-linear-to-br from-slate-800 to-slate-900 border-slate-700"
              : "bg-linear-to-br from-white to-gray-50 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={cn(
                  "text-lg font-semibold",
                  theme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Plans Purchased Today
              </h3>
              <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                Total: {plansBoughtData.reduce((sum, item) => sum + item.value, 0)} plans
              </p>
            </div>
            <motion.div
              whileInView={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className={cn("w-10 h-10 rounded-full flex items-center justify-center", "bg-linear-to-br from-blue-500 to-purple-600")}
            >
              <TrendingUp size={20} className="text-white" />
            </motion.div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={plansBoughtData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {plansBoughtData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  color: theme === "dark" ? "#cbd5e1" : "#6b7280",
                  paddingTop: "20px",
                }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Enhanced Stats Grid - 2x2 for Plans */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {plansBoughtData.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, shadow: "0 12px 20px rgba(0,0,0,0.1)" }}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300 relative overflow-hidden group",
                  theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-linear-to-br from-gray-50 to-gray-100 border-gray-200",
                )}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: item.color }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        theme === "dark" ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {item.name}
                    </p>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <p className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {item.value.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="w-full bg-gray-300/30 rounded-full h-2 overflow-hidden mr-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold whitespace-nowrap",
                        item.trend.includes("+") ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Demo Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNotification}
        className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
      >
        Test Theme-Aware Notification
      </motion.button>
    </div>
  )
}
