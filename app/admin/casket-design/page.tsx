"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, CheckCircle, Clock, AlertCircle, Download, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

// Types
interface CasketTemplate {
  id: string
  name: string
  description: string
  material: string
  price: number
  image?: string
  status: "active" | "inactive"
  createdAt: string
  customizableAreas: ("front" | "sides" | "back" | "head")[]
}

interface CasketColor {
  id: string
  name: string
  hexCode: string
  category: "standard" | "premium" | "custom"
  finish: "matte" | "glossy" | "metallic" | "pearl"
  isActive: boolean
  usageCount: number
}

type CustomizableArea = CasketTemplate["customizableAreas"][number]

type TemplateFormData = {
  name: string
  description: string
  material: string
  price: string
  status: CasketTemplate["status"]
  imageUrl: string
  customizableAreas: CustomizableArea[]
}

const CUSTOMIZABLE_AREAS: { id: CustomizableArea; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "sides", label: "Sides" },
  { id: "back", label: "Back" },
  { id: "head", label: "Head" },
]

const emptyTemplateForm: TemplateFormData = {
  name: "",
  description: "",
  material: "",
  price: "",
  status: "active",
  imageUrl: "",
  customizableAreas: ["front", "sides"],
}

type ColorFormData = {
  name: string
  hexCode: string
  category: CasketColor["category"]
  finish: CasketColor["finish"]
  isActive: boolean
}

const COLOR_CATEGORIES: CasketColor["category"][] = ["standard", "premium", "custom"]
const COLOR_FINISHES: CasketColor["finish"][] = ["matte", "glossy", "metallic", "pearl"]

const emptyColorForm: ColorFormData = {
  name: "",
  hexCode: "#1a1a1a",
  category: "standard",
  finish: "glossy",
  isActive: true,
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

function normalizeHex(value: string): string {
  let hex = value.trim()
  if (!hex.startsWith("#")) hex = `#${hex}`
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = hex[1]
    const g = hex[2]
    const b = hex[3]
    hex = `#${r}${r}${g}${g}${b}${b}`
  }
  return hex.toLowerCase()
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(hex)
}

interface UserDesignSubmission {
  id: string
  userId: string
  userName: string
  templateId: string
  customizations: {
    front?: { type: string; content: string }
    sides?: { type: string; content: string }
    back?: { type: string; content: string }
    head?: { type: string; content: string }
  }
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  notes?: string
}

interface ManufacturingOrder {
  id: string
  designId: string
  userId: string
  templateId: string
  status: "pending" | "in_production" | "ready" | "shipped" | "completed"
  orderDate: string
  estimatedCompletion?: string
  manufacturingPartner: string
  quantity: number
  notes?: string
}

// Mock Data
const mockTemplates: CasketTemplate[] = [
  {
    id: "t1",
    name: "Classic Wood",
    description: "Traditional wooden casket with elegant design",
    material: "Solid Wood",
    price: 1499,
    status: "active",
    createdAt: "2024-01-15",
    customizableAreas: ["front", "sides", "back", "head"],
  },
  {
    id: "t2",
    name: "Modern Metal",
    description: "Contemporary metal casket with sleek finish",
    material: "Brushed Steel",
    price: 1999,
    status: "active",
    createdAt: "2024-02-20",
    customizableAreas: ["front", "sides", "back"],
  },
  {
    id: "t3",
    name: "Premium Heritage",
    description: "Luxury casket with hand-crafted details",
    material: "Mahogany",
    price: 2999,
    status: "active",
    createdAt: "2024-03-10",
    customizableAreas: ["front", "sides", "back", "head"],
  },
]

const mockColors: CasketColor[] = [
  {
    id: "c1",
    name: "Midnight Black",
    hexCode: "#1a1a1a",
    category: "standard",
    finish: "glossy",
    isActive: true,
    usageCount: 234,
  },
  {
    id: "c2",
    name: "Pearl White",
    hexCode: "#f5f5f5",
    category: "standard",
    finish: "glossy",
    isActive: true,
    usageCount: 189,
  },
  {
    id: "c3",
    name: "Rose Gold",
    hexCode: "#b76e79",
    category: "premium",
    finish: "metallic",
    isActive: true,
    usageCount: 97,
  },
  {
    id: "c4",
    name: "Ocean Blue",
    hexCode: "#0ea5e9",
    category: "standard",
    finish: "matte",
    isActive: true,
    usageCount: 156,
  },
  {
    id: "c5",
    name: "Emerald Green",
    hexCode: "#10b981",
    category: "premium",
    finish: "glossy",
    isActive: true,
    usageCount: 82,
  },
]

const mockSubmissions: UserDesignSubmission[] = [
  {
    id: "s1",
    userId: "user-123",
    userName: "John Smith",
    templateId: "t1",
    customizations: {
      front: { type: "image", content: "memorial-photo.jpg" },
      sides: { type: "text", content: "In Loving Memory" },
      back: { type: "team_logo", content: "patriots-logo.jpg" },
    },
    status: "pending",
    submittedAt: "2024-04-10",
  },
  {
    id: "s2",
    userId: "user-456",
    userName: "Mary Johnson",
    templateId: "t2",
    customizations: {
      front: { type: "image", content: "family-portrait.jpg" },
      sides: { type: "text", content: "1950 - 2026" },
    },
    status: "approved",
    submittedAt: "2024-04-08",
  },
]

const mockOrders: ManufacturingOrder[] = [
  {
    id: "o1",
    designId: "s2",
    userId: "user-456",
    templateId: "t1",
    status: "in_production",
    orderDate: "2024-04-08",
    estimatedCompletion: "2024-04-22",
    manufacturingPartner: "Sky Caskets Inc.",
    quantity: 1,
  },
]

export default function CasketDesignPage() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<"templates" | "colors" | "submissions" | "orders">("templates")
  const [templates, setTemplates] = useState<CasketTemplate[]>(mockTemplates)
  const [colors, setColors] = useState<CasketColor[]>(mockColors)
  const [submissions, setSubmissions] = useState<UserDesignSubmission[]>(mockSubmissions)
  const [orders, setOrders] = useState<ManufacturingOrder[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<CasketTemplate | null>(null)
  const [selectedColor, setSelectedColor] = useState<CasketColor | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false)
  const [templateForm, setTemplateForm] = useState<TemplateFormData>(emptyTemplateForm)
  const [colorForm, setColorForm] = useState<ColorFormData>(emptyColorForm)
  const [templateSearch, setTemplateSearch] = useState("")
  const [colorSearch, setColorSearch] = useState("")

  const filteredTemplates = useMemo(() => {
    const q = templateSearch.trim().toLowerCase()
    if (!q) return templates
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.material.toLowerCase().includes(q) ||
        t.status.includes(q),
    )
  }, [templates, templateSearch])

  useEffect(() => {
    if (!showTemplateModal) return
    if (selectedTemplate) {
      setTemplateForm({
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        material: selectedTemplate.material,
        price: String(selectedTemplate.price),
        status: selectedTemplate.status,
        imageUrl: selectedTemplate.image ?? "",
        customizableAreas: [...selectedTemplate.customizableAreas],
      })
    } else {
      setTemplateForm({ ...emptyTemplateForm })
    }
  }, [showTemplateModal, selectedTemplate])

  const openAddTemplateModal = () => {
    setSelectedTemplate(null)
    setShowTemplateModal(true)
  }

  const openEditTemplateModal = (template: CasketTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateModal(true)
  }

  const closeTemplateModal = () => {
    setShowTemplateModal(false)
    setSelectedTemplate(null)
    setTemplateForm({ ...emptyTemplateForm })
  }

  const updateTemplateField = <K extends keyof TemplateFormData>(
    key: K,
    value: TemplateFormData[K],
  ) => {
    setTemplateForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTemplateArea = (area: CustomizableArea) => {
    setTemplateForm((prev) => {
      const has = prev.customizableAreas.includes(area)
      const next = has
        ? prev.customizableAreas.filter((a) => a !== area)
        : [...prev.customizableAreas, area]
      return { ...prev, customizableAreas: next }
    })
  }

  const handleSaveTemplate = () => {
    const name = templateForm.name.trim()
    const description = templateForm.description.trim()
    const material = templateForm.material.trim()
    const priceNum = Number.parseFloat(templateForm.price)

    if (!name) {
      toast.error("Template name is required")
      return
    }
    if (!description) {
      toast.error("Description is required")
      return
    }
    if (!material) {
      toast.error("Material is required")
      return
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Enter a valid price greater than 0")
      return
    }
    if (templateForm.customizableAreas.length === 0) {
      toast.error("Select at least one customizable area")
      return
    }

    const duplicateName = templates.some(
      (t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== selectedTemplate?.id,
    )
    if (duplicateName) {
      toast.error("A template with this name already exists")
      return
    }

    const payload: Omit<CasketTemplate, "id" | "createdAt"> & { createdAt?: string } = {
      name,
      description,
      material,
      price: Math.round(priceNum * 100) / 100,
      status: templateForm.status,
      image: templateForm.imageUrl.trim() || undefined,
      customizableAreas: templateForm.customizableAreas,
    }

    if (selectedTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplate.id
            ? { ...t, ...payload }
            : t,
        ),
      )
      toast.success("Template updated successfully")
    } else {
      const newTemplate: CasketTemplate = {
        id: `t-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        ...payload,
      }
      setTemplates((prev) => [newTemplate, ...prev])
      toast.success("Template added successfully")
    }

    closeTemplateModal()
  }

  const handleToggleTemplateStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "inactive" : "active" }
          : t,
      ),
    )
    toast.success("Template status updated")
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    toast.success("Template deleted successfully")
    if (selectedTemplate?.id === id) closeTemplateModal()
  }

  const filteredColors = useMemo(() => {
    const q = colorSearch.trim().toLowerCase()
    if (!q) return colors
    return colors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hexCode.toLowerCase().includes(q) ||
        c.category.includes(q) ||
        c.finish.includes(q),
    )
  }, [colors, colorSearch])

  useEffect(() => {
    if (!showColorModal) return
    if (selectedColor) {
      setColorForm({
        name: selectedColor.name,
        hexCode: selectedColor.hexCode,
        category: selectedColor.category,
        finish: selectedColor.finish,
        isActive: selectedColor.isActive,
      })
    } else {
      setColorForm({ ...emptyColorForm })
    }
  }, [showColorModal, selectedColor])

  const openAddColorModal = () => {
    setSelectedColor(null)
    setShowColorModal(true)
  }

  const openEditColorModal = (color: CasketColor) => {
    setSelectedColor(color)
    setShowColorModal(true)
  }

  const closeColorModal = () => {
    setShowColorModal(false)
    setSelectedColor(null)
    setColorForm({ ...emptyColorForm })
  }

  const updateColorField = <K extends keyof ColorFormData>(key: K, value: ColorFormData[K]) => {
    setColorForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveColor = () => {
    const name = colorForm.name.trim()
    if (!name) {
      toast.error("Color name is required")
      return
    }

    const hexCode = normalizeHex(colorForm.hexCode)
    if (!isValidHex(hexCode)) {
      toast.error("Enter a valid hex color (e.g. #1a1a1a)")
      return
    }

    const duplicateHex = colors.some(
      (c) => c.hexCode.toLowerCase() === hexCode && c.id !== selectedColor?.id,
    )
    if (duplicateHex) {
      toast.error("This hex color already exists in the library")
      return
    }

    const duplicateName = colors.some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== selectedColor?.id,
    )
    if (duplicateName) {
      toast.error("A color with this name already exists")
      return
    }

    if (selectedColor) {
      setColors((prev) =>
        prev.map((c) =>
          c.id === selectedColor.id
            ? {
                ...c,
                name,
                hexCode,
                category: colorForm.category,
                finish: colorForm.finish,
                isActive: colorForm.isActive,
              }
            : c,
        ),
      )
      toast.success("Color updated successfully")
    } else {
      const newColor: CasketColor = {
        id: `c-${Date.now()}`,
        name,
        hexCode,
        category: colorForm.category,
        finish: colorForm.finish,
        isActive: colorForm.isActive,
        usageCount: 0,
      }
      setColors((prev) => [newColor, ...prev])
      toast.success("Color added to library")
    }

    closeColorModal()
  }

  const handleToggleColorActive = (id: string) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    )
    toast.success("Color status updated")
  }

  const handleDeleteColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id))
    toast.success("Color deleted successfully")
    if (selectedColor?.id === id) closeColorModal()
  }

  // Submission handlers
  const handleApproveSubmission = (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: "approved" as const } : s)),
    )
    toast.success("Design approved and queued for manufacturing")
  }

  const handleRejectSubmission = (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: "rejected" as const } : s)),
    )
    toast.error("Design rejected")
  }

  // Order status helpers
  const getOrderStatusColor = (status: ManufacturingOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_production":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
    }
  }

  const getSubmissionStatusIcon = (status: UserDesignSubmission["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-yellow-600" />
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />
      case "rejected":
        return <AlertCircle size={16} className="text-red-600" />
    }
  }

  // Stats
  const stats = [
    { label: "Total Templates", value: templates.length, icon: "🎨", color: "from-blue-500 to-blue-600" },
    { label: "Color Finishes", value: colors.length, icon: "🎭", color: "from-purple-500 to-purple-600" },
    { label: "Pending Reviews", value: submissions.filter((s) => s.status === "pending").length, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
    { label: "In Production", value: orders.filter((o) => o.status === "in_production").length, icon: "⚙️", color: "from-green-500 to-green-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Casket Design Management</h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage templates, colors, user designs, and manufacturing orders
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-lg border transition-all cursor-pointer bg-linear-to-br",
              theme === "dark"
                ? "border-slate-700 hover:border-slate-600 from-slate-800 to-slate-900"
                : "border-gray-200 hover:border-gray-300 from-white to-gray-50",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm font-medium opacity-90", theme === "dark" ? "text-white" : "text-white")}>
                  {stat.label}
                </p>
                <p className={cn("text-3xl font-bold mt-2", theme === "dark" ? "text-white" : "text-white")}>{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700">
        {[
          { id: "templates", label: "Templates", icon: "🎨" },
          { id: "colors", label: "Color Library", icon: "🎭" },
          { id: "submissions", label: "User Submissions", icon: "📋" },
          { id: "orders", label: "Manufacturing Orders", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-all",
              activeTab === tab.id
                ? "border-green-500 text-green-600 dark:text-green-400"
                : `border-transparent ${theme === "dark" ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`,
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <motion.div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={openAddTemplateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Add New Template
              </motion.button>
              <motion.div className="relative w-full sm:max-w-xs">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2",
                    theme === "dark" ? "text-slate-500" : "text-gray-400",
                  )}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg border text-sm",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500",
                  )}
                />
              </motion.div>
            </motion.div>

            {filteredTemplates.length === 0 ? (
              <motion.div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>
                  {templateSearch
                    ? "No templates match your search"
                    : "No templates yet — add your first casket design"}
                </p>
              </motion.div>
            ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "p-6 rounded-lg border transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                        {template.name}
                      </h3>
                      <p className={cn("text-sm mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                        {template.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Material
                        </p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{template.material}</p>
                      </div>
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Price
                        </p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>${template.price}</p>
                      </div>
                    </div>

                    <div>
                      <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                        Customizable Areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.customizableAreas.map((area) => (
                          <span
                            key={area}
                            className="px-2 py-1 text-xs bg-green-500/20 text-green-700 dark:text-green-400 rounded"
                          >
                            {area.charAt(0).toUpperCase() + area.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          template.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400",
                        )}
                      >
                        {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => openEditTemplateModal(template)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          <Edit2 size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-600"} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            )}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            {/* Add Color Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={openAddColorModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Add New Color
              </motion.button>
              <motion.div className="relative w-full sm:max-w-xs">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2",
                    theme === "dark" ? "text-slate-500" : "text-gray-400",
                  )}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search colors..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-lg border text-sm",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500",
                  )}
                />
              </motion.div>
            </div>

            {filteredColors.length === 0 ? (
              <div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>
                  {colorSearch ? "No colors match your search" : "No colors yet — add your first finish"}
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "p-6 rounded-lg border transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-slate-600 shadow-md"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <div className="flex-1">
                        <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {color.name}
                        </h3>
                        <p className={cn("text-sm font-mono", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                          {color.hexCode}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Category
                        </p>
                        <p className={cn("capitalize", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {color.category}
                        </p>
                      </div>
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Finish
                        </p>
                        <p className={cn("capitalize", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {color.finish}
                        </p>
                      </div>
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Usage
                        </p>
                        <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{color.usageCount}</p>
                      </div>
                      <div>
                        <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                          Status
                        </p>
                        <p
                          className={color.isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}
                        >
                          {color.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleToggleColorActive(color.id)}
                        className={cn(
                          "px-3 py-2 rounded text-xs font-medium transition-colors",
                          color.isActive
                            ? "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300"
                            : "bg-green-500/20 text-green-700 dark:text-green-400",
                        )}
                      >
                        {color.isActive ? "Deactivate" : "Activate"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openEditColorModal(color)}
                        className="flex-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteColor(color.id)}
                        className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        )}



        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>No design submissions yet</p>
              </div>
            ) : (
              submissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-6 rounded-lg border transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {submission.userName}
                        </h3>
                        <div className="flex items-center gap-1">
                          {getSubmissionStatusIcon(submission.status)}
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded",
                              submission.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : submission.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400",
                            )}
                          >
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3 space-y-1">
                        {Object.entries(submission.customizations).map(([area, content]) => (
                          <p key={area} className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                            <span className="font-medium capitalize">{area}:</span> {content.type} - {content.content}
                          </p>
                        ))}
                      </div>
                    </div>

                    {submission.status === "pending" && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleApproveSubmission(submission.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          <CheckCircle size={16} className="inline mr-2" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleRejectSubmission(submission.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          <AlertCircle size={16} className="inline mr-2" />
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>No manufacturing orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-6 rounded-lg border transition-all",
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                          Order {order.id.substring(0, 8)}
                        </h3>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getOrderStatusColor(order.status))}>
                          {order.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Partner
                          </p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{order.manufacturingPartner}</p>
                        </div>
                        <div>
                          <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Ordered
                          </p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Est. Completion
                          </p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {order.estimatedCompletion ? new Date(order.estimatedCompletion).toLocaleDateString() : "TBD"}
                          </p>
                        </div>
                        <div>
                          <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Quantity
                          </p>
                          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{order.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Details
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Add / Edit Template Modal */}
      {showTemplateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeTemplateModal}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
                {selectedTemplate ? "Edit Template" : "Add New Template"}
              </h2>
              <motion.button
                type="button"
                onClick={closeTemplateModal}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500",
                )}
                aria-label="Close"
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            <motion.div className="space-y-4">
              <motion.div>
                <label className={labelClass(theme)} htmlFor="template-name">
                  Template name
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => updateTemplateField("name", e.target.value)}
                  placeholder="e.g. Classic Wood"
                  className={inputClass(theme)}
                />
              </motion.div>

              <motion.div>
                <label className={labelClass(theme)} htmlFor="template-description">
                  Description
                </label>
                <textarea
                  id="template-description"
                  value={templateForm.description}
                  onChange={(e) => updateTemplateField("description", e.target.value)}
                  placeholder="Brief description for users and admins"
                  rows={3}
                  className={cn(inputClass(theme), "resize-y min-h-[80px]")}
                />
              </motion.div>

              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div>
                  <label className={labelClass(theme)} htmlFor="template-material">
                    Material
                  </label>
                  <input
                    id="template-material"
                    type="text"
                    value={templateForm.material}
                    onChange={(e) => updateTemplateField("material", e.target.value)}
                    placeholder="e.g. Solid Wood, Mahogany"
                    className={inputClass(theme)}
                  />
                </motion.div>
                <motion.div>
                  <label className={labelClass(theme)} htmlFor="template-price">
                    Price (USD)
                  </label>
                  <input
                    id="template-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={templateForm.price}
                    onChange={(e) => updateTemplateField("price", e.target.value)}
                    placeholder="1499"
                    className={inputClass(theme)}
                  />
                </motion.div>
              </motion.div>

              <motion.div>
                <label className={labelClass(theme)} htmlFor="template-image">
                  Image URL (optional)
                </label>
                <input
                  id="template-image"
                  type="url"
                  value={templateForm.imageUrl}
                  onChange={(e) => updateTemplateField("imageUrl", e.target.value)}
                  placeholder="https://..."
                  className={inputClass(theme)}
                />
              </motion.div>

              <motion.div>
                <label className={labelClass(theme)} htmlFor="template-status">
                  Status
                </label>
                <select
                  id="template-status"
                  value={templateForm.status}
                  onChange={(e) =>
                    updateTemplateField("status", e.target.value as CasketTemplate["status"])
                  }
                  className={inputClass(theme)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </motion.div>

              <motion.div>
                <p className={labelClass(theme)}>Customizable areas</p>
                <p className={cn("text-xs mb-3", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                  Select surfaces users can personalize in the mobile app
                </p>
                <motion.div className="flex flex-wrap gap-2">
                  {CUSTOMIZABLE_AREAS.map((area) => {
                    const selected = templateForm.customizableAreas.includes(area.id)
                    return (
                      <motion.button
                        key={area.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleTemplateArea(area.id)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                          selected
                            ? "bg-green-500 border-green-500 text-white"
                            : theme === "dark"
                              ? "border-slate-600 text-slate-300 hover:border-slate-500"
                              : "border-gray-300 text-gray-700 hover:border-gray-400",
                        )}
                      >
                        {area.label}
                      </motion.button>
                    )
                  })}
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              {selectedTemplate && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium text-sm transition-colors"
                >
                  Delete
                </motion.button>
              )}
              <motion.div className="flex-1" />
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={closeTemplateModal}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                  theme === "dark"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {selectedTemplate ? "Save changes" : "Add template"}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Add / Edit Color Modal */}
      {showColorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeColorModal}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-w-lg w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto shadow-xl",
              theme === "dark" ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {selectedColor ? "Edit Color" : "Add New Color"}
              </h2>
              <button
                type="button"
                onClick={closeColorModal}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500",
                )}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Live preview */}
            <motion.div
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg mb-6 border",
                theme === "dark" ? "border-slate-600 bg-slate-700/50" : "border-gray-200 bg-gray-50",
              )}
            >
              <div
                className="w-20 h-20 rounded-lg border-2 border-gray-300 dark:border-slate-500 shadow-inner shrink-0"
                style={{
                  backgroundColor: isValidHex(normalizeHex(colorForm.hexCode))
                    ? normalizeHex(colorForm.hexCode)
                    : "#cccccc",
                }}
              />
              <div>
                <p className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {colorForm.name.trim() || "Preview"}
                </p>
                <p className={cn("text-sm font-mono", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  {normalizeHex(colorForm.hexCode)}
                </p>
                <p className={cn("text-xs mt-1 capitalize", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                  {colorForm.category} · {colorForm.finish}
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div>
                <label className={labelClass(theme)} htmlFor="color-name">
                  Color name
                </label>
                <input
                  id="color-name"
                  type="text"
                  value={colorForm.name}
                  onChange={(e) => updateColorField("name", e.target.value)}
                  placeholder="e.g. Midnight Black"
                  className={inputClass(theme)}
                />
              </div>

              <div>
                <label className={labelClass(theme)} htmlFor="color-hex">
                  Hex code
                </label>
                <div className="flex gap-3">
                  <input
                    id="color-hex"
                    type="text"
                    value={colorForm.hexCode}
                    onChange={(e) => updateColorField("hexCode", e.target.value)}
                    placeholder="#1a1a1a"
                    className={cn(inputClass(theme), "flex-1 font-mono")}
                  />
                  <input
                    type="color"
                    value={
                      isValidHex(normalizeHex(colorForm.hexCode))
                        ? normalizeHex(colorForm.hexCode)
                        : "#1a1a1a"
                    }
                    onChange={(e) => updateColorField("hexCode", e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-slate-600 cursor-pointer shrink-0"
                    aria-label="Pick color"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass(theme)} htmlFor="color-category">
                    Category
                  </label>
                  <select
                    id="color-category"
                    value={colorForm.category}
                    onChange={(e) =>
                      updateColorField("category", e.target.value as CasketColor["category"])
                    }
                    className={inputClass(theme)}
                  >
                    {COLOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <motion.div>
                  <label className={labelClass(theme)} htmlFor="color-finish">
                    Finish
                  </label>
                  <select
                    id="color-finish"
                    value={colorForm.finish}
                    onChange={(e) => updateColorField("finish", e.target.value as CasketColor["finish"])}
                    className={inputClass(theme)}
                  >
                    {COLOR_FINISHES.map((finish) => (
                      <option key={finish} value={finish}>
                        {finish.charAt(0).toUpperCase() + finish.slice(1)}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>

              <label
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                  theme === "dark" ? "border-slate-600 bg-slate-700/30" : "border-gray-200 bg-gray-50",
                )}
              >
                <input
                  type="checkbox"
                  checked={colorForm.isActive}
                  onChange={(e) => updateColorField("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                  Active — visible to users in the mobile app
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              {selectedColor && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  type="button"
                  onClick={() => handleDeleteColor(selectedColor.id)}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium text-sm transition-colors"
                >
                  Delete
                </motion.button>
              )}
              <div className="flex-1" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={closeColorModal}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                  theme === "dark"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={handleSaveColor}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {selectedColor ? "Save changes" : "Add color"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
   )
}
