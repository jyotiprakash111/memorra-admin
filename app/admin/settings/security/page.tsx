"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Lock, Eye, EyeOff, Shield, Smartphone, Key, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Session {
  id: string; device: string; location: string; lastActive: string; ipAddress: string
}

export default function SecuritySettingsPage() {
  const { theme } = useTheme()
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([
    { id: "1", device: "MacBook Pro", location: "San Francisco, CA", lastActive: "2 min ago", ipAddress: "192.168.1.1" },
    { id: "2", device: "iPhone 14", location: "San Francisco, CA", lastActive: "1 hour ago", ipAddress: "192.168.1.2" },
  ])

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("All fields are required")
      return
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match")
      return
    }
    await new Promise(r => setTimeout(r, 800))
    setPasswords({ current: "", new: "", confirm: "" })
    setShowPasswordFields(false)
    toast.success("Password changed successfully!")
  }

  const handleToggle2FA = async () => {
    await new Promise(r => setTimeout(r, 800))
    setTwoFactorEnabled(!twoFactorEnabled)
    toast.success(twoFactorEnabled ? "2FA disabled" : "2FA enabled successfully!")
  }

  const handleRevokeSession = (id: string) => {
    setSessions(s => s.filter(x => x.id !== id))
    toast.success("Session revoked")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Security Settings</h2>
        <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Manage your account security and privacy</p>
      </div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
      >
        <div className="flex items-center gap-3 mb-6">
          <Key size={24} />
          <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>Change Password</h3>
        </div>

        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Update Password
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none",
                  theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"
                )}
              />
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none",
                  theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"
                )}
              />
            </div>
            <div>
              <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Confirm Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none",
                  theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"
                )}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Save Password
              </button>
              <button
                onClick={() => setShowPasswordFields(false)}
                className={cn("px-4 py-2 rounded-lg font-medium", theme === "dark" ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Smartphone size={24} />
            <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>Two-Factor Authentication</h3>
          </div>
          <button
            onClick={handleToggle2FA}
            className={cn(
              "relative w-14 h-7 rounded-full transition-all",
              twoFactorEnabled ? "bg-green-500" : theme === "dark" ? "bg-slate-700" : "bg-gray-300"
            )}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full"
              animate={{ left: twoFactorEnabled ? "26px" : "2px" }}
            />
          </button>
        </div>
        <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
          {twoFactorEnabled ? "✓ 2FA is enabled on your account" : "Add an extra layer of security to your account"}
        </p>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} />
          <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>Active Sessions</h3>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className={cn("p-4 rounded-lg border flex justify-between items-start", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
              <div>
                <p className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{session.device}</p>
                <p className={cn("text-sm mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{session.location}</p>
                <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-500" : "text-gray-500")}>IP: {session.ipAddress} • Last active: {session.lastActive}</p>
              </div>
              <button
                onClick={() => handleRevokeSession(session.id)}
                className="px-3 py-1 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
