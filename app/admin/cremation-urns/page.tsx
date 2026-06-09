"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, Image, DollarSign, Package, Eye, Zap } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface Urn {
  id: string
  name: string
  material: string
  style: "classic" | "modern" | "personalized" | "biodegradable"
  price: number
  capacity: string
  color: string
  imageUrl?: string
  views: number
  inStock: boolean
  featured: boolean
  description: string
}

// Mock Data
const mockUrns: Urn[] = [
  {
    id: "urn1",
    name: "Heritage Classic Urn",
    material: "Bronze",
    style: "classic",
    price: 450,
    capacity: "200 cu in",
    color: "Antique Bronze",
    imageUrl: "🏺",
    views: 234,
    inStock: true,
    featured: true,
    description: "Traditional bronze urn with elegant engravings",
  },
  {
    id: "urn2",
    name: "Modern Minimalist",
    material: "Ceramic",
    style: "modern",
    price: 280,
    capacity: "200 cu in",
    color: "Pure White",
    imageUrl: "⚪",
    views: 187,
    inStock: true,
    featured: true,
    description: "Sleek contemporary design in premium ceramic",
  },
  {
    id: "urn3",
    name: "Personalized Photo Urn",
    material: "Stainless Steel",
    style: "personalized",
    price: 550,
    capacity: "200 cu in",
    color: "Silver",
    imageUrl: "🖼️",
    views: 156,
    inStock: true,
    featured: false,
    description: "Custom engraved with photo and text",
  },
  {
    id: "urn4",
    name: "Eco-Friendly Biodegradable",
    material: "Plant-based Materials",
    style: "biodegradable",
    price: 220,
    capacity: "200 cu in",
    color: "Natural Beige",
    imageUrl: "🌱",
    views: 142,
    inStock: true,
    featured: false,
    description: "100% biodegradable and environmentally conscious",
  },
  {
    id: "urn5",
    name: "Marble Tribute",
    material: "Marble",
    style: "classic",
    price: 680,
    capacity: "200 cu in",
    color: "Italian Black",
    imageUrl: "⬛",
    views: 98,
    inStock: false,
    featured: false,
    description: "Luxurious marble urn with polished finish",
  },
  {
    id: "urn6",
    name: "Glass Hourglass Design",
    material: "Borosilicate Glass",
    style: "modern",
    price: 320,
    capacity: "200 cu in",
    color: "Clear",
    imageUrl: "🔷",
    views: 178,
    inStock: true,
    featured: false,
    description: "Elegant glass urn with artistic hourglass shape",
  },
]

export default function CremationUrnsPage() {
  const { theme } = useTheme()
  const [urns, setUrns] = useState<Urn[]>(mockUrns)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStyle, setFilterStyle] = useState<"all" | "classic" | "modern" | "personalized" | "biodegradable">("all")
  const [selectedUrn, setSelectedUrn] = useState<Urn | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filtered = urns.filter((urn) => {
    const matchesSearch = urn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      urn.material.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStyle === "all" || urn.style === filterStyle
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    setUrns(urns.filter((u) => u.id !== id))
    toast.success("Urn removed from catalog")
  }

  const handleEdit = (urn: Urn) => {
    setSelectedUrn(urn)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedUrn(null)
    setShowModal(true)
  }

  const handleToggleFeatured = (id: string) => {
    setUrns(urns.map((u) => (u.id === id ? { ...u, featured: !u.featured } : u)))
    toast.success("Featured status updated")
  }

  const handleToggleStock = (id: string) => {
    setUrns(urns.map((u) => (u.id === id ? { ...u, inStock: !u.inStock } : u)))
    toast.success("Stock status updated")
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case "classic":
        return "bg-blue-100 text-blue-800"
      case "modern":
        return "bg-purple-100 text-purple-800"
      case "personalized":
        return "bg-pink-100 text-pink-800"
      case "biodegradable":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    { label: "Total Urns", value: urns.length, icon: "🏺", color: "from-blue-500 to-blue-600" },
    { label: "Featured", value: urns.filter((u) => u.featured).length, icon: "⭐", color: "from-yellow-500 to-yellow-600" },
    { label: "In Stock", value: urns.filter((u) => u.inStock).length, icon: "✓", color: "from-green-500 to-green-600" },
    { label: "Total Views", value: urns.reduce((sum, u) => sum + u.views, 0), icon: "👁️", color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Cremation Urns Gallery
          </h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage cremation urn catalog and inventory
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} /> Add Urn
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
            placeholder="Search by name or material..."
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
          value={filterStyle}
          onChange={(e) => setFilterStyle(e.target.value as any)}
          className={cn(
            "px-4 py-2 rounded-lg border transition-colors",
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500",
          )}
        >
          <option value="all">All Styles</option>
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
          <option value="personalized">Personalized</option>
          <option value="biodegradable">Biodegradable</option>
        </select>
      </div>

      {/* Urns Gallery Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((urn) => (
          <motion.div
            key={urn.id}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "rounded-lg border overflow-hidden transition-all",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            {/* Image */}
            <div className={cn("h-48 flex items-center justify-center text-6xl", theme === "dark" ? "bg-slate-700" : "bg-gray-100")}>
              {urn.imageUrl}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className={cn("font-semibold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {urn.name}
                  </h3>
                  <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    {urn.material}
                  </p>
                </div>
                {urn.featured && <span className="text-lg">⭐</span>}
              </div>

              <span className={cn("inline-block px-2 py-1 text-xs font-semibold rounded mb-3", getStyleColor(urn.style))}>
                {urn.style.charAt(0).toUpperCase() + urn.style.slice(1)}
              </span>

              <p className={cn("text-sm mb-3", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                {urn.description}
              </p>

              <div className="space-y-2 mb-4 text-sm">
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <Package size={16} /> {urn.capacity}
                </p>
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <DollarSign size={16} /> ${urn.price}
                </p>
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <Eye size={16} /> {urn.views} views
                </p>
              </div>

              <div className="flex gap-2 mb-3">
                <span className={cn("px-2 py-1 text-xs font-semibold rounded", urn.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                  {urn.inStock ? "✓ In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleToggleFeatured(urn.id)}
                  className={cn(
                    "flex-1 px-2 py-1 text-sm rounded transition-colors",
                    urn.featured
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400",
                  )}
                >
                  {urn.featured ? "★" : "☆"} Featured
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleToggleStock(urn.id)}
                  className={cn(
                    "flex-1 px-2 py-1 text-sm rounded transition-colors",
                    urn.inStock
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700",
                  )}
                >
                  {urn.inStock ? "In Stock" : "Out"}
                </motion.button>
              </div>

              <div className="flex gap-2 mt-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(urn)} className="flex-1 p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded flex items-center justify-center gap-2">
                  <Edit2 size={16} /> Edit
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(urn.id)} className="flex-1 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 text-center rounded-lg", theme === "dark" ? "bg-slate-800" : "bg-gray-100")}>
          <Image size={48} className="mx-auto mb-4 opacity-50" />
          <p className={cn("text-lg font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>No urns found</p>
        </motion.div>
      )}
    </div>
  )
}
