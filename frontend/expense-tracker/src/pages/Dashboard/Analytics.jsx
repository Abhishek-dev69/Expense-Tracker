import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  Activity,
  Calendar,
  IndianRupee,
  PieChart as PieIcon,
} from "lucide-react"

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f2937]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 mt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm font-semibold text-white">
              ₹{entry.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Analytics = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return null

  // 1️⃣ Monthly Data Logic
  const monthly = {}
  data.allTransactions?.forEach((t) => {
    const month = new Date(t.date).toLocaleString("en-US", { month: "short" })
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 }
    if (t.amount > 0) monthly[month].income += t.amount
    else monthly[month].expense += Math.abs(t.amount)
  })
  const barData = Object.values(monthly)

  // 2️⃣ Category Data Logic
  const categoryMap = {}
  data.allTransactions?.forEach((t) => {
    if (t.amount < 0) {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount)
    }
  })
  const pieData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 3️⃣ Daily Data Logic
  const dailyData = {}
  data.allTransactions?.forEach((t) => {
    if (t.amount < 0) {
      const day = new Date(t.date).toLocaleDateString("en-US", { weekday: "short" })
      dailyData[day] = (dailyData[day] || 0) + Math.abs(t.amount)
    }
  })
  const areaData = Object.entries(dailyData).map(([day, value]) => ({ day, value }))

  // 4️⃣ Insights Logic
  const savingsRate = data.totalIncome > 0 
    ? ((data.totalIncome - data.totalExpense) / data.totalIncome) * 100 
    : 0
  const topCategories = pieData.slice(0, 3)
  const avgDailySpend = data.totalExpense / (areaData.length || 1)

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time insights across your spending and income</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
          <Calendar className="text-indigo-400" size={18} />
          <span className="text-sm font-medium text-gray-300">Last 30 Days</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Net Balance", value: data.totalBalance, icon: Wallet, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Total Income", value: data.totalIncome, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Expenses", value: data.totalExpense, icon: TrendingDown, color: "text-rose-400", bg: "bg-rose-500/10" },
          { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((item, idx) => (
          <div key={idx} className="relative group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
            <div className={`absolute top-6 right-6 p-2 rounded-xl ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>
            <p className="text-gray-400 text-sm font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1 tabular-nums">
              {typeof item.value === "number" ? `₹${item.value.toLocaleString()}` : item.value}
            </h3>
            <div className="flex items-center gap-1 mt-4 text-xs font-medium text-emerald-400">
              <ArrowUpRight size={14} />
              <span>+2.4% from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Spending Trend */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Cash Flow Analysis</h3>
              <p className="text-sm text-gray-400">Monthly income vs expenditure trajectory</p>
            </div>
            <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Income
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Expense
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#4B5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#4B5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? `${val/1000}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expense" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={18} className="text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Top Spending</h3>
          </div>
          
          <div className="h-[220px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm text-gray-300 font-medium">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-white">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Intensity Plot */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white">Spending Intensity</h3>
            <p className="text-sm text-gray-400">Heat-map of daily expenditure patterns</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-medium">Daily Avg</p>
            <p className="text-xl font-bold text-white">₹{Math.round(avgDailySpend).toLocaleString()}</p>
          </div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

export default Analytics