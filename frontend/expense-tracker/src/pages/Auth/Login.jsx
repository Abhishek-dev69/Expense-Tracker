// src/pages/Auth/Login.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AUTH_API } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import { Mail, Lock, LogIn, Sparkles } from "lucide-react"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(AUTH_API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")

      login(data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b1220] text-white overflow-hidden p-6">
      
      {/* 🔥 Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-700">
        
        {/* Logo/Brand Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group transition-all duration-500 overflow-hidden">
            <img src="/logo.png" alt="FinTrack AI" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            FinTrack <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-gray-400 font-medium italic">Intelligent Wealth Management</p>
        </div>

        {/* glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              Sign in to access your financial personalized dashboard and AI insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-4 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-indigo-600 p-[1px] rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <div className="bg-[#0b1220] group-hover:bg-transparent px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
                <span className="text-white font-bold tracking-tight">
                  {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
                </span>
                {!loading && <LogIn size={18} className="text-emerald-400 group-hover:text-white transition-colors" />}
              </div>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              New to the platform?{" "}
              <Link 
                to="/signup" 
                className="text-white hover:text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50 transition-all"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
