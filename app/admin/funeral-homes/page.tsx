"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, MapPin, Phone, Mail, Globe, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { sampleFuneralHomes, sampleCemeteries } from "@/src/data/funeralHomesData"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

// Types
interface FuneralHome {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email?: string
  website?: string
  services: string[]
  hours?: {
    [day: string]: { open: string; close: string }
  }
  rating?: number
  isActive: boolean
  verified: boolean
  createdAt: string
}

interface Cemetery {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email?: string
  website?: string
  plotPricing?: number
  services: string[]
  isActive: boolean
  verified: boolean
  createdAt: string
}

// Transform sample data into component types with IDs and timestamps
const mockFuneralHomes: FuneralHome[] = sampleFuneralHomes.map((home: any, idx: number) => ({
  id: `fh${idx}`,
  ...home,
  rating: Math.random() * 0.5 + 4.5, // Random rating 4.5-5.0
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

const mockCemeteries: Cemetery[] = sampleCemeteries.map((cemetery: any, idx: number) => ({
  id: `c${idx}`,
  ...cemetery,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]

const SERVICES_OPTIONS = [
  "Cremation",
  "Embalming",
  "Funeral Planning",
  "Pre-need Arrangements",
  "Graveside Service",
  "Memorial Service",
  "Consultation",
  "Ground Burial",
  "Mausoleum",
  "Columbarium",
  "Cremation Garden",
  "Pre-planning",
  "Maintenance",
]

export default function FuneralHomesPage() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<"homes" | "cemeteries">("homes")
  const [funeralHomes, setFuneralHomes] = useState<FuneralHome[]>(mockFuneralHomes)
  const [cemeteries, setCemeteries] = useState<Cemetery[]>(mockCemeteries)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedHome, setSelectedHome] = useState<FuneralHome | null>(null)
  const [selectedCemetery, setSelectedCemetery] = useState<Cemetery | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Filtering
  const filteredHomes = funeralHomes.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.zipCode.includes(searchTerm)
    const matchesState = selectedState === "" || h.state === selectedState
    return matchesSearch && matchesState
  })

  const filteredCemeteries = cemeteries.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zipCode.includes(searchTerm)
    const matchesState = selectedState === "" || c.state === selectedState
    return matchesSearch && matchesState
  })

  // Handlers - Funeral Homes
  const handleDeleteHome = (id: string) => {
    setFuneralHomes(funeralHomes.filter((h) => h.id !== id))
    toast.success("Funeral home deleted")
  }

  const handleEditHome = (home: FuneralHome) => {
    setSelectedHome(home)
    setShowModal(true)
  }

  const handleAddHome = () => {
    setSelectedHome(null)
    setShowModal(true)
  }

  // Handlers - Cemeteries
  const handleDeleteCemetery = (id: string) => {
    setCemeteries(cemeteries.filter((c) => c.id !== id))
    toast.success("Cemetery deleted")
  }

  const handleEditCemetery = (cemetery: Cemetery) => {
    setSelectedCemetery(cemetery)
    setShowModal(true)
  }

  const handleAddCemetery = () => {
    setSelectedCemetery(null)
    setShowModal(true)
  }

  // Stats
  const stats = [
    {
      label: "Total Funeral Homes",
      value: funeralHomes.length,
      icon: "🏢",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Verified Homes",
      value: funeralHomes.filter((h) => h.verified).length,
      icon: "✓",
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Cemeteries",
      value: cemeteries.length,
      icon: "⛪",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "States Covered",
      value: new Set([...funeralHomes, ...cemeteries].map((item) => item.state)).size,
      icon: "🗺️",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Funeral Homes & Cemeteries
          </h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage funeral homes and cemetery databases for all 50 US states
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
              "p-6 rounded-lg border transition-all bg-linear-to-br",
              theme === "dark"
                ? "border-slate-700 hover:border-slate-600 from-slate-800 to-slate-900"
                : "border-gray-200 hover:border-gray-300 from-white to-gray-50",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  {stat.label}
                </p>
                <p className={cn("text-3xl font-bold mt-2", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700">
        {[
          { id: "homes", label: "Funeral Homes", icon: "🏢" },
          { id: "cemeteries", label: "Cemeteries", icon: "⛪" },
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={activeTab === "homes" ? "Search funeral homes..." : "Search cemeteries..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
              )}
            />
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-300 text-gray-900",
            )}
          >
            <option value="">All States</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={activeTab === "homes" ? handleAddHome : handleAddCemetery}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Add New
          </motion.button>
        </div>

        {/* Funeral Homes Tab */}
        {activeTab === "homes" && (
          <div className="space-y-4">
            {filteredHomes.length === 0 ? (
              <div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>
                  No funeral homes found matching your search
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHomes.map((home) => (
                  <motion.div
                    key={home.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                      "p-6 rounded-lg border transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                        : "bg-white border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                            {home.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {home.verified && <CheckCircle size={16} className="text-green-600" />}
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded",
                                home.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400",
                              )}
                            >
                              {home.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        {home.rating && (
                          <div className="text-right">
                            <p className="text-sm font-bold text-yellow-500">★ {home.rating}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className={cn("mt-0.5 shrink-0", theme === "dark" ? "text-slate-400" : "text-gray-500")} />
                          <div className={theme === "dark" ? "text-slate-300" : "text-gray-700"}>
                            {home.address}
                            <br />
                            {home.city}, {home.state} {home.zipCode}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                          <a href={`tel:${home.phone}`} className="text-blue-500 hover:underline">
                            {home.phone}
                          </a>
                        </div>
                        {home.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                            <a href={`mailto:${home.email}`} className="text-blue-500 hover:underline break-all">
                              {home.email}
                            </a>
                          </div>
                        )}
                        {home.website && (
                          <div className="flex items-center gap-2">
                            <Globe size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                            <a href={home.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {home.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {home.services.length > 0 && (
                        <div>
                          <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Services
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {home.services.slice(0, 3).map((service) => (
                              <span key={service} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 rounded">
                                {service}
                              </span>
                            ))}
                            {home.services.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400 rounded">
                                +{home.services.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditHome(home)}
                          className="flex-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                        >
                          <Edit2 size={16} className="inline mr-2" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteHome(home.id)}
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

        {/* Cemeteries Tab */}
        {activeTab === "cemeteries" && (
          <div className="space-y-4">
            {filteredCemeteries.length === 0 ? (
              <div
                className={cn(
                  "p-8 rounded-lg border-2 border-dashed text-center",
                  theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-gray-50",
                )}
              >
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p className={theme === "dark" ? "text-slate-400" : "text-gray-600"}>
                  No cemeteries found matching your search
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCemeteries.map((cemetery) => (
                  <motion.div
                    key={cemetery.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                      "p-6 rounded-lg border transition-all",
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                        : "bg-white border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                            {cemetery.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {cemetery.verified && <CheckCircle size={16} className="text-green-600" />}
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded",
                                cemetery.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400",
                              )}
                            >
                              {cemetery.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        {cemetery.plotPricing && (
                          <div className="text-right">
                            <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                              ${cemetery.plotPricing.toLocaleString()}
                            </p>
                            <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Per Plot</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className={cn("mt-0.5 shrink-0", theme === "dark" ? "text-slate-400" : "text-gray-500")} />
                          <div className={theme === "dark" ? "text-slate-300" : "text-gray-700"}>
                            {cemetery.address}
                            <br />
                            {cemetery.city}, {cemetery.state} {cemetery.zipCode}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                          <a href={`tel:${cemetery.phone}`} className="text-blue-500 hover:underline">
                            {cemetery.phone}
                          </a>
                        </div>
                        {cemetery.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                            <a href={`mailto:${cemetery.email}`} className="text-blue-500 hover:underline break-all">
                              {cemetery.email}
                            </a>
                          </div>
                        )}
                        {cemetery.website && (
                          <div className="flex items-center gap-2">
                            <Globe size={16} className={theme === "dark" ? "text-slate-400" : "text-gray-500"} />
                            <a href={cemetery.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {cemetery.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {cemetery.services.length > 0 && (
                        <div>
                          <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                            Services
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {cemetery.services.slice(0, 3).map((service) => (
                              <span key={service} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 rounded">
                                {service}
                              </span>
                            ))}
                            {cemetery.services.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400 rounded">
                                +{cemetery.services.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditCemetery(cemetery)}
                          className="flex-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                        >
                          <Edit2 size={16} className="inline mr-2" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteCemetery(cemetery.id)}
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
      </motion.div>
    </div>
  )
}
