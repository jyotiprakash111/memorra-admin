"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { MessageSquare, Star, Trash2, Archive, Search } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Feedback {
  id: string; userId: string; userName: string; email: string; rating: number; message: string; category: string; status: string; submittedAt: string
}

const mockFeedback: Feedback[] = [
  { id: "fb1", userId: "user-001", userName: "Sarah Johnson", email: "sarah@example.com", rating: 5, message: "Great app, very helpful for organizing memories", category: "feature", status: "new", submittedAt: "2024-04-06" },
  { id: "fb2", userId: "user-002", userName: "Mike Davis", email: "mike@example.com", rating: 4, message: "Good, but could use better mobile experience", category: "bug", status: "reviewed", submittedAt: "2024-04-05" },
]

export default function FeedbackPage() {
  const { theme } = useTheme()
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(mockFeedback)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = feedbackList.filter(f => 
    (filter === "all" || f.status === filter) &&
    (f.userName.toLowerCase().includes(search.toLowerCase()) || f.message.toLowerCase().includes(search.toLowerCase()))
  )

  const stats = [
    { label: "Total Feedback", value: feedbackList.length },
    { label: "Avg Rating", value: (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1) },
    { label: "New", value: feedbackList.filter(f => f.status === "new").length },
    { label: "Reviewed", value: feedbackList.filter(f => f.status === "reviewed").length },
  ]

  const handleDelete = (id: string) => {
    setFeedbackList(prev => prev.filter(f => f.id !== id))
    toast.success("Feedback deleted")
  }

  const handleMarkReviewed = (id: string) => {
    setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: "reviewed" } : f))
    toast.success("Marked as reviewed")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>User Feedback</h2>
        <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Review and manage user feedback</p>
      </div>

      <motion.div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
            <p className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="flex gap-4">
        <div className={cn("flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <Search size={20} />
          <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={cn("px-4 py-3 rounded-lg border outline-none", theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200")}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((fb) => (
          <motion.div key={fb.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{fb.userName}</h4>
                <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{fb.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < fb.rating ? "fill-yellow-500 text-yellow-500" : theme === "dark" ? "text-slate-600" : "text-gray-300"} />
                  ))}
                </div>
                <span className={cn("text-xs px-2 py-1 rounded font-semibold", fb.status === "new" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500")}>
                  {fb.status}
                </span>
              </div>
            </div>

            <p className={cn("text-sm mb-3", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{fb.message}</p>

            <div className="flex items-center justify-between">
              <span className={cn("text-xs", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                {fb.category} • {fb.submittedAt}
              </span>
              <div className="flex gap-2">
                {fb.status === "new" && (
                  <button onClick={() => handleMarkReviewed(fb.id)} className="text-green-500 hover:text-green-600 text-sm font-medium">
                    Mark Reviewed
                  </button>
                )}
                <button className="text-blue-500 hover:text-blue-600 p-1">
                  <Archive size={16} />
                </button>
                <button onClick={() => handleDelete(fb.id)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
