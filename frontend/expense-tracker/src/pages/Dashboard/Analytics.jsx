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
      <div className="bg-[#1f2937]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl space-y-2">
        {label && <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-2">{label}</p>}
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.payload?.fill }}
              />
              <p className="text-[11px] text-gray-400 font-medium capitalize">
                {entry.name}
              </p>
            </div>
            <p className="text-sm font-bold text-white ml-3.5 tracking-tight">
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

  // 1️⃣ MoM Calculation Logic
  const now = new Date()
  const currentMonthIdx = now.getMonth()
  const lastMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1
  
  const currentMonthData = { income: 0, expense: 0 }
  const lastMonthData = { income: 0, expense: 0 }

  data.allTransactions?.forEach((t) => {
    const tDate = new Date(t.date)
    const tMonth = tDate.getMonth()
    
    if (tMonth === currentMonthIdx) {
      if (t.amount > 0) currentMonthData.income += t.amount
      else currentMonthData.expense += Math.abs(t.amount)
    } else if (tMonth === lastMonthIdx) {
      if (t.amount > 0) lastMonthData.income += t.amount
      else lastMonthData.expense += Math.abs(t.amount)
    }
  })

  const getPercentChange = (current, last) => {
    if (last === 0) return current > 0 ? 100 : 0
    return ((current - last) / last) * 100
  }

  const incomeChange = getPercentChange(currentMonthData.income, lastMonthData.income)
  const expenseChange = getPercentChange(currentMonthData.expense, lastMonthData.expense)
  const balanceChange = getPercentChange(
    currentMonthData.income - currentMonthData.expense,
    lastMonthData.income - lastMonthData.expense
  )

  // 2️⃣ Monthly Data Logic (Sorting by month index for chart flow)
  const monthly = {}
  data.allTransactions?.forEach((t) => {
    const date = new Date(t.date)
    const month = date.toLocaleString("en-US", { month: "short" })
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    if (!monthly[monthKey]) monthly[monthKey] = { month, income: 0, expense: 0, sortKey: monthKey }
    if (t.amount > 0) monthly[monthKey].income += t.amount
    else monthly[monthKey].expense += Math.abs(t.amount)
  })
  const barData = Object.values(monthly).sort((a,b) => a.sortKey.localeCompare(b.sortKey)).slice(-6)

  // 3️⃣ Category Data Logic
  const categoryMap = {}
  data.allTransactions?.forEach((t) => {
    if (t.amount < 0) {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount)
    }
  })
  const pieData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 4️⃣ Daily Data Logic
  const dailyData = {}
  data.allTransactions?.forEach((t) => {
    if (t.amount < 0) {
      const day = new Date(t.date).toLocaleDateString("en-US", { weekday: "short" })
      dailyData[day] = (dailyData[day] || 0) + Math.abs(t.amount)
    }
  })
  const areaData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => ({
    day,
    value: dailyData[day] || 0
  }))

  const savingsRate = data.totalIncome > 0 
    ? ((data.totalIncome - data.totalExpense) / data.totalIncome) * 100 
    : 0
  const topCategories = pieData.slice(0, 3)
  const avgDailySpend = data.totalExpense / (areaData.filter(d => d.value > 0).length || 1)

  const metrics = [
    { 
      label: "Net Balance", 
      value: data.totalBalance, 
      icon: Wallet, 
      color: "text-indigo-400", 
      bg: "bg-indigo-500/10",
      change: balanceChange
    },
    { 
      label: "Total Income", 
      value: data.totalIncome, 
      icon: TrendingUp, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      change: incomeChange
    },
    { 
      label: "Total Expenses", 
      value: data.totalExpense, 
      icon: TrendingDown, 
      color: "text-rose-400", 
      bg: "bg-rose-500/10",
      change: expenseChange
    },
    { 
      label: "Savings Rate", 
      value: `${savingsRate.toFixed(1)}%`, 
      icon: Activity, 
      color: "text-amber-400", 
      bg: "bg-amber-500/10",
      change: null
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Financial Analytics</h1>
          <p className="text-gray-400 mt-1 font-medium">Actionable insights from your personalized wealth data</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
          <Calendar className="text-indigo-400" size={18} />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Overview</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, idx) => (
          <div key={idx} className="relative group p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-1 shadow-2xl">
            <div className={`absolute top-6 right-6 p-2.5 rounded-2xl ${item.bg} ${item.color} shadow-inner`}>
              <item.icon size={20} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
            <h3 className="text-2xl font-black text-white mt-2 tabular-nums tracking-tighter">
              {typeof item.value === "number" ? `₹${item.value.toLocaleString()}` : item.value}
            </h3>
            
            {item.change !== null && (
              <div className={`flex items-center gap-1.5 mt-5 text-[11px] font-bold ${item.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(item.change).toFixed(1)}% vs last month</span>
              </div>
            )}
            {item.change === null && (
              <div className="flex items-center gap-1.5 mt-5 text-[11px] font-bold text-indigo-400/60 italic">
                <Activity size={14} />
                <span>Steady performance</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Cash Flow Analysis</h3>
              <p className="text-sm text-gray-400 mt-1">Income vs expenditure trajectory</p>
            </div>
            <div className="flex gap-2 p-1.5 bg-[#0b1220]/50 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Income
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" /> Expense
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#4B5563" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  dy={15}
                />
                <YAxis 
                  stroke="#4B5563" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? `${val/1000}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} barSize={28} />
                <Bar dataKey="expense" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <PieIcon size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Top Spending</h3>
              <p className="text-xs text-gray-500">Major categories this month</p>
            </div>
          </div>
          
          <div className="h-[240px] mb-10 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={10}
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Spent</p>
              <p className="text-xl font-black text-white tracking-tighter">₹{data.totalExpense.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-white">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Spending Intensity</h3>
              <p className="text-sm text-gray-400 mt-1">Heat-map of daily expenditure patterns</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Daily Average</p>
            <p className="text-3xl font-black text-white tracking-tighter">₹{Math.round(avgDailySpend).toLocaleString()}</p>
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
              <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="day" stroke="#4B5563" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                strokeWidth={4}
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