"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { HelpCircle, Plus, Edit2, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface FAQ {
  id: string; question: string; answer: string; category: string; views: number; helpful: number
}

const mockFAQs: FAQ[] = [
  { id: "f1", question: "How do I create a digital legacy?", answer: "You can create a digital legacy by uploading photos, videos, and documents to your memorial.", category: "Getting Started", views: 245, helpful: 198 },
  { id: "f2", question: "How do I invite trusted contacts?", answer: "Go to Trusted Contacts and click 'Add Contact' to invite family or friends.", category: "Trusted Contacts", views: 189, helpful: 156 },
]

export default function FAQsPage() {
  const { theme } = useTheme()
  const [faqs, setFAQs] = useState<FAQ[]>(mockFAQs)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setFAQs(prev => prev.filter(f => f.id !== id))
    toast.success("FAQ deleted")
  }

  const categories = [...new Set(faqs.map(f => f.category))]
  const stats = [
    { label: "Total FAQs", value: faqs.length },
    { label: "Total Views", value: faqs.reduce((sum, f) => sum + f.views, 0) },
    { label: "Avg Helpful", value: Math.floor(faqs.reduce((sum, f) => sum + f.helpful, 0) / faqs.length) },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>FAQs</h2>
          <p className={cn("mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Manage frequently asked questions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      <motion.div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
            <p className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {categories.map((category) => (
        <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>{category}</h3>
          <div className="space-y-3">
            {faqs.filter(f => f.category === category).map((faq) => (
              <div key={faq.id} className={cn("rounded-lg border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200")}>
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-all"
                >
                  <span className={cn("font-medium text-left", theme === "dark" ? "text-white" : "text-gray-900")}>{faq.question}</span>
                  <div className="flex items-center gap-2">
                    <ChevronDown size={18} className={cn("transition-transform", expandedId === faq.id && "rotate-180")} />
                  </div>
                </button>
                {expandedId === faq.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className={cn("px-4 pb-4 border-t", theme === "dark" ? "border-slate-600" : "border-gray-200")}>
                    <p className={cn("text-sm mb-3", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{faq.answer}</p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>{faq.views} views • {faq.helpful} marked helpful</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-600 text-sm"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(faq.id)} className="text-red-500 hover:text-red-600 text-sm"><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
