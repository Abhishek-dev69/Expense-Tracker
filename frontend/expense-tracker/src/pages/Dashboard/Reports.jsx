import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import { 
  FileText, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  History,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"

const Reports = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/api/reports/monthly`, {
        params: { month: selectedMonth, year: selectedYear },
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setReport(res.data)
      setError(null)
    } catch (err) {
      console.error("Report fetch error:", err)
      setError("Failed to fetch report data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear, authToken])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const exportToCSV = () => {
    if (!report || !report.transactions.length) return

    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = report.transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Expense_Report_${selectedYear}_${selectedMonth}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getComparison = (current, previous) => {
    if (!previous || previous === 0) return null
    const diff = ((current - previous) / previous) * 100
    return {
      value: Math.abs(diff).toFixed(1),
      isIncrease: diff > 0,
    }
  }

  if (loading && !report) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <FileText className="text-indigo-500 animate-pulse" size={48} />
      <p className="text-gray-400 animate-pulse font-medium">Generating your report...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-rose-400">
      <p>{error}</p>
      <button onClick={fetchReport} className="mt-4 text-sm font-bold underline">Try Again</button>
    </div>
  )

  const incomeComp = getComparison(report?.income, report?.previousMonth?.income)
  const expenseComp = getComparison(report?.expense, report?.previousMonth?.expense)

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="text-indigo-400" size={32} />
            Financial Reports
          </h1>
          <p className="text-gray-400 mt-1">Detailed breakdown of your financial activity</p>
        </div>

        <div className="flex items-center gap-4 bg-[#111827] p-2 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 px-3">
            <Calendar size={18} className="text-gray-500" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-sm py-1"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1} className="bg-[#111827]">
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer px-3 text-sm py-1"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year} className="bg-[#111827]">{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Summary Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20" />
             
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <History size={18} className="text-indigo-400" />
               Month Summary
             </h3>

             <div className="space-y-8">
               <div className="relative z-10">
                 <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total Income</p>
                 <div className="flex items-end gap-3">
                   <p className="text-3xl font-bold text-white tabular-nums">₹{report?.income.toLocaleString()}</p>
                   {incomeComp && (
                     <span className={`text-xs font-bold flex items-center mb-1.5 ${incomeComp.isIncrease ? 'text-emerald-400' : 'text-rose-400'}`}>
                       {incomeComp.isIncrease ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                       {incomeComp.value}%
                     </span>
                   )}
                 </div>
               </div>

               <div className="relative z-10">
                 <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total Expenses</p>
                 <div className="flex items-end gap-3">
                   <p className="text-3xl font-bold text-white tabular-nums">₹{report?.expense.toLocaleString()}</p>
                   {expenseComp && (
                     <span className={`text-xs font-bold flex items-center mb-1.5 ${expenseComp.isIncrease ? 'text-rose-400' : 'text-emerald-400'}`}>
                       {expenseComp.isIncrease ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                       {expenseComp.value}%
                     </span>
                   )}
                 </div>
               </div>

               <div className={`p-6 rounded-3xl border transition-all ${report?.balance >= 0 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                 <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Net Flow</p>
                 <p className={`text-2xl font-bold tabular-nums ${report?.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   ₹{report?.balance.toLocaleString()}
                 </p>
               </div>
             </div>
          </div>

          <button 
            onClick={exportToCSV}
            className="w-full p-6 rounded-[2rem] bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95"
          >
            <Download size={20} />
            Export Monthly Report
          </button>
        </div>

        {/* Right: Detailed Breakdown & Transactions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Category Breakdown */}
          <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
              <PieChart size={18} className="text-indigo-400" />
              Categorized Spending
            </h3>

            {report?.breakdown.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.breakdown.map((item, idx) => (
                  <div key={idx} className="group p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-center text-indigo-400 font-bold">
                        {item.category[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.category}</p>
                        <p className="text-xs text-gray-500">{((item.amount / report.expense) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white tabular-nums">₹{item.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12">
                <Minus className="text-gray-500 mb-4" size={32} />
                <p className="text-gray-400">No expenses recorded</p>
              </div>
            )}
          </div>

          {/* Transaction List */}
          <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-indigo-400" />
                Monthly Transactions
              </div>
              <span className="text-xs text-gray-500 font-normal">{report?.transactions.length} records found</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Type</th>
                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                    <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {report?.transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-sm text-gray-300 font-medium">
                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] uppercase font-black ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-400">{t.category}</td>
                      <td className={`py-4 text-sm font-bold text-right tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports