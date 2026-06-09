"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Save, Mail, Globe, Clock, Bell, DollarSign } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

export default function GeneralSettingsPage() {
  const { theme } = useTheme()
  const [settings, setSettings] = useState({
    appName: "Memorra",
    supportEmail: "support@memorra.com",
    websiteUrl: "https://memorra.com",
    timezone: "UTC-5",
    maintenanceMode: false,
    currency: "USD",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("General settings saved successfully!")
    setIsLoading(false)
  }

  const sections = [
    {
      title: "Application",
      icon: "📱",
      fields: [
        { label: "App Name", field: "appName", type: "text", icon: Globe },
        { label: "Support Email", field: "supportEmail", type: "email", icon: Mail },
      ]
    },
    {
      title: "Contact & Web",
      icon: "🌐",
      fields: [
        { label: "Website URL", field: "websiteUrl", type: "text", icon: Globe },
        { label: "Timezone", field: "timezone", type: "text", icon: Clock },
      ]
    },
    {
      title: "System",
      icon: "⚙️",
      fields: [
        { label: "Currency", field: "currency", type: "text", icon: DollarSign },
        { label: "Maintenance Mode", field: "maintenanceMode", type: "toggle", icon: Bell },
      ]
    }
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>General Settings</h2>
        <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Manage your application's core settings</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-xl border",
              theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{section.icon}</span>
              <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{section.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.field}>
                    <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        {field.label}
                      </div>
                    </label>
                    {field.type === "toggle" ? (
                      <button
                        onClick={() => handleChange(field.field, !settings[field.field as keyof typeof settings])}
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-all",
                          settings[field.field as keyof typeof settings] ? "bg-green-500" : theme === "dark" ? "bg-slate-700" : "bg-gray-300"
                        )}
                      >
                        <motion.div
                          className="absolute top-1 w-5 h-5 bg-white rounded-full"
                          animate={{ left: settings[field.field as keyof typeof settings] ? "22px" : "2px" }}
                        />
                      </button>
                    ) : (
                      <input
                        type={field.type}
                        value={String(settings[field.field as keyof typeof settings])}
                        onChange={(e) => handleChange(field.field, e.target.value)}
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border outline-none transition-all",
                          theme === "dark"
                            ? "bg-slate-700 border-slate-600 text-white focus:border-green-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-green-500"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-75"
      >
        <Save size={18} />
        {isLoading ? "Saving..." : "Save Settings"}
      </motion.button>
    </motion.div>
  )
}
