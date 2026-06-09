"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { Edit2, Trash2, Plus, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface FuneralPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  purchaseCount: number;
  rating: number;
  status: "active" | "inactive";
}

const mockPlans: FuneralPlan[] = [
  {
    id: "1",
    name: "Basic Plan",
    description: "Essential funeral planning package",
    price: 199.99,
    features: [
      "Digital legacy storage",
      "Family notifications",
      "Basic planning tools",
    ],
    purchaseCount: 234,
    rating: 4.5,
    status: "active",
  },
  {
    id: "2",
    name: "Standard Plan",
    description: "Comprehensive funeral planning and memorial services",
    price: 399.99,
    features: [
      "Digital legacy storage",
      "Family notifications",
      "Advanced planning tools",
      "Video messages",
      "Memorial website",
    ],
    purchaseCount: 567,
    rating: 4.8,
    status: "active",
  },
  {
    id: "3",
    name: "Premium Plan",
    description: "Complete end-of-life management solution",
    price: 799.99,
    features: [
      "All Standard features",
      "24/7 support",
      "Estate planning assistance",
      "Legal document storage",
      "Custom memorial video",
      "Professional consultation",
    ],
    purchaseCount: 456,
    rating: 4.9,
    status: "active",
  },
  {
    id: "4",
    name: "VIP Plan",
    description: "Luxury end-of-life management with concierge service",
    price: 1299.99,
    features: [
      "All Premium features",
      "Dedicated concierge",
      "Priority support",
      "Custom branding",
      "Exclusive memorial options",
      "Lifetime access",
    ],
    purchaseCount: 89,
    rating: 4.9,
    status: "active",
  },
  {
    id: "5",
    name: "Legacy Plan",
    description: "Family heritage preservation package",
    price: 599.99,
    features: [
      "Multi-generational storage",
      "Family tree creation",
      "Story archiving",
      "Photo preservation",
      "Heritage sharing",
    ],
    purchaseCount: 178,
    rating: 4.7,
    status: "active",
  },
];

export default function FuneralPlansPage() {
  const { theme } = useTheme();
  const [plans, setPlans] = useState<FuneralPlan[]>(mockPlans);

  const handleDelete = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
    toast.success("Plan deleted successfully");
  };

  const handleEdit = (id: string) => {
    toast.success(`Edit plan ${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2
            className={cn(
              "text-3xl font-bold",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            Funeral Plans
          </h2>
          <p
            className={cn(
              "text-sm mt-1",
              theme === "dark" ? "text-slate-400" : "text-gray-600",
            )}
          >
            Manage funeral and memorial planning packages
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.success("Add new plan")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add Plan
        </motion.button>
      </div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "rounded-lg border transition-all hover:shadow-lg",
              theme === "dark"
                ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                : "bg-white border-gray-200 hover:border-gray-300",
            )}
          >
            {/* Plan Header */}
            <div className="p-6 border-b border-opacity-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className={cn(
                      "text-xl font-bold mb-1",
                      theme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      theme === "dark" ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {plan.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-sm font-bold px-3 py-1 rounded-full",
                    plan.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700",
                  )}
                >
                  {plan.status === "active" ? "✓ Active" : "Inactive"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-2">
                <p
                  className={cn(
                    "text-xs font-medium mb-1",
                    theme === "dark" ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Price
                </p>
                <p className="text-3xl font-bold text-green-500">
                  ${plan.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 border-b border-opacity-10">
              <h4
                className={cn(
                  "text-sm font-bold mb-3",
                  theme === "dark" ? "text-slate-300" : "text-gray-700",
                )}
              >
                Features:
              </h4>
              <ul className="space-y-2">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-sm">
                    <Check
                      size={14}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                    />
                    <span
                      className={
                        theme === "dark" ? "text-slate-300" : "text-gray-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats and Actions */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p
                    className={cn(
                      "text-xs font-medium mb-1",
                      theme === "dark" ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    Purchases
                  </p>
                  <p className="text-lg font-bold text-blue-500">
                    {plan.purchaseCount}
                  </p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-medium mb-1",
                      theme === "dark" ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    Rating
                  </p>
                  <p className="text-lg font-bold text-yellow-500">
                    ⭐ {plan.rating}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(plan.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Total Plans
          </p>
          <p className="text-2xl font-bold text-green-500">{plans.length}</p>
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
            Total Purchases
          </p>
          <p className="text-2xl font-bold text-blue-500">
            {plans.reduce((sum, p) => sum + p.purchaseCount, 0)}
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
            Revenue
          </p>
          <p className="text-2xl font-bold text-purple-500">
            $
            {plans
              .reduce((sum, p) => sum + p.price * p.purchaseCount, 0)
              .toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
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
            Avg Rating
          </p>
          <p className="text-2xl font-bold text-yellow-500">
            ⭐{" "}
            {(
              plans.reduce((sum, p) => sum + p.rating, 0) / plans.length
            ).toFixed(2)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
