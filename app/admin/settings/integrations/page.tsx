"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Link, Unlink, Check, Copy, RefreshCw, Settings } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Integration {
  id: string; name: string; icon: string; status: string; description: string; connectedDate?: string; apiKey?: string
}

export default function IntegrationsPage() {
  const { theme } = useTheme()
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'stripe', name: 'Stripe', icon: '💳', status: 'connected', description: 'Payment processing', connectedDate: '2024-03-15', apiKey: 'sk_live_****' },
    { id: 'firebase', name: 'Firebase', icon: '🔥', status: 'connected', description: 'Real-time database & auth', connectedDate: '2024-02-10', apiKey: 'AIza****' },
    { id: 'sendgrid', name: 'SendGrid', icon: '📧', status: 'disconnected', description: 'Email notifications', apiKey: 'SG.****' },
    { id: 'slack', name: 'Slack', icon: '💬', status: 'disconnected', description: 'Team notifications', apiKey: '' },
    { id: 'aws', name: 'AWS S3', icon: '☁️', status: 'connected', description: 'File storage', connectedDate: '2024-01-20', apiKey: 'AKIA****' },
    { id: 'twilio', name: 'Twilio', icon: '📱', status: 'disconnected', description: 'SMS & calls', apiKey: '' },
  ])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'connected', connectedDate: new Date().toISOString().split('T')[0] } : i
    ))
    toast.success("Integration connected!")
  }

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'disconnected', connectedDate: undefined } : i
    ))
    toast.success("Integration disconnected!")
  }

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    toast.success("API key copied!")
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Integrations</h2>
        <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Connect third-party services to extend functionality</p>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Connected", value: connectedCount, color: "green" },
          { label: "Available", value: integrations.length, color: "blue" },
          { label: "Disconnected", value: integrations.filter(i => i.status === 'disconnected').length, color: "gray" },
        ].map((stat) => (
          <div key={stat.label} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-xs mb-1 font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color === "green" ? "text-green-500" : stat.color === "blue" ? "text-blue-500" : theme === "dark" ? "text-white" : "text-gray-900")}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Integrations Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, idx) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn("p-6 rounded-xl border cursor-pointer hover:shadow-lg transition-all", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
            onClick={() => setSelectedIntegration(integration)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{integration.name}</h3>
                  <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{integration.description}</p>
                </div>
              </div>
              <span className={cn("text-xs px-3 py-1 rounded-full font-semibold", integration.status === 'connected' ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500")}>
                {integration.status === 'connected' ? '✓ Connected' : 'Disconnected'}
              </span>
            </div>

            {integration.connectedDate && (
              <p className={cn("text-xs mb-4", theme === "dark" ? "text-slate-500" : "text-gray-500")}>Connected on {integration.connectedDate}</p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                integration.status === 'connected' ? handleDisconnect(integration.id) : handleConnect(integration.id)
              }}
              className={cn(
                "w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2",
                integration.status === 'connected'
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
              )}
            >
              {integration.status === 'connected' ? (
                <>
                  <Unlink size={16} />
                  Disconnect
                </>
              ) : (
                <>
                  <Link size={16} />
                  Connect
                </>
              )}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedIntegration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedIntegration.icon}</span>
                <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedIntegration.name} Details</h3>
              </div>
              <button onClick={() => setSelectedIntegration(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Status</label>
                <div className={cn("p-3 rounded-lg", theme === "dark" ? "bg-slate-700" : "bg-gray-100")}>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-full", selectedIntegration.status === 'connected' ? "bg-green-500" : "bg-gray-500")}></span>
                    <span className={cn("capitalize font-semibold", selectedIntegration.status === 'connected' ? "text-green-500" : "text-gray-500")}>
                      {selectedIntegration.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedIntegration.apiKey && (
                <div>
                  <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>API Key</label>
                  <div className={cn("flex items-center gap-2 p-3 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600" : "bg-gray-100 border-gray-300")}>
                    <code className={cn("flex-1 text-sm font-mono", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                      {showApiKey ? selectedIntegration.apiKey : selectedIntegration.apiKey.replace(/./g, "•")}
                    </code>
                    <button onClick={() => setShowApiKey(!showApiKey)} className="text-gray-500 hover:text-gray-700 p-1">
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleCopyApiKey(selectedIntegration.apiKey!)} className="text-blue-500 hover:text-blue-600 p-1">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => toast.success("Settings updated!")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  <Settings size={16} />
                  Configure
                </button>
                <button
                  onClick={() => toast.success("Settings refreshed!")}
                  className={cn("flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium", theme === "dark" ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300")}
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { AnimatePresence } from "framer-motion"
