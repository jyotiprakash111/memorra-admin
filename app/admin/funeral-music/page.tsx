"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, Music, Play, Pause, User, Clock, Download, Shuffle, Sparkles, RotateCcw } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  genre: string
  category: "hymn" | "classical" | "contemporary" | "traditional" | "custom"
  downloads: number
  featured: boolean
  uploadDate: string
  composer?: string
  audioUrl?: string
  moodTags: string[]
  activityTags: string[]
}

interface UserActivityProfile {
  id: string
  label: string
  userName: string
  recentActivity: string
  preferredCategories: Song["category"][]
  preferredTags: string[]
}

// Mock Data
const mockSongs: Song[] = [
  {
    id: "song1",
    title: "Amazing Grace",
    artist: "Traditional Hymn",
    duration: "3:24",
    genre: "Hymn",
    category: "hymn",
    downloads: 324,
    featured: true,
    uploadDate: "2024-01-15",
    audioUrl: "/audio/funeral-music/amazing-grace-preview.wav",
    moodTags: ["spiritual", "traditional", "comfort"],
    activityTags: ["church", "prayer", "religious-service", "family-legacy"],
  },
  {
    id: "song2",
    title: "Peaceful Moment",
    artist: "Classical Collection",
    duration: "4:12",
    genre: "Classical",
    category: "classical",
    downloads: 156,
    featured: true,
    uploadDate: "2024-01-20",
    composer: "Johann Pachelbel",
    audioUrl: "/audio/funeral-music/peaceful-moment-preview.wav",
    moodTags: ["peaceful", "classical", "instrumental"],
    activityTags: ["urn", "quiet-service", "memorial-slideshow", "formal-service"],
  },
  {
    id: "song3",
    title: "In My Life",
    artist: "The Beatles",
    duration: "2:25",
    genre: "Classic Rock",
    category: "contemporary",
    downloads: 89,
    featured: false,
    uploadDate: "2024-02-01",
    audioUrl: "/audio/funeral-music/in-my-life-preview.wav",
    moodTags: ["nostalgic", "contemporary", "family"],
    activityTags: ["photo-upload", "family-legacy", "memory-story", "celebration"],
  },
  {
    id: "song4",
    title: "Nearer My God to Thee",
    artist: "Traditional",
    duration: "3:45",
    genre: "Hymn",
    category: "hymn",
    downloads: 267,
    featured: false,
    uploadDate: "2024-02-10",
    audioUrl: "/audio/funeral-music/nearer-my-god-preview.wav",
    moodTags: ["spiritual", "traditional", "solemn"],
    activityTags: ["church", "prayer", "religious-service", "traditional-service"],
  },
  {
    id: "song5",
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    duration: "5:33",
    genre: "Classical",
    category: "classical",
    downloads: 198,
    featured: false,
    uploadDate: "2024-02-15",
    composer: "Ludwig van Beethoven",
    audioUrl: "/audio/funeral-music/moonlight-sonata-preview.wav",
    moodTags: ["classical", "instrumental", "solemn"],
    activityTags: ["formal-service", "quiet-service", "memorial-slideshow", "urn"],
  },
  {
    id: "song6",
    title: "Unforgettable",
    artist: "Nat King Cole",
    duration: "3:02",
    genre: "Jazz",
    category: "contemporary",
    downloads: 142,
    featured: false,
    uploadDate: "2024-03-01",
    audioUrl: "/audio/funeral-music/unforgettable-preview.wav",
    moodTags: ["nostalgic", "jazz", "warm"],
    activityTags: ["photo-upload", "memory-story", "celebration", "family-legacy"],
  },
  {
    id: "song7",
    title: "Soft Farewell",
    artist: "Memorial Piano Ensemble",
    duration: "3:48",
    genre: "Piano",
    category: "classical",
    downloads: 118,
    featured: false,
    uploadDate: "2024-03-11",
    audioUrl: "/audio/funeral-music/soft-farewell-preview.wav",
    moodTags: ["peaceful", "instrumental", "comfort"],
    activityTags: ["quiet-service", "memorial-slideshow", "formal-service"],
  },
  {
    id: "song8",
    title: "Forever Remembered",
    artist: "Celebration Choir",
    duration: "4:06",
    genre: "Choir",
    category: "traditional",
    downloads: 203,
    featured: true,
    uploadDate: "2024-03-18",
    audioUrl: "/audio/funeral-music/forever-remembered-preview.wav",
    moodTags: ["spiritual", "warm", "traditional"],
    activityTags: ["church", "celebration", "family-legacy", "religious-service"],
  },
  {
    id: "song9",
    title: "Memory Lane",
    artist: "Acoustic Tribute",
    duration: "2:58",
    genre: "Acoustic",
    category: "contemporary",
    downloads: 94,
    featured: false,
    uploadDate: "2024-03-23",
    audioUrl: "/audio/funeral-music/memory-lane-preview.wav",
    moodTags: ["nostalgic", "family", "warm"],
    activityTags: ["photo-upload", "memory-story", "celebration"],
  },
  {
    id: "song10",
    title: "A Gentle Prayer",
    artist: "Sacred Strings",
    duration: "5:01",
    genre: "Instrumental Hymn",
    category: "hymn",
    downloads: 176,
    featured: false,
    uploadDate: "2024-03-29",
    audioUrl: "/audio/funeral-music/gentle-prayer-preview.wav",
    moodTags: ["spiritual", "instrumental", "solemn"],
    activityTags: ["prayer", "church", "traditional-service", "quiet-service"],
  },
]

const activityProfiles: UserActivityProfile[] = [
  {
    id: "family-memory",
    label: "Family memory uploads",
    userName: "Sarah Johnson",
    recentActivity: "Uploaded family photos and wrote memory stories",
    preferredCategories: ["contemporary", "traditional"],
    preferredTags: ["photo-upload", "memory-story", "family-legacy", "nostalgic"],
  },
  {
    id: "church-service",
    label: "Church funeral planning",
    userName: "Michael Davis",
    recentActivity: "Selected church service, prayer notes, and traditional dress code",
    preferredCategories: ["hymn", "traditional"],
    preferredTags: ["church", "prayer", "religious-service", "spiritual"],
  },
  {
    id: "quiet-memorial",
    label: "Quiet memorial preference",
    userName: "Emily Turner",
    recentActivity: "Viewed urns, obituary, and private memorial options",
    preferredCategories: ["classical", "traditional"],
    preferredTags: ["quiet-service", "urn", "instrumental", "peaceful"],
  },
  {
    id: "celebration-life",
    label: "Celebration of life",
    userName: "John Davis",
    recentActivity: "Shared stories, photos, and celebration-style memorial wishes",
    preferredCategories: ["contemporary", "custom"],
    preferredTags: ["celebration", "memory-story", "family-legacy", "warm"],
  },
]

export default function FuneralMusicPage() {
  const { theme } = useTheme()
  const [songs, setSongs] = useState<Song[]>(mockSongs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "hymn" | "classical" | "contemporary" | "traditional" | "custom">("all")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState(activityProfiles[0].id)
  const [suggestionOrder, setSuggestionOrder] = useState<string[]>(mockSongs.map((song) => song.id))
  const [playingSongId, setPlayingSongId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const selectedActivity = activityProfiles.find((profile) => profile.id === selectedActivityId) ?? activityProfiles[0]

  const getActivityMatchScore = (song: Song, profile = selectedActivity) => {
    const categoryScore = profile.preferredCategories.includes(song.category) ? 35 : 0
    const tagMatches = [...song.activityTags, ...song.moodTags].filter((tag) => profile.preferredTags.includes(tag)).length
    const featuredScore = song.featured ? 8 : 0
    const popularityScore = Math.min(Math.floor(song.downloads / 75), 8)

    return categoryScore + tagMatches * 14 + featuredScore + popularityScore
  }

  const filtered = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === "all" || song.category === filterCategory
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    const aIndex = suggestionOrder.indexOf(a.id)
    const bIndex = suggestionOrder.indexOf(b.id)
    return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
  })

  const handleDelete = (id: string) => {
    setSongs(songs.filter((s) => s.id !== id))
    toast.success("Song removed from library")
  }

  const handleEdit = (song: Song) => {
    setSelectedSong(song)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedSong(null)
    setShowModal(true)
  }

  const handleToggleFeatured = (id: string) => {
    setSongs(songs.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s)))
    toast.success("Featured status updated")
  }

  const handlePlayPreview = (song: Song) => {
    if (!song.audioUrl) {
      toast.error("No playable preview available")
      return
    }

    if (playingSongId === song.id) {
      audioRef.current?.pause()
      setPlayingSongId(null)
      return
    }

    audioRef.current?.pause()

    const audio = new Audio(song.audioUrl)
    audioRef.current = audio
    setPlayingSongId(song.id)

    audio.play().catch(() => {
      toast.error("Unable to play this preview")
      setPlayingSongId(null)
    })

    audio.onended = () => setPlayingSongId(null)
    audio.onerror = () => {
      toast.error("Audio preview failed to load")
      setPlayingSongId(null)
    }
  }

  const handleShuffleSuggestions = () => {
    const shuffled = [...songs]
      .map((song) => ({
        song,
        weight: getActivityMatchScore(song) + Math.random() * 24,
      }))
      .sort((a, b) => b.weight - a.weight)
      .map(({ song }) => song.id)

    setSuggestionOrder(shuffled)
    toast.success(`Suggestions shuffled for ${selectedActivity.userName}`)
  }

  const handleResetSuggestions = () => {
    setSuggestionOrder(songs.map((song) => song.id))
    toast.success("Suggestion order reset")
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hymn":
        return "bg-blue-100 text-blue-800"
      case "classical":
        return "bg-purple-100 text-purple-800"
      case "contemporary":
        return "bg-green-100 text-green-800"
      case "traditional":
        return "bg-amber-100 text-amber-800"
      case "custom":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    { label: "Total Songs", value: songs.length, icon: "🎵", color: "from-blue-500 to-blue-600" },
    { label: "Featured", value: songs.filter((s) => s.featured).length, icon: "⭐", color: "from-yellow-500 to-yellow-600" },
    { label: "Total Downloads", value: songs.reduce((sum, s) => sum + s.downloads, 0), icon: "📥", color: "from-green-500 to-green-600" },
    { label: "Genres", value: new Set(songs.map((s) => s.genre)).size, icon: "🎼", color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Funeral Music Library
          </h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
            Manage music collection for funeral services and memorials
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} /> Add Song
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

      {/* Activity-based Suggestion Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-5 rounded-lg border space-y-4",
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className={cn("text-lg font-semibold flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
              <Sparkles size={20} className="text-yellow-500" />
              Activity-Based Music Suggestions
            </h2>
            <p className={cn("text-sm mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
              Shuffle the suggested music order based on a user&apos;s recent memorial planning activity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors min-w-[240px]",
                theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500",
              )}
            >
              {activityProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.userName} - {profile.label}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShuffleSuggestions}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Shuffle size={18} />
              Shuffle Suggestions
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetSuggestions}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
                theme === "dark" ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300",
              )}
            >
              <RotateCcw size={18} />
              Reset
            </motion.button>
          </div>
        </div>

        <div className={cn("p-4 rounded-lg border", theme === "dark" ? "bg-slate-700/50 border-slate-600" : "bg-purple-50 border-purple-100")}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                Active user activity: {selectedActivity.userName}
              </p>
              <p className={cn("text-sm mt-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>
                {selectedActivity.recentActivity}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedActivity.preferredTags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or artist..."
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
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as any)}
          className={cn(
            "px-4 py-2 rounded-lg border transition-colors",
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500",
          )}
        >
          <option value="all">All Categories</option>
          <option value="hymn">Hymns</option>
          <option value="classical">Classical</option>
          <option value="contemporary">Contemporary</option>
          <option value="traditional">Traditional</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Songs Library */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {filtered.map((song, index) => {
          const matchScore = getActivityMatchScore(song)

          return (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "p-5 rounded-lg border transition-all",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <button
                type="button"
                onClick={() => handlePlayPreview(song)}
                className={cn(
                  "p-3 text-white rounded-full transition-colors",
                  playingSongId === song.id
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700",
                )}
                title={playingSongId === song.id ? "Pause preview" : "Play preview"}
              >
                {playingSongId === song.id ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {song.title}
                  </h3>
                  {song.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">⭐ Featured</span>}
                  <span className={cn("px-2 py-1 text-xs font-semibold rounded", getCategoryColor(song.category))}>
                    {song.category.charAt(0).toUpperCase() + song.category.slice(1)}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                    {matchScore}% activity match
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <User size={16} /> {song.artist}
                  </p>
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <Clock size={16} /> {song.duration}
                  </p>
                  <p className={cn("flex items-center gap-2", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                    <Download size={16} /> {song.downloads} downloads
                  </p>
                  {song.audioUrl && (
                    <p className="flex items-center gap-2 text-green-600">
                      <Music size={16} /> Playable preview
                    </p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...song.activityTags, ...song.moodTags]
                    .filter((tag, tagIndex, tags) => tags.indexOf(tag) === tagIndex)
                    .slice(0, 5)
                    .map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          selectedActivity.preferredTags.includes(tag)
                            ? "bg-green-100 text-green-700 font-semibold"
                            : theme === "dark"
                              ? "bg-slate-700 text-slate-300"
                              : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleToggleFeatured(song.id)}
                  className={cn(
                    "px-3 py-1 text-sm rounded transition-colors",
                    song.featured
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400",
                  )}
                >
                  {song.featured ? "★ Featured" : "☆ Feature"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(song)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded">
                  <Edit2 size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDelete(song.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded">
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-12 text-center rounded-lg", theme === "dark" ? "bg-slate-800" : "bg-gray-100")}>
          <Music size={48} className="mx-auto mb-4 opacity-50" />
          <p className={cn("text-lg font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>No songs found</p>
        </motion.div>
      )}
    </div>
  )
}
