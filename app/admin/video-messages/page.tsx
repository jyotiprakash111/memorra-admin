"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, Video, Eye, EyeOff, Clock, User, FileText, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface VideoMessage {
  id: string
  title: string
  uploader: string
  deceased: string
  duration: string
  fileSize: string
  uploadDate: string
  views: number
  status: "uploaded" | "processing" | "ready" | "archived" | "hidden"
  videoUrl?: string
  thumbnail?: string
}

type VideoFormData = Omit<VideoMessage, "id">

const emptyVideoForm: VideoFormData = {
  title: "",
  uploader: "",
  deceased: "",
  duration: "",
  fileSize: "",
  uploadDate: new Date().toISOString().split("T")[0],
  views: 0,
  status: "uploaded",
  videoUrl: "",
  thumbnail: "🎬",
}

// Mock Data
const mockVideos: VideoMessage[] = [
  {
    id: "vm1",
    title: "Tribute to Grandma Mary",
    uploader: "Sarah Johnson",
    deceased: "Margaret Johnson",
    duration: "4:32",
    fileSize: "245 MB",
    uploadDate: "2024-04-10",
    views: 156,
    status: "ready",
    videoUrl: "https://example.com/vm1.mp4",
    thumbnail: "🎬",
  },
  {
    id: "vm2",
    title: "Uncle Bob's Stories",
    uploader: "Michael Davis",
    deceased: "Robert Williams",
    duration: "7:45",
    fileSize: "412 MB",
    uploadDate: "2024-04-05",
    views: 89,
    status: "ready",
    videoUrl: "https://example.com/vm2.mp4",
    thumbnail: "🎬",
  },
  {
    id: "vm3",
    title: "Family memories compilation",
    uploader: "Emily Turner",
    deceased: "James Turner",
    duration: "12:15",
    fileSize: "678 MB",
    uploadDate: "2024-03-28",
    views: 0,
    status: "processing",
    thumbnail: "🎬",
  },
  {
    id: "vm4",
    title: "Teacher appreciation video",
    uploader: "John Davis",
    deceased: "Patricia Davis",
    duration: "3:20",
    fileSize: "156 MB",
    uploadDate: "2024-02-14",
    views: 234,
    status: "ready",
    videoUrl: "https://example.com/vm4.mp4",
    thumbnail: "🎬",
  },
]

export default function VideoMessagesPage() {
  const { theme } = useTheme()
  const [videos, setVideos] = useState<VideoMessage[]>(mockVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | VideoMessage["status"]>("all")
  const [selectedVideo, setSelectedVideo] = useState<VideoMessage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<VideoFormData>(emptyVideoForm)

  const filtered = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.deceased.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.uploader.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || video.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id))
    toast.success("Video deleted")
  }

  const handleEdit = (video: VideoMessage) => {
    setSelectedVideo(video)
    setFormData({
      title: video.title,
      uploader: video.uploader,
      deceased: video.deceased,
      duration: video.duration,
      fileSize: video.fileSize,
      uploadDate: video.uploadDate,
      views: video.views,
      status: video.status,
      videoUrl: video.videoUrl ?? "",
      thumbnail: video.thumbnail ?? "🎬",
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedVideo(null)
    setFormData({ ...emptyVideoForm, uploadDate: new Date().toISOString().split("T")[0] })
    setShowModal(true)
  }

  const handleArchive = (id: string) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, status: "archived" as const } : v)))
    toast.success("Video archived")
  }

  const handleToggleHidden = (video: VideoMessage) => {
    const nextStatus: VideoMessage["status"] = video.status === "hidden" ? "ready" : "hidden"
    setVideos(videos.map((v) => (v.id === video.id ? { ...v, status: nextStatus } : v)))
    toast.success(nextStatus === "hidden" ? "Video message hidden" : "Video message visible again")
  }

  const handleSave = () => {
    const title = formData.title.trim()
    const uploader = formData.uploader.trim()
    const deceased = formData.deceased.trim()

    if (!title || !uploader || !deceased) {
      toast.error("Title, uploader, and deceased name are required")
      return
    }

    const payload: VideoMessage = {
      id: selectedVideo?.id ?? `vm${Date.now()}`,
      ...formData,
      title,
      uploader,
      deceased,
      duration: formData.duration.trim() || "0:00",
      fileSize: formData.fileSize.trim() || "0 MB",
      videoUrl: formData.videoUrl?.trim() || undefined,
      thumbnail: formData.thumbnail?.trim() || "🎬",
      views: Number(formData.views) || 0,
    }

    if (selectedVideo) {
      setVideos(videos.map((v) => (v.id === selectedVideo.id ? payload : v)))
      toast.success("Video message updated")
    } else {
      setVideos([payload, ...videos])
      toast.success("Video message added")
    }

    setShowModal(false)
    setSelectedVideo(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "uploaded":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "hidden":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    { label: "Total Videos", value: videos.length, icon: "🎬", color: "from-blue-500 to-blue-600" },
    { label: "Ready to View", value: videos.filter((v) => v.status === "ready").length, icon: "✓", color: "from-green-500 to-green-600" },
    { label: "Hidden Videos", value: videos.filter((v) => v.status === "hidden").length, icon: "🙈", color: "from-red-500 to-red-600" },
    { label: "Total Views", value: videos.reduce((sum, v) => sum + v.views, 0), icon: "👁️", color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Video Message Tracking
          </h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage funeral tribute and memorial videos
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} /> Upload Video
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
            placeholder="Search by title, deceased, or uploader..."
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
          <option value="uploaded">Uploaded</option>
          <option value="processing">Processing</option>
          <option value="ready">Ready</option>
          <option value="archived">Archived</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Videos List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {filtered.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "p-6 rounded-lg border transition-all flex flex-col md:flex-row md:items-center gap-4",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300",
              video.status === "hidden" && "opacity-70",
            )}
          >
            <div className="text-5xl">{video.thumbnail}</div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {video.title}
                </h3>
                <span className={cn("px-2 py-1 text-xs font-semibold rounded", getStatusColor(video.status))}>
                  {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <User size={16} /> {video.uploader}
                </p>
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <FileText size={16} /> {video.deceased}
                </p>
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <Clock size={16} /> {video.duration}
                </p>
                <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                  <Eye size={16} /> {video.views} views
                </p>
              </div>
              <p className={cn("text-xs mt-2", theme === "dark" ? "text-slate-500" : "text-gray-500")}>
                Uploaded: {video.uploadDate} • Size: {video.fileSize}
              </p>
            </div>

            <div className="flex gap-2">
              {video.status === "ready" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleArchive(video.id)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Archive
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleToggleHidden(video)}
                className={cn(
                  "px-3 py-1 text-sm rounded transition-colors flex items-center gap-1",
                  video.status === "hidden"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-orange-500 text-white hover:bg-orange-600",
                )}
              >
                {video.status === "hidden" ? <Eye size={14} /> : <EyeOff size={14} />}
                {video.status === "hidden" ? "Unhide" : "Hide"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(video)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded">
                <Edit2 size={18} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(video.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded">
                <Trash2 size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 text-center rounded-lg", theme === "dark" ? "bg-slate-800" : "bg-gray-100")}>
          <Video size={48} className="mx-auto mb-4 opacity-50" />
          <p className={cn("text-lg font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>No videos found</p>
        </motion.div>
      )}

      {/* Add / Edit Video Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {selectedVideo ? "Edit Video Message" : "Upload Video Message"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500",
                )}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                    theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                  placeholder="Tribute to Grandma Mary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Uploader
                  </label>
                  <input
                    type="text"
                    value={formData.uploader}
                    onChange={(e) => setFormData((prev) => ({ ...prev, uploader: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Memorial / Deceased
                  </label>
                  <input
                    type="text"
                    value={formData.deceased}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deceased: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as VideoMessage["status"] }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  >
                    <option value="uploaded">Uploaded</option>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready</option>
                    <option value="archived">Archived</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                    placeholder="4:32"
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Views
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.views}
                    onChange={(e) => setFormData((prev) => ({ ...prev, views: Number(e.target.value) }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    File size
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fileSize: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                    placeholder="245 MB"
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Upload date
                  </label>
                  <input
                    type="date"
                    value={formData.uploadDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, uploadDate: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                    Thumbnail
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                      theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                    placeholder="🎬"
                  />
                </div>
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-green-500/40",
                    theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors",
                    theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900",
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  {selectedVideo ? "Save Changes" : "Add Video"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
