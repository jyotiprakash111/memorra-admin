"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { Trash2, Search, AlertCircle, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  messageCount: number;
  reportedCount: number;
  status: "active" | "flagged" | "restricted";
  createdAt: string;
  type: "direct" | "group";
}

const mockConversations: Conversation[] = [
  {
    id: "c1",
    participants: ["John Doe", "Jane Smith"],
    lastMessage: "See you tomorrow!",
    messageCount: 142,
    reportedCount: 0,
    status: "active",
    createdAt: "2024-01-15",
    type: "direct",
  },
  {
    id: "c2",
    participants: ["Sarah Wilson", "Mike Johnson"],
    lastMessage: "Thanks for sharing",
    messageCount: 458,
    reportedCount: 2,
    status: "flagged",
    createdAt: "2024-01-20",
    type: "group",
  },
];

export default function MessagesPage() {
  const { theme } = useTheme();
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      p.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

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
          Message Moderation
        </h2>
      </div>
      <motion.div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Conversations",
            value: conversations.length,
            icon: MessageSquare,
          },
          { label: "Reported", value: 2, icon: AlertCircle },
          { label: "Flagged", value: 1, icon: Eye },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "p-6 rounded-xl border",
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <p
              className={cn(
                "text-sm mb-2",
                theme === "dark" ? "text-slate-400" : "text-gray-600",
              )}
            >
              {s.label}
            </p>
            <p
              className={cn(
                "text-3xl font-bold",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {s.value}
            </p>
          </div>
        ))}
      </motion.div>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg border",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <Search size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
      <div
        className={cn(
          "rounded-lg border overflow-hidden",
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200",
        )}
      >
        <table className="w-full">
          <thead>
            <tr className={theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}>
              <th className="px-6 py-4 text-left">Participants</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredConversations.map((c) => (
              <tr
                key={c.id}
                className={cn(
                  "border-t",
                  theme === "dark" ? "border-slate-700" : "border-gray-200",
                )}
              >
                <td className="px-6 py-4">{c.participants.join(", ")}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                    {c.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded",
                      c.status === "active"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-amber-500/20 text-amber-500",
                    )}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setConversations((conversations) => conversations.filter((x) => x.id !== c.id));
                      toast.success("Deleted");
                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
