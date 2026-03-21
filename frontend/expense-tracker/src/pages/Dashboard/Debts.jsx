// src/pages/Dashboard/Debts.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Users, HandMetal, CheckCircle2, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const Debts = () => {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/splits/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDebts(res.data.debts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const handleSettle = async (txId, person) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${BASE_URL}/api/splits/settle/${txId}/${person}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSummary()
    } catch (err) {
      console.error(err)
    }
  }

  const totalOwedToMe = debts.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">
            Friends & <span className="text-emerald-400 font-outline-2">Debts</span>
          </h1>
          <p className="text-gray-400 font-medium">Track shared expenses and settle up with ease.</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-6 shadow-xl shadow-emerald-500/5">
           <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <HandMetal size={32} />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-1">Total Owed to You</p>
             <p className="text-3xl font-black text-white">₹{totalOwedToMe.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Who Owes Me Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <ArrowDownLeft className="text-emerald-400" />
             <h2 className="text-xl font-bold text-white tracking-tight">Who Owes Me</h2>
          </div>

          <div className="space-y-4">
            {debts.length === 0 ? (
              <div className="p-10 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                    <Users size={24} />
                 </div>
                 <p className="text-gray-400">All settled up! No one owes you anything.</p>
              </div>
            ) : (
              debts.map((debt, index) => (
                <div key={index} className="group p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/20">
                        {debt.person[0]}
                     </div>
                     <div>
                       <p className="text-white font-bold text-lg">{debt.person}</p>
                       <p className="text-xs text-gray-500 font-medium tracking-wide">For "{debt.title}"</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <p className="text-xl font-black text-emerald-400">₹{debt.amount.toLocaleString()}</p>
                    <button 
                      onClick={() => handleSettle(debt.transactionId, debt.person)}
                      className="px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      Settle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Informational Card */}
        <div className="hidden lg:block">
           <div className="sticky top-8 p-10 rounded-[3rem] bg-indigo-600 overflow-hidden shadow-2xl shadow-indigo-500/20 relative group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-xl">
                  <HandMetal size={32} />
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">Mini-Splitwise<br/>Simplified.</h3>
                <p className="text-indigo-100 font-medium opacity-80">
                  Splitting an expense shouldn't be a chore. Add your friends directly from the transactions list, and keep your balances clear here.
                </p>
                <div className="pt-4 flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                   <CheckCircle2 size={16} /> Automated Reconciliation
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Debts
