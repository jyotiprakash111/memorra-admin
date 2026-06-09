"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Download, Trash2, Search, Eye, EyeOff, FileText } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Document {
  id: string; title: string; type: string; owner: string; status: string; uploadedAt: string; isPublic: boolean
}

const mockDocs: Document[] = [
  { id: "d1", title: "Last Will - John Doe", type: "will", owner: "John Doe", status: "signed", uploadedAt: "2024-01-15", isPublic: false },
  { id: "d2", title: "POA - Jane Smith", type: "poa", owner: "Jane Smith", status: "notarized", uploadedAt: "2024-02-01", isPublic: false },
]

export default function LegalPage() {
  const { theme } = useTheme()
  const [docs, setDocs] = useState<Document[]>(mockDocs)
  const [search, setSearch] = useState("")
  const filtered = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.owner.toLowerCase().includes(search.toLowerCase()))
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Legal Documents</h2></div>
      <motion.div className="grid grid-cols-3 gap-4">
        {[{ label: "Total Documents", value: docs.length, icon: FileText }, { label: "Expiring", value: 1, icon: FileText }, { label: "Expired", value: 0, icon: FileText }].map((s) => (
          <div key={s.label} className={cn("p-6 rounded-xl border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-sm mb-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{s.label}</p>
            <p className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{s.value}</p>
          </div>
        ))}
      </motion.div>
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <Search size={20} /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none" />
      </div>
      <div className={cn("rounded-lg border overflow-hidden", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <table className="w-full"><thead><tr className={theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}><th className="px-6 py-4 text-left">Title</th><th className="px-6 py-4 text-left">Type</th><th className="px-6 py-4 text-left">Status</th><th className="px-6 py-4 text-left">Owner</th><th className="px-6 py-4">Actions</th></tr></thead><tbody>
          {filtered.map((d) => (<tr key={d.id} className={cn("border-t", theme === "dark" ? "border-slate-700" : "border-gray-200")}><td className="px-6 py-4 text-sm">{d.title}</td><td className="px-6 py-4 text-sm"><span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">{d.type}</span></td><td className="px-6 py-4 text-sm">{d.status}</td><td className="px-6 py-4 text-sm">{d.owner}</td><td className="px-6 py-4 flex gap-2"><button className="text-blue-500"><Download size={16} /></button><button onClick={() => { setDocs(docs => docs.map(x => x.id === d.id ? {...x, isPublic: !x.isPublic} : x)); toast.success("Updated") }} className="text-purple-500">{d.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}</button><button onClick={() => { setDocs(docs => docs.filter(x => x.id !== d.id)); toast.success("Deleted") }} className="text-red-500"><Trash2 size={16} /></button></td></tr>))}
        </tbody></table>
      </div>
    </motion.div>
  )
}
