"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { Edit2, Trash2, Plus, Search, Filter, Grid, List, ChevronDown, Eye, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  status: "active" | "inactive";
  description?: string;
  image?: string;
  sales?: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Memorial Book",
    category: "Memorial",
    price: 29.99,
    stock: 45,
    rating: 4.8,
    status: "active",
    description: "Premium physical memorial book",
    sales: 342,
  },
  {
    id: "2",
    name: "Digital Legacy Plan",
    category: "Plans",
    price: 99.99,
    stock: 120,
    rating: 4.9,
    status: "active",
    description: "Complete digital legacy management",
    sales: 567,
  },
  {
    id: "3",
    name: "Memory Video Kit",
    category: "Video",
    price: 199.99,
    stock: 12,
    rating: 4.7,
    status: "active",
    description: "Professional video editing suite",
    sales: 198,
  },
  {
    id: "4",
    name: "Family Sharing Package",
    category: "Sharing",
    price: 49.99,
    stock: 0,
    rating: 4.6,
    status: "inactive",
    description: "Multi-user family access",
    sales: 234,
  },
  {
    id: "5",
    name: "Premium Funeral Planning",
    category: "Planning",
    price: 299.99,
    stock: 8,
    rating: 4.9,
    status: "active",
    description: "Complete funeral planning service",
    sales: 89,
  },
];

const CATEGORIES = ["All", "Memorial", "Plans", "Video", "Sharing", "Planning"];

export default function ProductsPage() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "rating">("name");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "stock":
        return b.stock - a.stock;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const getTotalValue = () => products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const getTotalRevenue = () => products.reduce((sum, p) => sum + (p.price * (p.sales || 0)), 0);
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-500", textColor: "text-red-600" };
    if (stock < 20) return { label: "Low Stock", color: "bg-yellow-500", textColor: "text-yellow-600" };
    return { label: "In Stock", color: "bg-green-500", textColor: "text-green-600" };
  };

  const stats = [
    { label: "Total Products", value: products.length, icon: "📦", color: "from-blue-500 to-blue-600" },
    { label: "In Stock", value: products.filter((p) => p.stock > 0).length, icon: "✓", color: "from-green-500 to-green-600" },
    { label: "Total Value", value: `$${getTotalValue().toLocaleString()}`, icon: "💰", color: "from-purple-500 to-purple-600" },
    { label: "Total Revenue", value: `$${getTotalRevenue().toLocaleString()}`, icon: "📈", color: "from-yellow-500 to-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Products Management</h1>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Create, edit, and manage your product catalog</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          New Product
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn("p-6 rounded-lg border transition-all hover:shadow-lg", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={cn("text-xs font-semibold mb-2 uppercase tracking-wide", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{stat.label}</p>
                <p className="text-2xl font-bold bg-linear-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${stat.color.split(" ")[1]}, ${stat.color.split(" ")[3]})` }}>
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("p-4 rounded-lg border space-y-4", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", theme === "dark" ? "text-slate-400" : "text-gray-400")} size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border transition-colors",
                theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
              )}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === cat ? "bg-green-500 text-white" : theme === "dark" ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
              )}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900",
              )}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 border rounded-lg p-1" style={{ borderColor: theme === "dark" ? "#475569" : "#e5e7eb" }}>
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded transition-colors", viewMode === "grid" ? "bg-green-500 text-white" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded transition-colors", viewMode === "list" ? "bg-green-500 text-white" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>
          Showing {sortedProducts.length} of {products.length} products
        </p>
      </motion.div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, idx) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-6 rounded-lg border transition-all hover:shadow-lg hover:border-green-500/50 group",
                    theme === "dark" ? "bg-linear-to-br from-slate-800 to-slate-800/50 border-slate-700" : "bg-linear-to-br from-white to-gray-50 border-gray-200",
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>{product.name}</h3>
                      <p className={cn("text-xs mt-1", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{product.description}</p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        product.status === "active"
                          ? theme === "dark"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-100 text-green-700"
                          : theme === "dark"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-red-100 text-red-700",
                      )}
                    >
                      {product.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Category & Stock Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", theme === "dark" ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700")}>{product.category}</span>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", stockStatus.color + "/20 " + stockStatus.textColor)}>
                      {stockStatus.label}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className={cn("text-xs font-medium", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Stock</p>
                      <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{product.stock} units</p>
                    </div>
                    <div className={cn("h-2 rounded-full overflow-hidden", theme === "dark" ? "bg-slate-700" : "bg-gray-200")}>
                      <motion.div className="h-full bg-linear-to-r from-green-500 to-emerald-600" style={{ width: `${Math.min((product.stock / 150) * 100, 100)}%` }} initial={{ width: 0 }} animate={{ width: `${Math.min((product.stock / 150) * 100, 100)}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(243, 244, 246, 1)" }}>
                    <div className="text-center">
                      <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Price</p>
                      <p className="text-sm font-bold text-green-500">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-center border-l border-r" style={{ borderColor: theme === "dark" ? "#334155" : "#e5e7eb" }}>
                      <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Rating</p>
                      <p className="text-sm font-bold">⭐ {product.rating}</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Sales</p>
                      <p className="text-sm font-bold text-blue-500">{product.sales || 0}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t" style={{ borderColor: theme === "dark" ? "#334155" : "#e5e7eb" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(product)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors",
                        theme === "dark" ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-100 text-blue-600 hover:bg-blue-200",
                      )}
                    >
                      <Edit2 size={14} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors",
                        theme === "dark" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-100 text-red-600 hover:bg-red-200",
                      )}
                    >
                      <Trash2 size={14} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("col-span-full p-12 rounded-lg border text-center", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
              <AlertCircle size={48} className={cn("mx-auto mb-4", theme === "dark" ? "text-slate-500" : "text-gray-400")} />
              <p className={cn("text-lg font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>No products found</p>
              <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Try adjusting your filters or search terms</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "list" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-lg border overflow-hidden", theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
          {sortedProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}>
                  <tr>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Name</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Category</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Price</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Stock</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Rating</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Status</th>
                    <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product, idx) => (
                    <tr key={product.id} className={cn("border-t transition-colors hover:bg-opacity-50", idx % 2 === 0 ? (theme === "dark" ? "bg-slate-800/50" : "bg-gray-50") : "", theme === "dark" ? "border-slate-700 hover:bg-slate-700/50" : "border-gray-200 hover:bg-gray-100")}>
                      <td className="px-6 py-4">
                        <div>
                          <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>{product.name}</p>
                          <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-gray-600")}>{product.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", theme === "dark" ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700")}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-500">${product.price.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={cn("font-semibold", product.stock === 0 ? "text-red-500" : "text-blue-500")}>{product.stock}</p>
                          <div className={cn("h-1 rounded w-16 mt-1", theme === "dark" ? "bg-slate-700" : "bg-gray-200")}>
                            <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min((product.stock / 150) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">⭐ {product.rating}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full font-semibold",
                            product.status === "active"
                              ? theme === "dark"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-green-100 text-green-700"
                              : theme === "dark"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-red-100 text-red-700",
                          )}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)} className="p-1 hover:bg-opacity-80 transition-colors">
                            <Edit2 size={16} className="text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1 hover:bg-opacity-80 transition-colors">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle size={48} className={cn("mx-auto mb-4", theme === "dark" ? "text-slate-500" : "text-gray-400")} />
              <p className={cn("text-lg font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>No products found</p>
              <p className={cn("text-sm", theme === "dark" ? "text-slate-400" : "text-gray-600")}>Try adjusting your filters or search terms</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Edit Product Modal */}
      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className={cn("max-w-2xl w-full rounded-lg p-6 max-h-[90vh] overflow-y-auto", theme === "dark" ? "bg-slate-800" : "bg-white")}>
            <h2 className={cn("text-2xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>{selectedProduct ? "Edit Product" : "Create New Product"}</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Product Name" defaultValue={selectedProduct?.name} className={cn("px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")} />
                <select defaultValue={selectedProduct?.category} className={cn("px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")}>
                  {CATEGORIES.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <textarea placeholder="Description" defaultValue={selectedProduct?.description} rows={3} className={cn("w-full px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")} />

              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Price" defaultValue={selectedProduct?.price} className={cn("px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")} />
                <input type="number" placeholder="Stock" defaultValue={selectedProduct?.stock} className={cn("px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")} />
                <input type="number" placeholder="Rating" defaultValue={selectedProduct?.rating} className={cn("px-4 py-2 rounded-lg border", theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300")} />
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className={cn("flex-1 px-4 py-2 rounded-lg font-medium transition-colors", theme === "dark" ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300")}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success(selectedProduct ? "Product updated!" : "Product created!");
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  {selectedProduct ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
