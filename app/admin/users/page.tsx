"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme-context"
import { Edit2, Trash2, Plus, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Link from "next/link"

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  joinedDate: string
  planType: string
}

type UserFormData = Omit<User, "id">

const PLAN_TYPES = ["Basic (Free)", "Premium ($8.99/mo)"] as const

const emptyForm: UserFormData = {
  name: "",
  email: "",
  status: "active",
  joinedDate: new Date().toISOString().split("T")[0],
  planType: "Basic",
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinedDate: "2024-01-15",
    planType: "Premium ($8.99/mo)",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    joinedDate: "2024-02-20",
    planType: "Basic (Free)",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "inactive",
    joinedDate: "2023-12-10",
    planType: "Premium ($8.99/mo)",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "active",
    joinedDate: "2024-01-05",
    planType: "Basic (Free)",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    status: "active",
    joinedDate: "2024-02-01",
    planType: "Premium ($8.99/mo)",
  },
]

const inputClass = (theme: string) =>
  cn(
    "w-full px-4 py-2 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-green-500/40",
    theme === "dark"
      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
  )

const labelClass = (theme: string) =>
  cn("block text-sm font-medium mb-1.5", theme === "dark" ? "text-slate-300" : "text-gray-700")

export default function UsersPage() {
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>(emptyForm)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (!showModal) return
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        status: selectedUser.status,
        joinedDate: selectedUser.joinedDate,
        planType: selectedUser.planType,
      })
    } else {
      setFormData({ ...emptyForm, joinedDate: new Date().toISOString().split("T")[0] })
    }
  }, [showModal, selectedUser])

  const openAddModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
    toast.success("User deleted successfully")
  }

  const handleSave = () => {
    const name = formData.name.trim()
    const email = formData.email.trim()

    if (!name || !email) {
      toast.error("Name and email are required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    const duplicate = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== selectedUser?.id,
    )
    if (duplicate) {
      toast.error("A user with this email already exists")
      return
    }

    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...formData, name, email } : u,
        ),
      )
      toast.success("User updated successfully")
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        name,
        email,
      }
      setUsers([newUser, ...users])
      toast.success("User created successfully")
    }

    closeModal()
  }

  const updateField = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className={cn(
              "text-3xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            User Management
          </h2>
          <p
            className={cn(
              "text-sm mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-600",
            )}
          >
            Manage user accounts, subscription status, and access to premium features.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add User
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <Search size={20} className={theme === "dark" ? "text-slate-400" : "text-gray-400"} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "flex-1 bg-transparent outline-none font-medium",
            theme === "dark" ? "text-white placeholder-slate-500" : "text-gray-900 placeholder-gray-400",
          )}
        />
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-lg border overflow-hidden",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto w-full"
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr
                className={cn(
                  "border-b",
                  theme === "dark"
                    ? "bg-slate-700/50 border-slate-700"
                    : "bg-gray-50 border-gray-200",
                )}
              >
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
                      No users match your search
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "border-b transition-colors",
                      theme === "dark"
                        ? "border-slate-700 hover:bg-slate-700/50"
                        : "border-gray-200 hover:bg-gray-50",
                      user.status === "inactive" && "opacity-75 grayscale-[0.2]",
                    )}
                  >
                    <td className="px-6 py-4">
                      <Link href={`/admin/users/${user.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <span
                            className={cn(
                              "font-medium hover:text-green-500 transition-colors",
                              theme === "dark" ? "text-white" : "text-gray-900",
                            )}
                          >
                            {user.name}
                          </span>
                        </motion.div>
                      </Link>
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 text-sm",
                        theme === "dark" ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {user.email}
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 text-sm",
                        theme === "dark" ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          user.planType.startsWith("Premium")
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700",
                        )}
                      >
                        {user.planType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                          user.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-slate-100 text-slate-800 border border-slate-200",
                        )}
                      >
                        {user.status === "active" ? "✓ Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-lg border",
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          <p
            className={cn(
              "text-sm font-medium mb-2",
              theme === "dark" ? "text-slate-400" : "text-gray-600",
            )}
          >
            Total Users
          </p>
          <p className="text-2xl font-bold text-green-500">{users.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-4 rounded-lg border",
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          <p
            className={cn(
              "text-sm font-medium mb-2",
              theme === "dark" ? "text-slate-400" : "text-gray-600",
            )}
          >
            Active Users
          </p>
          <p className="text-2xl font-bold text-blue-500">
            {users.filter((u) => u.status === "active").length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-lg border",
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          <p
            className={cn(
              "text-sm font-medium mb-2",
              theme === "dark" ? "text-slate-400" : "text-gray-600",
            )}
          >
            Premium Users
          </p>
          <p className="text-2xl font-bold text-purple-500">
            {users.filter((u) => u.planType.startsWith("Premium")).length}
          </p>
        </motion.div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeModal}
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {selectedUser ? "Edit User" : "Add New User"}
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
                <label className={labelClass(theme)} htmlFor="user-name">
                  Full name
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass(theme)}
                />
              </div>

              <div>
                <label className={labelClass(theme)} htmlFor="user-email">
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputClass(theme)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <label className={labelClass(theme)} htmlFor="user-plan">
                    Plan
                  </label>
                  <select
                    id="user-plan"
                    value={formData.planType}
                    onChange={(e) => updateField("planType", e.target.value)}
                    className={inputClass(theme)}
                  >
                    {PLAN_TYPES.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <label className={labelClass(theme)} htmlFor="user-status">
                    Status
                  </label>
                  <select
                    id="user-status"
                    value={formData.status}
                    onChange={(e) => updateField("status", e.target.value as User["status"])}
                    className={inputClass(theme)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </motion.div>
              </div>

              <div>
                <label className={labelClass(theme)} htmlFor="user-joined">
                  Joined date
                </label>
                <input
                  id="user-joined"
                  type="date"
                  value={formData.joinedDate}
                  onChange={(e) => updateField("joinedDate", e.target.value)}
                  className={inputClass(theme)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors",
                    theme === "dark"
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900",
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all"
                >
                  {selectedUser ? "Save changes" : "Create user"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
