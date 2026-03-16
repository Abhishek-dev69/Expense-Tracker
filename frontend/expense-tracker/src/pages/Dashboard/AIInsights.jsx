import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Rocket, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  ZapOff, 
  Tag,
  AlertCircle,
  Lightbulb,
  CheckCircle2
} from "lucide-react"

const AIInsights = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/insights`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        setData(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load AI insights.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [authToken])

  const getInsightStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          iconBg: "bg-rose-500/20",
          iconColor: "text-rose-400",
          textColor: "text-rose-100"
        }
      case "success":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          iconBg: "bg-emerald-500/20",
          iconColor: "text-emerald-400",
          textColor: "text-emerald-100"
        }
      case "tip":
        return {
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
          iconBg: "bg-indigo-500/20",
          iconColor: "text-indigo-400",
          textColor: "text-indigo-100"
        }
      default:
        return {
          bg: "bg-white/5",
          border: "border-white/10",
          iconBg: "bg-white/10",
          iconColor: "text-indigo-300",
          textColor: "text-gray-200"
        }
    }
  }

  const getIcon = (iconName) => {
    const icons = {
      TrendingDown: <TrendingDown size={20} />,
      Rocket: <Rocket size={20} />,
      ShieldCheck: <ShieldCheck size={20} />,
      BarChart3: <BarChart3 size={20} />,
      Zap: <Zap size={20} />,
      ZapOff: <ZapOff size={20} />,
      Tag: <Tag size={20} />,
    }
    return icons[iconName] || <Lightbulb size={20} />
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <BrainCircuit className="text-indigo-500 animate-pulse" size={48} />
      <p className="text-gray-400 animate-pulse font-medium">Consulting your financial data...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4 text-rose-400">
      <AlertCircle size={24} />
      <p>{error}</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Consultant Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 relative">
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
             <BrainCircuit className="text-indigo-400 relative z-10" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Financial Insights
              <Sparkles className="text-amber-400" size={20} />
            </h1>
            <p className="text-gray-400 mt-1">Intelligent analysis based on your real-time spending patterns</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Total Monthly Income</p>
          <p className="text-3xl font-bold text-white tabular-nums">₹{data.totalIncome?.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Total Monthly Expense</p>
          <p className="text-3xl font-bold text-rose-400 tabular-nums">₹{data.totalExpense?.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -mr-12 -mt-12" />
          <p className="text-xs text-indigo-300 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
            Savings Rate <CheckCircle2 size={14} />
          </p>
          <p className="text-3xl font-bold text-indigo-400 tabular-nums">{data.savingsRate}%</p>
        </div>
      </div>

      {/* Structured Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.insights?.length > 0 ? (
          data.insights.map((insight, index) => {
            const style = getInsightStyles(insight.type)
            return (
              <div
                key={index}
                className={`p-6 rounded-3xl ${style.bg} border ${style.border} flex items-start gap-5 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className={`p-4 ${style.iconBg} rounded-2xl ${style.iconColor} shrink-0`}>
                  {getIcon(insight.icon)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{insight.type}</p>
                  <p className={`text-[0.95rem] leading-relaxed font-medium ${style.textColor}`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-2 p-12 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="text-gray-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing your patterns...</h3>
            <p className="text-gray-400 max-w-sm">We need a few more transactions to provide accurate financial advice. Keep tracking your spending!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default AIInsights