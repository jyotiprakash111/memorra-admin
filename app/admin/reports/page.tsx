"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  AlertTriangle,
  Trash2,
  Search,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface Report {
  id: string;
  reportedUser: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  createdAt: string;
}

const mockReports: Report[] = [
  {
    id: "r1",
    reportedUser: "User123",
    type: "spam",
    severity: "low",
    status: "resolved",
    description: "Spam messages",
    createdAt: "2024-02-20",
  },
  {
    id: "r2",
    reportedUser: "User456",
    type: "harassment",
    severity: "high",
    status: "open",
    description: "Harassment",
    createdAt: "2024-02-22",
  },
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [search, setSearch] = useState("");
  const filtered = reports.filter((r) =>
    r.reportedUser.toLowerCase().includes(search.toLowerCase()),
  );
  const open = reports.filter((r) => r.status === "open").length;
  const critical = 1;

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
          Safety & Reports
        </h2>
      </div>
      {critical > 0 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <p className="text-sm text-red-500">
            {critical} critical report(s) need attention
          </p>
        </div>
      )}
      <motion.div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: reports.length },
          { label: "Open", value: open },
          { label: "Critical", value: critical },
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
        {filtered.map((r) => (
          <div
            key={r.id}
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
                  vs {r.reportedUser}
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  {r.description}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    r.severity === "high"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-amber-500/20 text-amber-500",
                  )}
                >
                  {r.severity}
                </span>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    r.status === "open"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-green-500/20 text-green-500",
                  )}
                >
                  {r.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {r.status === "open" && (
                <>
                  <button
                    onClick={() => {
                      setReports((reports) =>
                        reports.map((x) =>
                          x.id === r.id ? { ...x, status: "resolved" } : x,
                        ),
                      );
                      toast.success("Resolved");
                    }}
                    className="text-green-500"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setReports((reports) =>
                        reports.map((x) =>
                          x.id === r.id ? { ...x, status: "escalated" } : x,
                        ),
                      );
                      toast.success("Escalated");
                    }}
                    className="text-purple-500"
                  >
                    <AlertTriangle size={16} />
                  </button>
                </>
              )}
              {r.status !== "open" && (
                <button
                  onClick={() => {
                    setReports((reports) => reports.filter((x) => x.id !== r.id));
                    toast.success("Archived");
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
