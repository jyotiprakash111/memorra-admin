"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  Shield,
  AlertTriangle,
  Ban,
  Users,
  TrendingUp,
  Lock,
  Eye,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface BannedUser {
  id: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  bannedDate: string;
  bannedBy: string;
  duration: string;
}

interface SafetyRule {
  id: string;
  name: string;
  description: string;
  type: string;
  severity: string;
  status: string;
}

export default function SafetyPage() {
  const { theme } = useTheme();
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([
    {
      id: "b1",
      userId: "user-123",
      username: "spamuser",
      email: "spam@example.com",
      reason: "Posting inappropriate content",
      bannedDate: "2024-04-05",
      bannedBy: "Admin",
      duration: "Permanent",
    },
    {
      id: "b2",
      userId: "user-456",
      username: "abuser99",
      email: "abuse@example.com",
      reason: "Harassment",
      bannedDate: "2024-04-02",
      bannedBy: "Moderator",
      duration: "30 days",
    },
  ]);

  const [safetyRules, setSafetyRules] = useState<SafetyRule[]>([
    {
      id: "r1",
      name: "Block Explicit Content",
      description: "Automatically flag explicit content uploads",
      type: "content",
      severity: "high",
      status: "active",
    },
    {
      id: "r2",
      name: "Spam Detection",
      description: "Detect and block spam messages",
      type: "messaging",
      severity: "medium",
      status: "active",
    },
    {
      id: "r3",
      name: "Rate Limiting",
      description: "Limit requests to prevent abuse",
      type: "api",
      severity: "medium",
      status: "active",
    },
  ]);

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  const handleUnbanUser = (id: string) => {
    setBannedUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User unbanned successfully");
  };

  const handleDeleteRule = (id: string) => {
    setSafetyRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Safety rule deleted");
  };

  const stats = [
    {
      label: "Banned Users",
      value: bannedUsers.length,
      icon: Ban,
      color: "red",
    },
    {
      label: "Active Rules",
      value: safetyRules.filter((r) => r.status === "active").length,
      icon: Shield,
      color: "green",
    },
    { label: "Reports (7d)", value: 24, icon: AlertTriangle, color: "orange" },
    { label: "Flagged Content", value: 8, icon: Eye, color: "yellow" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2
          className={cn(
            "text-3xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-900",
          )}
        >
          Safety & Security
        </h2>
        <p
          className={cn(
            "mt-1",
            theme === "dark" ? "text-slate-400" : "text-gray-600",
          )}
        >
          Manage user safety, bans, and safety rules
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorMap = {
            red: "text-red-500",
            green: "text-green-500",
            orange: "text-orange-500",
            yellow: "text-yellow-500",
          };
          return (
            <div
              key={stat.label}
              className={cn(
                "p-4 rounded-lg border",
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "text-xs font-medium mb-1",
                      theme === "dark" ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      theme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <Icon
                  className={cn(
                    "w-8 h-8",
                    colorMap[stat.color as keyof typeof colorMap],
                  )}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Banned Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-6 rounded-xl border",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <Ban size={24} />
          <h3
            className={cn(
              "text-xl font-semibold",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            Banned Users
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}
              >
                <th className="px-4 py-3 text-left font-semibold">Username</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Reason</th>
                <th className="px-4 py-3 text-left font-semibold">Duration</th>
                <th className="px-4 py-3 text-left font-semibold">Banned</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {bannedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={cn(
                    "border-t",
                    theme === "dark" ? "border-slate-700" : "border-gray-200",
                  )}
                >
                  <td className="px-4 py-3 font-medium">{user.username}</td>
                  <td className="px-4 py-3 text-xs">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-500">
                      {user.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{user.duration}</td>
                  <td className="px-4 py-3 text-xs">{user.bannedDate}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleUnbanUser(user.id)}
                      className="text-blue-500 hover:text-blue-600 font-medium text-xs"
                    >
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Safety Rules Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "p-6 rounded-xl border",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield size={24} />
            <h3
              className={cn(
                "text-xl font-semibold",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              Safety Rules
            </h3>
          </div>
          <button
            onClick={() => setShowNewRuleForm(!showNewRuleForm)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>

        {showNewRuleForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={cn(
              "p-4 rounded-lg border mb-4",
              theme === "dark"
                ? "bg-slate-700/50 border-slate-600"
                : "bg-gray-50 border-gray-200",
            )}
          >
            <div className="space-y-3">
              <input
                placeholder="Rule name"
                className={cn(
                  "w-full px-3 py-2 rounded border text-sm",
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-gray-300",
                )}
              />
              <textarea
                placeholder="Description"
                rows={2}
                className={cn(
                  "w-full px-3 py-2 rounded border text-sm",
                  theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-gray-300",
                )}
              />
              <div className="flex gap-3">
                <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 font-medium">
                  Create
                </button>
                <button
                  onClick={() => setShowNewRuleForm(false)}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium",
                    theme === "dark"
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-gray-200 hover:bg-gray-300",
                  )}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {safetyRules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "p-4 rounded-lg border flex items-start justify-between",
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600"
                  : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex-1">
                <h4
                  className={cn(
                    "font-semibold text-sm",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {rule.name}
                </h4>
                <p
                  className={cn(
                    "text-xs mt-1",
                    theme === "dark" ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  {rule.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                    {rule.type}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded",
                      rule.severity === "high"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-yellow-500/20 text-yellow-500",
                    )}
                  >
                    {rule.severity}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                    Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
