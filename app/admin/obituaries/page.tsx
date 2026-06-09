"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, Calendar, Eye, User, FileText, X } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface Obituary {
  id: string
  deceasedName: string
  dateOfBirth: string
  dateOfDeath: string
  /** Shown to users as the memorial message heading */
  title: string
  /** Personal message for the deceased — shown to users under the title */
  message: string
  author: string
  status: "draft" | "published" | "archived"
  views: number
  createdAt: string
  publishedAt?: string
  featured: boolean
}

type ObituaryFormData = Omit<Obituary, "id" | "views" | "createdAt" | "publishedAt"> & {
  publishedAt: string
}

const emptyObituaryForm: ObituaryFormData = {
  deceasedName: "",
  dateOfBirth: "",
  dateOfDeath: "",
  title: "",
  message: "",
  author: "",
  status: "draft",
  featured: false,
  publishedAt: "",
}

const inputClass = (theme: string) =>
  cn(
    "w-full px-4 py-2 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-green-500/40",
    theme === "dark"
      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
  )

const labelClass = (theme: string) =>
  cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")

function truncateContent(text: string, max = 120) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

// Mock Data
const mockObituaries: Obituary[] = [
  {
    id: "obit1",
    deceasedName: "Margaret Johnson",
    dateOfBirth: "1938-03-15",
    dateOfDeath: "2024-04-10",
    title: "In Loving Memory",
    message:
      "Margaret was a beloved mother, grandmother, and community volunteer. Her warmth and kindness touched everyone who knew her.",
    author: "Emily Johnson",
    status: "published",
    views: 1240,
    createdAt: "2024-04-10",
    publishedAt: "2024-04-11",
    featured: true,
  },
  {
    id: "obit2",
    deceasedName: "Robert Williams",
    dateOfBirth: "1945-07-22",
    dateOfDeath: "2024-04-05",
    title: "Forever in Our Hearts",
    message: "Robert was known for his kindness and dedication to his family. He will be deeply missed.",
    author: "Sarah Williams",
    status: "published",
    views: 856,
    createdAt: "2024-04-05",
    publishedAt: "2024-04-06",
    featured: false,
  },
  {
    id: "obit3",
    deceasedName: "James Turner",
    dateOfBirth: "1950-12-01",
    dateOfDeath: "2024-03-28",
    title: "A Message from the Family",
    message: "Work in progress...",
    author: "David Turner",
    status: "draft",
    views: 0,
    createdAt: "2024-03-28",
    featured: false,
  },
  {
    id: "obit4",
    deceasedName: "Patricia Davis",
    dateOfBirth: "1935-05-18",
    dateOfDeath: "2024-02-14",
    title: "Celebrating a Life Well Lived",
    message:
      "Patricia dedicated her life to teaching and mentoring young scholars. Her legacy lives on in every student she inspired.",
    author: "Michael Davis",
    status: "archived",
    views: 2340,
    createdAt: "2024-02-14",
    publishedAt: "2024-02-15",
    featured: false,
  },
]

export default function ObituariesPage() {
  const { theme } = useTheme()
  const [obituaries, setObituaries] = useState<Obituary[]>(mockObituaries)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all")
  const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ObituaryFormData>(emptyObituaryForm)

  const filtered = obituaries.filter((obit) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      obit.deceasedName.toLowerCase().includes(q) ||
      obit.author.toLowerCase().includes(q) ||
      obit.title.toLowerCase().includes(q) ||
      obit.message.toLowerCase().includes(q)
    const matchesFilter = filterStatus === "all" || obit.status === filterStatus
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    if (!showModal) return
    if (selectedObituary) {
      setFormData({
        deceasedName: selectedObituary.deceasedName,
        dateOfBirth: selectedObituary.dateOfBirth,
        dateOfDeath: selectedObituary.dateOfDeath,
        title: selectedObituary.title,
        message: selectedObituary.message,
        author: selectedObituary.author,
        status: selectedObituary.status,
        featured: selectedObituary.featured,
        publishedAt: selectedObituary.publishedAt ?? "",
      })
    } else {
      setFormData({ ...emptyObituaryForm })
    }
  }, [showModal, selectedObituary])

  const closeModal = () => {
    setShowModal(false)
    setSelectedObituary(null)
    setFormData({ ...emptyObituaryForm })
  }

  const updateField = <K extends keyof ObituaryFormData>(key: K, value: ObituaryFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const deceasedName = formData.deceasedName.trim()
    const author = formData.author.trim()
    const title = formData.title.trim()
    const message = formData.message.trim()

    if (!deceasedName) {
      toast.error("Deceased name is required")
      return
    }
    if (!title) {
      toast.error("Message title is required")
      return
    }
    if (!message) {
      toast.error("Message for the deceased is required")
      return
    }
    if (!author) {
      toast.error("Author name is required")
      return
    }
    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required")
      return
    }
    if (!formData.dateOfDeath) {
      toast.error("Date of death is required")
      return
    }
    if (formData.dateOfDeath < formData.dateOfBirth) {
      toast.error("Date of death cannot be before date of birth")
      return
    }

    const today = new Date().toISOString().split("T")[0]
    const publishedAt =
      formData.status === "published"
        ? formData.publishedAt || selectedObituary?.publishedAt || today
        : undefined

    if (selectedObituary) {
      setObituaries((prev) =>
        prev.map((o) =>
          o.id === selectedObituary.id
            ? {
                ...o,
                deceasedName,
                dateOfBirth: formData.dateOfBirth,
                dateOfDeath: formData.dateOfDeath,
                title,
                message,
                author,
                status: formData.status,
                featured: formData.featured,
                publishedAt,
              }
            : o,
        ),
      )
      toast.success("Obituary updated")
    } else {
      const newObituary: Obituary = {
        id: `obit-${Date.now()}`,
        deceasedName,
        dateOfBirth: formData.dateOfBirth,
        dateOfDeath: formData.dateOfDeath,
        title,
        message,
        author,
        status: formData.status,
        views: 0,
        createdAt: today,
        publishedAt,
        featured: formData.featured,
      }
      setObituaries((prev) => [newObituary, ...prev])
      toast.success("Obituary created")
    }

    closeModal()
  }

  const handleDelete = (id: string) => {
    setObituaries(obituaries.filter((o) => o.id !== id))
    toast.success("Obituary deleted")
    if (selectedObituary?.id === id) closeModal()
  }

  const handleEdit = (obit: Obituary) => {
    setSelectedObituary(obit)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedObituary(null)
    setShowModal(true)
  }

  const handlePublish = (id: string) => {
    setObituaries(
      obituaries.map((o) =>
        o.id === id
          ? { ...o, status: "published" as const, publishedAt: new Date().toISOString().split("T")[0] }
          : o,
      ),
    )
    toast.success("Obituary published")
  }

  const handleArchive = (id: string) => {
    setObituaries(obituaries.map((o) => (o.id === id ? { ...o, status: "archived" as const } : o)))
    toast.success("Obituary archived")
  }

  const handleToggleFeatured = (id: string) => {
    setObituaries(obituaries.map((o) => (o.id === id ? { ...o, featured: !o.featured } : o)))
    toast.success("Featured status updated")
  }

  const stats = [
    { label: "Total Obituaries", value: obituaries.length, icon: "📝", color: "from-blue-500 to-blue-600" },
    { label: "Published", value: obituaries.filter((o) => o.status === "published").length, icon: "✓", color: "from-green-500 to-green-600" },
    { label: "Draft", value: obituaries.filter((o) => o.status === "draft").length, icon: "📄", color: "from-yellow-500 to-yellow-600" },
    { label: "Total Views", value: obituaries.reduce((sum, o) => sum + o.views, 0), icon: "👁️", color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Obituary Management
          </h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Create, publish, and manage obituary notices
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} /> New Obituary
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-lg border transition-all",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
                <p className={cn("text-3xl font-bold mt-2", theme === "dark" ? "text-white" : "text-gray-900")}>{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500",
            )}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className={cn(
            "px-4 py-2 rounded-lg border transition-colors",
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500",
          )}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Obituaries Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
        {filtered.map((obit) => (
          <motion.div
            key={obit.id}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "p-6 rounded-lg border transition-all",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                      {obit.title}
                    </h3>
                    <p className={cn("text-sm mt-0.5", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                      {obit.deceasedName}
                    </p>
                  </div>
                  {obit.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Featured</span>}
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold rounded",
                      obit.status === "published"
                        ? "bg-green-100 text-green-800"
                        : obit.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {obit.status.charAt(0).toUpperCase() + obit.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <Calendar size={16} /> {obit.dateOfBirth} - {obit.dateOfDeath}
                  </p>
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <User size={16} /> By {obit.author}
                  </p>
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <Eye size={16} /> {obit.views} views
                  </p>
                  <p className={cn("text-sm mt-2 line-clamp-2", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                    {truncateContent(obit.message)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {obit.status === "draft" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handlePublish(obit.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Publish
                  </motion.button>
                )}
                {obit.status === "published" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleToggleFeatured(obit.id)}
                      className={cn(
                        "px-3 py-1 text-sm rounded transition-colors",
                        obit.featured
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-gray-300 text-gray-800 hover:bg-gray-400",
                      )}
                    >
                      {obit.featured ? "★ Featured" : "☆ Feature"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleArchive(obit.id)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Archive
                    </motion.button>
                  </>
                )}
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(obit)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded">
                  <Edit2 size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(obit.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded">
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 text-center rounded-lg", theme === "dark" ? "bg-slate-800" : "bg-gray-100")}>
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className={cn("text-lg font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            {searchTerm || filterStatus !== "all"
              ? "No obituaries match your filters"
              : "No obituaries yet — create your first notice"}
          </p>
        </motion.div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto shadow-xl",
              theme === "dark" ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200",
            )}
          >
            <motion.div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {selectedObituary ? "Edit Obituary" : "New Obituary"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500",
                )}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </motion.div>

            <div className="space-y-4">
              <div>
                <label className={labelClass(theme)} htmlFor="obit-deceased-name">
                  Deceased full name
                </label>
                <input
                  id="obit-deceased-name"
                  type="text"
                  value={formData.deceasedName}
                  onChange={(e) => updateField("deceasedName", e.target.value)}
                  placeholder="e.g. Margaret Johnson"
                  className={inputClass(theme)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div>
                  <label className={labelClass(theme)} htmlFor="obit-dob">
                    Date of birth
                  </label>
                  <input
                    id="obit-dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className={inputClass(theme)}
                  />
                </motion.div>
                <motion.div>
                  <label className={labelClass(theme)} htmlFor="obit-dod">
                    Date of death
                  </label>
                  <input
                    id="obit-dod"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => updateField("dateOfDeath", e.target.value)}
                    className={inputClass(theme)}
                  />
                </motion.div>
              </div>

              <motion.div>
                <label className={labelClass(theme)} htmlFor="obit-author">
                  Author / family contact
                </label>
                <input
                  id="obit-author"
                  type="text"
                  value={formData.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="e.g. Emily Johnson"
                  className={inputClass(theme)}
                />
              </motion.div>

              <div>
                <label className={labelClass(theme)} htmlFor="obit-title">
                  Message title
                </label>
                <input
                  id="obit-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. In Loving Memory, Forever in Our Hearts"
                  className={inputClass(theme)}
                />
                <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                  This title is shown to users above the memorial message.
                </p>
              </div>

              <motion.div>
                <label className={labelClass(theme)} htmlFor="obit-message">
                  Message for the deceased
                </label>
                <textarea
                  id="obit-message"
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Write a personal message to honor their life..."
                  rows={6}
                  className={cn(inputClass(theme), "resize-y min-h-[140px]")}
                />
                <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                  {formData.message.length} characters — displayed to users under the title
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass(theme)} htmlFor="obit-status">
                    Status
                  </label>
                  <select
                    id="obit-status"
                    value={formData.status}
                    onChange={(e) => updateField("status", e.target.value as Obituary["status"])}
                    className={inputClass(theme)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {formData.status === "published" && (
                  <div>
                    <label className={labelClass(theme)} htmlFor="obit-published">
                      Published date
                    </label>
                    <input
                      id="obit-published"
                      type="date"
                      value={formData.publishedAt || new Date().toISOString().split("T")[0]}
                      onChange={(e) => updateField("publishedAt", e.target.value)}
                      className={inputClass(theme)}
                    />
                  </div>
                )}
              </div>

              <label
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                  theme === "dark" ? "border-slate-600 bg-slate-700/30" : "border-gray-200 bg-gray-50",
                )}
              >
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                  Feature this obituary on the memorial feed
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              {selectedObituary && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedObituary.id)}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={closeModal}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                  theme === "dark"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {selectedObituary ? "Save changes" : "Create obituary"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
