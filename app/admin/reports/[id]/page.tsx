"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { ArrowLeft, Flag, Clock, User, FileText, CheckCircle, AlertTriangle, MessageSquare, Download, Archive, Trash2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import Link from "next/link"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Report {
  id: string; title: string; description: string; reportedBy: string; reportedAt: string; status: string; severity: string; category: string; evidence: Array<{ type: string; url: string; name: string }>; actions: Array<{ date: string; action: string; by: string }>; notes: string
}

const mockReport: Report = {
  id: "report-001",
  title: "Inappropriate Content Upload",
  description: "User uploaded explicit content in memorial section",
  reportedBy: "John Smith",
  reportedAt: "2024-04-05T14:30:00Z",
  status: "open",
  severity: "high",
  category: "content-violation",
  evidence: [
    { type: "image", url: "/image1.jpg", name: "content-screenshot.jpg" },
    { type: "link", url: "https://example.com", name: "offending-post" },
  ],
  actions: [
    { date: "2024-04-05", action: "Report filed", by: "System" },
    { date: "2024-04-06", action: "Flagged for review", by: "Admin" },
  ],
  notes: "Requires immediate action",
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme()
  const [report, setReport] = useState<Report>(mockReport)
  const [newNote, setNewNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setReport(prev => ({ ...prev, status: newStatus }))
    toast.success(`Report marked as ${newStatus}`)
    setIsLoading(false)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setReport(prev => ({
      ...prev,
      actions: [...prev.actions, { date: new Date().toISOString().split('T')[0], action: newNote, by: "Current Admin" }]
    }))
    setNewNote("")
    toast.success("Note added!")
    setIsLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/20"
      case "high":
        return "text-orange-500 bg-orange-500/20"
      case "medium":
        return "text-yellow-500 bg-yellow-500/20"
      default:
        return "text-blue-500 bg-blue-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-500 bg-red-500/20"
      case "reviewing":
        return "text-yellow-500 bg-yellow-500/20"
      case "resolved":
        return "text-green-500 bg-green-500/20"
      default:
        return "text-gray-500 bg-gray-500/20"
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/admin/reports">
          <motion.button whileHover={{ x: -4 }} className="p-2 hover:bg-opacity-20 hover:bg-gray-400 rounded-lg">
            <ArrowLeft size={24} />
          </motion.button>
        </Link>
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Report Details</h1>
          <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{params.id}</p>
        </div>
      </div>

      {/* Main Report Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{report.title}</h2>
            <p className={cn("mt-2 text-base", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{report.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getSeverityColor(report.severity))}>
              {report.severity.toUpperCase()}
            </span>
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusColor(report.status))}>
              {report.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Reported By", value: report.reportedBy, icon: User },
            { label: "Category", value: report.category.replace('-', ' '), icon: Flag },
            { label: "Date", value: new Date(report.reportedAt).toLocaleDateString(), icon: Clock },
            { label: "Status", value: report.status, icon: CheckCircle },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={cn("p-3 rounded-lg border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
                <p className={cn("text-xs font-medium mb-1 text-gray-500")}>{item.label}</p>
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <p className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Status Actions */}
        <div className="flex gap-3">
          {["open", "reviewing", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isLoading || report.status === status}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize",
                report.status === status
                  ? "bg-gray-500/30 text-gray-500"
                  : theme === "dark"
                    ? "hover:bg-slate-700 text-white bg-slate-700/50"
                    : "hover:bg-gray-200 text-gray-900 bg-gray-100"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cn("lg:col-span-2 p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <h3 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            <FileText size={20} /> Evidence
          </h3>
          <div className="space-y-3">
            {report.evidence.map((item, idx) => (
              <div key={idx} className={cn("p-4 rounded-lg border flex justify-between items-center", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
                <div>
                  <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>{item.name}</p>
                  <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Type: {item.type}</p>
                </div>
                <button className="text-blue-500 hover:text-blue-600 p-2">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn("p-6 rounded-xl border space-y-3", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Quick Actions</h3>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            <MessageSquare size={16} /> Contact User
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium">
            <AlertTriangle size={16} /> Escalate
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            <Archive size={16} /> Archive
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 font-medium">
            <Trash2 size={16} /> Delete
          </button>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <h3 className={cn("text-lg font-semibold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>Activity Timeline</h3>
        <div className="space-y-4">
          {report.actions.map((action, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn("w-4 h-4 rounded-full", theme === "dark" ? "bg-slate-600" : "bg-gray-400")}></div>
                {idx < report.actions.length - 1 && <div className={cn("w-1 h-8", theme === "dark" ? "bg-slate-600" : "bg-gray-400")}></div>}
              </div>
              <div className="pb-4">
                <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>{action.action}</p>
                <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-500")}>by {action.by} • {action.date}</p>
              </div>
            </div>
          ))}

          {/* Add Note Section */}
          <div className="mt-6 pt-6 border-t border-opacity-20">
            <div className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note to this report..."
                className={cn(
                  "w-full p-3 rounded-lg border outline-none text-sm",
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
