"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { Plus, Edit2, Trash2, Eye, Copy, Download, Upload, Search, Grid, List, Check, X } from "lucide-react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface CascadeTemplate {
  id: string
  name: string
  description: string
  category: "memorial" | "timeline" | "gallery" | "story" | "custom"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: "card" | "timeline" | "masonry" | "grid"
  isActive: boolean
  downloads: number
  rating: number
  createdDate: string
  customizable: boolean
}

const mockTemplates: CascadeTemplate[] = [
  {
    id: "t1",
    name: "Classic Memorial",
    description: "Elegant and timeless design for memorial cascades",
    category: "memorial",
    colors: {
      primary: "#1f2937",
      secondary: "#9ca3af",
      accent: "#10b981",
      background: "#f9fafb",
    },
    fonts: {
      heading: "Georgia",
      body: "Inter",
    },
    layout: "card",
    isActive: true,
    downloads: 2345,
    rating: 4.8,
    createdDate: "2026-01-15",
    customizable: true,
  },
  {
    id: "t2",
    name: "Timeline Flow",
    description: "Beautiful timeline layout for chronological stories",
    category: "timeline",
    colors: {
      primary: "#3b82f6",
      secondary: "#dbeafe",
      accent: "#1e40af",
      background: "#eff6ff",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Open Sans",
    },
    layout: "timeline",
    isActive: true,
    downloads: 1876,
    rating: 4.6,
    createdDate: "2026-02-20",
    customizable: true,
  },
  {
    id: "t3",
    name: "Gallery Showcase",
    description: "Image-focused masonry layout for photo memories",
    category: "gallery",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ede9fe",
      accent: "#7c3aed",
      background: "#faf5ff",
    },
    fonts: {
      heading: "Montserrat",
      body: "Lato",
    },
    layout: "masonry",
    isActive: true,
    downloads: 1543,
    rating: 4.7,
    createdDate: "2026-03-10",
    customizable: true,
  },
  {
    id: "t4",
    name: "Story Book",
    description: "Narrative-focused layout for detailed storytelling",
    category: "story",
    colors: {
      primary: "#dc2626",
      secondary: "#fee2e2",
      accent: "#991b1b",
      background: "#fef2f2",
    },
    fonts: {
      heading: "Merriweather",
      body: "Crimson Text",
    },
    layout: "card",
    isActive: false,
    downloads: 987,
    rating: 4.5,
    createdDate: "2026-03-25",
    customizable: true,
  },
  {
    id: "t5",
    name: "Minimalist Light",
    description: "Clean and modern design for understated elegance",
    category: "custom",
    colors: {
      primary: "#ffffff",
      secondary: "#f3f4f6",
      accent: "#000000",
      background: "#fafafa",
    },
    fonts: {
      heading: "Helvetica Neue",
      body: "Arial",
    },
    layout: "grid",
    isActive: true,
    downloads: 1234,
    rating: 4.9,
    createdDate: "2026-04-01",
    customizable: true,
  },
]

export default function CascadeDesignPage() {
  const { theme } = useTheme()
  const [templates, setTemplates] = useState<CascadeTemplate[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | CascadeTemplate["category"]>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTemplate, setSelectedTemplate] = useState<CascadeTemplate | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const toggleActive = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)))
    toast.success("Template status updated!")
  }

  const duplicateTemplate = (template: CascadeTemplate) => {
    const newTemplate: CascadeTemplate = {
      ...template,
      id: `t${Date.now()}`,
      name: `${template.name} (Copy)`,
    }
    setTemplates([...templates, newTemplate])
    toast.success("Template duplicated!")
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    toast.success("Template deleted!")
  }

  const stats = [
    { label: "Total Templates", value: templates.length, color: "from-blue-500 to-blue-600" },
    { label: "Active", value: templates.filter((t) => t.isActive).length, color: "from-green-500 to-green-600" },
    { label: "Categories", value: new Set(templates.map((t) => t.category)).size, color: "from-purple-500 to-purple-600" },
    { label: "Total Downloads", value: templates.reduce((sum, t) => sum + t.downloads, 0), color: "from-yellow-500 to-yellow-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Cascade Design & Customization</h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Manage themes, templates, and design customization options</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus size={20} />
          New Template
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-4 rounded-lg border space-y-4", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", theme === "dark" ? "text-slate-400" : "text-gray-400")} size={18} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
                theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
              )}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "memorial", "timeline", "gallery", "story", "custom"] as const).map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", categoryFilter === cat ? "bg-green-500 text-white" : theme === "dark" ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300")}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border rounded-lg p-1" style={{ borderColor: theme === "dark" ? "#475569" : "#e5e7eb" }}>
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded transition-colors", viewMode === "grid" ? "bg-green-500 text-white" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded transition-colors", viewMode === "list" ? "bg-green-500 text-white" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}>
              <List size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Templates Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => (
            <motion.div key={template.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className={cn("rounded-lg border overflow-hidden transition-all hover:shadow-lg", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
              {/* Template Preview */}
              <div className="h-40 relative overflow-hidden bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/50 text-sm font-medium">[{template.layout.toUpperCase().replace("CARD", "CARD")}]</span>
                </div>
                {template.isActive && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Check size={12} />
                    Active
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className={cn("font-semibold mb-1", theme === "dark" ? "text-white" : "text-gray-900")}>{template.name}</h3>
                  <p className={cn("text-xs line-clamp-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{template.description}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-2 border-t border-b" style={{ borderColor: theme === "dark" ? "#334155" : "#e5e7eb" }}>
                  <div className="text-center">
                    <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Downloads</p>
                    <p className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{template.downloads.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Rating</p>
                    <p className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{template.rating.toFixed(1)} ⭐</p>
                  </div>
                </div>

                {/* Colors Preview */}
                <div className="flex gap-1">
                  {Object.values(template.colors).map((color, i) => (
                    <div key={i} className="flex-1 h-6 rounded border" style={{ backgroundColor: color, borderColor: "rgba(0,0,0,0.1)" }} title={color} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template)
                      setShowDetailModal(true)
                    }}
                    className={cn("flex-1 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1", theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700")}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template)}
                    className={cn("p-2 rounded transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700")}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Active Toggle */}
                <button
                  onClick={() => toggleActive(template.id)}
                  className={cn(
                    "w-full px-3 py-2 rounded text-sm font-medium transition-colors",
                    template.isActive ? "bg-green-500 hover:bg-green-600 text-white" : theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700",
                  )}
                >
                  {template.isActive ? "✓ Active" : "Inactive"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredTemplates.map((template, idx) => (
            <motion.div key={template.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={cn("p-4 rounded-lg border flex items-center justify-between", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)` }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{template.name}</h3>
                    {template.isActive && <span className="text-xs px-2 py-1 bg-green-500 text-white rounded">Active</span>}
                  </div>
                  <p className={cn("text-sm mb-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{template.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span>{template.downloads.toLocaleString()} downloads</span>
                    <span>{template.rating.toFixed(1)} ⭐</span>
                    <span className="capitalize">{template.layout} layout</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { setSelectedTemplate(template); setShowDetailModal(true); }} className={cn("p-2 rounded transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-100 hover:bg-gray-200")}>
                  <Eye size={16} />
                </button>
                <button onClick={() => duplicateTemplate(template)} className={cn("p-2 rounded transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-100 hover:bg-gray-200")}>
                  <Copy size={16} />
                </button>
                <button onClick={() => deleteTemplate(template.id)} className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 rounded-lg border text-center", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          <p className={cn("text-lg font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>No templates found</p>
          <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-500")}>Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Template Detail Modal */}
      {showDetailModal && selectedTemplate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowDetailModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className={cn("max-w-3xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto", theme === "dark" ? "bg-slate-800" : "bg-white")}>
            <h2 className={cn("text-2xl font-bold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedTemplate.name}</h2>

            {/* Template Preview */}
            <div
              className="w-full h-64 rounded-lg bg-gradient-to-br mb-6"
              style={{
                backgroundImage: `linear-gradient(135deg, ${selectedTemplate.colors.primary} 0%, ${selectedTemplate.colors.secondary} 100%)`,
              }}
            />

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className={cn("text-sm font-semibold mb-3", theme === "dark" ? "text-white" : "text-gray-900")}>Colors</h3>
                <div className="space-y-2">
                  {Object.entries(selectedTemplate.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: value }} />
                      <div className="flex-1">
                        <p className={cn("text-xs font-medium capitalize", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{key}</p>
                        <p className={cn("text-sm", theme === "dark" ? "text-white" : "text-gray-900")}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={cn("text-sm font-semibold mb-3", theme === "dark" ? "text-white" : "text-gray-900")}>Fonts</h3>
                <div className="space-y-2">
                  {Object.entries(selectedTemplate.fonts).map(([key, value]) => (
                    <div key={key}>
                      <p className={cn("text-xs font-medium capitalize", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{key}</p>
                      <p className={cn("text-sm", theme === "dark" ? "text-white" : "text-gray-900")} style={{ fontFamily: value }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Layout</p>
                <p className={cn("capitalize", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedTemplate.layout}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Category</p>
                <p className={cn("capitalize", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedTemplate.category}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Downloads</p>
                <p className={cn("", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedTemplate.downloads.toLocaleString()}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Rating</p>
                <p className={cn("", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedTemplate.rating.toFixed(1)} ⭐</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Export
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className={cn("max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto", theme === "dark" ? "bg-slate-800" : "bg-white")}>
            <h2 className={cn("text-2xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Create New Template</h2>

            <div className="space-y-4">
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Template Name</label>
                <input
                  type="text"
                  placeholder="Enter template name..."
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border transition-colors",
                    theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Description</label>
                <textarea
                  placeholder="Enter template description..."
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border transition-colors",
                    theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Category</label>
                <select
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border transition-colors",
                    theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                >
                  <option>memorial</option>
                  <option>timeline</option>
                  <option>gallery</option>
                  <option>story</option>
                  <option>custom</option>
                </select>
              </div>

              <button onClick={() => { setShowCreateModal(false); toast.success("Template created!"); }} className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                Create Template
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
