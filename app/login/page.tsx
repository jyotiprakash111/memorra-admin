"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Mail, Lock, AlertCircle } from "lucide-react"

/**
 * Secure Login Page
 * - CSRF protection
 * - Rate limiting (server-side)
 * - Input validation
 * - Secure error handling
 */
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  // Fetch CSRF token on page load
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("/api/auth/csrf")
        if (response.ok) {
          const data = await response.json()
          setCsrfToken(data.csrfToken)
        } else {
          setError("Failed to initialize security token. Please refresh the page.")
        }
      } catch (error) {
        console.error("[Login] CSRF token fetch error:", error)
        setError("Failed to initialize security token. Please refresh the page.")
      }
    }

    fetchCSRFToken()
  }, [])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Check if CSRF token is available
    if (!csrfToken) {
      setError("Security token not initialized. Please refresh the page.")
      return
    }

    // Client-side validation
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    if (password.length < 8) {
      setError("Invalid credentials")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // Include cookies (httpOnly tokens)
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password, csrfToken }),
      })

      if (!response.ok) {
        const data = await response.json()

        if (response.status === 429) {
          setError("Too many login attempts. Please try again later.")
        } else if (response.status === 401) {
          setError("Invalid email or password")
        } else {
          setError(data.message || "Login failed")
        }
        return
      }

      // Login successful
      toast.success("Login successful!")

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error) {
      console.error("[Login] Error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Memorra Admin</h1>
          <p className="text-slate-400">Secure Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@memorra.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-colors"
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-colors"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !csrfToken}
              className="w-full relative py-3 px-4 bg-linear-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : !csrfToken ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initializing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Help Text */}
            <div className="text-center text-sm text-slate-400">
              <a href="/forgot-password" className="hover:text-slate-300 transition-colors">
                Forgot password?
              </a>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
            <p className="text-xs text-slate-400 text-center">
              🔒 This is a secure admin portal. Sensitive information is encrypted and stored securely.
            </p>
          </div>

          {/* Demo Credentials Notice (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-xs text-yellow-200 font-semibold mb-3">📝 Demo Credentials (Development)</p>
              <div className="space-y-2 text-xs text-yellow-200/80">
                <div className="bg-slate-900/50 p-2 rounded border border-yellow-500/20">
                  <p><strong>Super Admin:</strong></p>
                  <p className="text-yellow-100 font-mono ml-2">admin@memorra.local</p>
                  <p className="text-yellow-100 font-mono ml-2">SecurePassword123!@#</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-yellow-500/20">
                  <p><strong>Finance:</strong></p>
                  <p className="text-yellow-100 font-mono ml-2">finance@memorra.local</p>
                  <p className="text-yellow-100 font-mono ml-2">FinancePass123!@#</p>
                </div>
                <p className="text-yellow-200/60 mt-2 text-xs">
                  🔧 CSRF Token: {csrfToken ? "✅ Loaded" : "⏳ Loading..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Memorra © 2026 | Secure Admin Panel</p>
        </div>
      </div>
    </div>
  )
}
