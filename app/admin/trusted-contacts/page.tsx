"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Search, Shield, CheckCircle, Mail } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ")

interface Contact {
  id: string; name: string; email: string; role: string; accessLevel: string; status: string; users: number
}

const mockContacts: Contact[] = [
  { id: "c1", name: "Jane Executor", email: "jane@example.com", role: "executor", accessLevel: "admin", status: "active", users: 45 },
  { id: "c2", name: "Mike Healthcare", email: "mike@example.com", role: "healthcare_proxy", accessLevel: "edit", status: "active", users: 32 },
]

export default function TrustedContactsPage() {
  const { theme } = useTheme()
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [search, setSearch] = useState("")
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  const active = contacts.filter(c => c.status === 'active').length; const pending = 1
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Trusted Contacts</h2></div>
      <motion.div className="grid grid-cols-3 gap-4">
        {[{ label: "Total Contacts", value: contacts.length, icon: Shield }, { label: "Active", value: active, icon: CheckCircle }, { label: "Pending", value: pending, icon: Mail }].map((s) => (
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
        <table className="w-full"><thead><tr className={theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}><th className="px-6 py-4 text-left">Name</th><th className="px-6 py-4 text-left">Email</th><th className="px-6 py-4 text-left">Role</th><th className="px-6 py-4 text-left">Status</th><th className="px-6 py-4 text-left">Users</th><th className="px-6 py-4">Actions</th></tr></thead><tbody>
          {filtered.map((contact) => (
            <tr key={contact.id} className={cn("border-t", theme === "dark" ? "border-slate-700" : "border-gray-200")}>
              <td className="px-6 py-4 text-sm">{contact.name}</td>
              <td className="px-6 py-4 text-sm">{contact.email}</td>
              <td className="px-6 py-4 text-sm"><span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-500">{contact.role}</span></td>
              <td className="px-6 py-4"><span className={cn("text-xs px-2 py-1 rounded", contact.status === "active" ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500")}>{contact.status}</span></td>
              <td className="px-6 py-4 text-sm">{contact.users}</td>
              <td className="px-6 py-4 flex gap-2">
                <button className="text-blue-500"><Edit2 size={16} /></button>
                <button onClick={() => { setContacts(list => list.filter(x => x.id !== contact.id)); toast.success("Deleted") }} className="text-red-500"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </motion.div>
  )
}
