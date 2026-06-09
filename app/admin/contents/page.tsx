"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { Archive, Trash2, Search, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface Content {
  id: string;
  title: string;
  creator: string;
  category: string;
  status: string;
  likes: number;
  comments: number;
}

const mockContents: Content[] = [
  {
    id: "con1",
    title: "Family Memories",
    creator: "John Doe",
    category: "memory",
    status: "published",
    likes: 24,
    comments: 5,
  },
  {
    id: "con2",
    title: "Life Story",
    creator: "Jane Smith",
    category: "story",
    status: "published",
    likes: 156,
    comments: 32,
  },
];

export default function ContentsPage() {
  const { theme } = useTheme();
  const [contents, setContents] = useState<Content[]>(mockContents);
  const [search, setSearch] = useState("");
  const filtered = contents.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );
  const total = contents.length;
  const flagged = 0;

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
          Digital Legacy
        </h2>
      </div>
      <motion.div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Content", value: total },
          { label: "Public", value: 2 },
          { label: "Flagged", value: flagged },
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={cn(
              "p-4 rounded-lg border",
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <div className="flex justify-between">
              <div>
                <h3
                  className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {c.title}
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  By {c.creator}
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="text-red-500" /> {c.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} className="text-blue-500" />{" "}
                  {c.comments}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setContents((contents) =>
                    contents.map((x) =>
                      x.id === c.id ? { ...x, status: "archived" } : x,
                    ),
                  );
                  toast.success("Archived");
                }}
                className="text-amber-500"
              >
                <Archive size={16} />
              </button>
              <button
                onClick={() => {
                  setContents((contents) => contents.filter((x) => x.id !== c.id));
                  toast.success("Deleted");
                }}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
