"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { Trash2, Eye, CheckCircle, XCircle, Share2, Heart, MessageCircle, Search, FileText, Clock, Star } from "lucide-react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface UserPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  images: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
  status: "approved" | "pending" | "rejected"
  isFeatured: boolean
  category: string
}

const mockPosts: UserPost[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Sarah Johnson",
    userAvatar: "🧑‍🦰",
    content: "Beautiful memories of our family gathering. Thank you all for being there! 💕",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 234,
    comments: 45,
    shares: 12,
    createdAt: "2026-04-06T14:30:00Z",
    status: "approved",
    isFeatured: true,
    category: "memorial",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Michael Chen",
    userAvatar: "🧑",
    content: "Creating a digital legacy has been so meaningful for my family.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 156,
    comments: 28,
    shares: 8,
    createdAt: "2026-04-05T10:15:00Z",
    status: "pending",
    isFeatured: false,
    category: "story",
  },
  {
    id: "3",
    userId: "u3",
    userName: "Emma Wilson",
    userAvatar: "👩",
    content: "This app helped us preserve our family stories for generations to come.",
    images: [
      "https://images.unsplash.com/photo-1478061653917-455ba7f4a541?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 98,
    comments: 15,
    shares: 4,
    createdAt: "2026-04-04T16:45:00Z",
    status: "approved",
    isFeatured: false,
    category: "testimonial",
  },
  {
    id: "4",
    userId: "u4",
    userName: "James Brown",
    userAvatar: "🧑‍🦱",
    content: "Inappropriate content alert",
    images: [
      "https://images.unsplash.com/photo-1519834022362-b5d307dca9f8?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 2,
    comments: 1,
    shares: 0,
    createdAt: "2026-04-03T12:00:00Z",
    status: "rejected",
    isFeatured: false,
    category: "other",
  },
]

export default function PostsPage() {
  const { theme } = useTheme()
  const [posts, setPosts] = useState<UserPost[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [selectedPost, setSelectedPost] = useState<UserPost | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || post.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updatePostStatus = (postId: string, newStatus: "approved" | "pending" | "rejected") => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, status: newStatus } : p)))
    toast.success(`Post ${newStatus}!`)
  }

  const toggleFeatured = (postId: string) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, isFeatured: !p.isFeatured } : p)))
    toast.success("Featured status updated!")
  }

  const deletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId))
    toast.success("Post deleted!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />
      case "pending":
        return <div className="w-4 h-4 rounded-full border-2 border-yellow-500" />
      case "rejected":
        return <XCircle size={16} />
      default:
        return null
    }
  }

  const stats = [
    { label: "Total Posts", value: posts.length, icon: FileText, color: "from-blue-500 to-blue-600", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
    { label: "Approved", value: posts.filter((p) => p.status === "approved").length, icon: CheckCircle, color: "from-green-500 to-green-600", iconBg: "bg-green-500/10", iconColor: "text-green-500" },
    { label: "Pending", value: posts.filter((p) => p.status === "pending").length, icon: Clock, color: "from-yellow-500 to-yellow-600", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500" },
    { label: "Rejected", value: posts.filter((p) => p.status === "rejected").length, icon: XCircle, color: "from-red-500 to-red-600", iconBg: "bg-red-500/10", iconColor: "text-red-500" },
    { label: "Featured", value: posts.filter((p) => p.isFeatured).length, icon: Star, color: "from-purple-500 to-purple-600", iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>User Posts Management</h1>
        <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
          Moderate, approve, and manage user-generated posts and content
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon

          return (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
                <p className="text-2xl font-bold bg-linear-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, var(--color-1), var(--color-2))` }}>
                  {stat.value}
                </p>
              </div>
              <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", stat.iconBg)}>
                <Icon size={22} className={stat.iconColor} />
              </div>
            </div>
          </motion.div>
          )
        })}
      </div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-4 rounded-lg border space-y-4", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", theme === "dark" ? "text-slate-400" : "text-gray-400")} size={18} />
            <input
              type="text"
              placeholder="Search by content or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
                theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
              )}
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(["all", "approved", "pending", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  statusFilter === status
                    ? "bg-green-500 text-white"
                    : theme === "dark"
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={cn("p-6 rounded-lg border transition-all hover:shadow-lg", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="text-3xl mt-1">{post.userAvatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{post.userName}</h3>
                      <span className={cn("text-xs px-2 py-1 rounded-full border", getStatusColor(post.status))} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      {post.isFeatured && <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 border border-purple-200">⭐ Featured</span>}
                    </div>
                    <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-500")}>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedPost(post); setShowModal(true); }} className={cn("p-2 rounded-lg transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600")}>
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <p className={cn("mb-4 text-sm leading-relaxed", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{post.content}</p>

              {/* Post Images */}
              {post.images.length > 0 && (
                <div className={cn("grid grid-cols-2 gap-2 mb-4 rounded-lg overflow-hidden", post.images.length === 1 ? "grid-cols-1" : "")}>
                  {post.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowModal(true)
                      }}
                      className="group relative bg-gray-200 rounded aspect-square overflow-hidden"
                      title={`View ${post.userName}'s posted image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${post.userName} post image ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                        Image {i + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex gap-4 mb-4 py-3 border-t border-b" style={{ borderColor: theme === "dark" ? "#334155" : "#e5e7eb" }}>
                <div className="flex items-center gap-2 text-sm">
                  <Heart size={16} className="text-red-500" />
                  <span className={theme === "dark" ? "text-slate-300" : "text-gray-700"}>{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle size={16} className="text-blue-500" />
                  <span className={theme === "dark" ? "text-slate-300" : "text-gray-700"}>{post.comments}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Share2 size={16} className="text-green-500" />
                  <span className={theme === "dark" ? "text-slate-300" : "text-gray-700"}>{post.shares}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {post.status !== "approved" && (
                  <button onClick={() => updatePostStatus(post.id, "approved")} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Approve
                  </button>
                )}
                {post.status !== "rejected" && (
                  <button onClick={() => updatePostStatus(post.id, "rejected")} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Reject
                  </button>
                )}
                {post.status !== "pending" && (
                  <button onClick={() => updatePostStatus(post.id, "pending")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700")}>
                    Mark Pending
                  </button>
                )}

                <button onClick={() => toggleFeatured(post.id)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", post.isFeatured ? "bg-purple-500 hover:bg-purple-600 text-white" : theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700")}>
                  {post.isFeatured ? "Unfeature" : "Feature"}
                </button>

                <button onClick={() => deletePost(post.id)} className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 rounded-lg border text-center", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
            <p className={cn("text-lg font-medium mb-2", theme === "dark" ? "text-slate-300" : "text-gray-700")}>No posts found</p>
            <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-500")}>Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Post Detail Modal */}
      {showModal && selectedPost && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className={cn("max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto", theme === "dark" ? "bg-slate-800" : "bg-white")}>
            <h2 className={cn("text-2xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Post Details</h2>

            {/* Details Content */}
            <div className="space-y-4">
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>User</p>
                <p className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{selectedPost.userName} ({selectedPost.userId})</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Content</p>
                <p className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{selectedPost.content}</p>
              </div>
              {selectedPost.images.length > 0 && (
                <div>
                  <p className={cn("text-xs font-medium mb-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Posted Images</p>
                  <div className={cn("grid grid-cols-1 gap-3", selectedPost.images.length > 1 && "sm:grid-cols-2")}>
                    {selectedPost.images.map((image, index) => (
                      <a
                        key={image}
                        href={image}
                        target="_blank"
                        rel="noreferrer"
                        className="group block overflow-hidden rounded-lg border"
                        style={{ borderColor: theme === "dark" ? "#334155" : "#e5e7eb" }}
                      >
                        <img
                          src={image}
                          alt={`${selectedPost.userName} full post image ${index + 1}`}
                          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Category</p>
                <p className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>{selectedPost.category}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Engagement</p>
                <p className={cn("text-sm", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                  {selectedPost.likes} likes • {selectedPost.comments} comments • {selectedPost.shares} shares
                </p>
              </div>
            </div>

            <button onClick={() => setShowModal(false)} className="mt-6 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
