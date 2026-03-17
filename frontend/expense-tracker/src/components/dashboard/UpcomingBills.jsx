// src/components/dashboard/UpcomingBills.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { AlertCircle, Calendar, ArrowRight, Bell } from "lucide-react"

const UpcomingBills = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${BASE_URL}/api/recurring`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Filter for bills due in the next 7 days
        const now = new Date()
        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(now.getDate() + 7)

        const upcoming = res.data.filter(bill => {
          const due = new Date(bill.nextOccurrence)
          return due >= now && due <= sevenDaysLater && bill.status === "active"
        })

        setBills(upcoming.sort((a, b) => new Date(a.nextOccurrence) - new Date(b.nextOccurrence)))
      } catch (err) {
        console.error("Error fetching upcoming bills:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [])

  if (loading || bills.length === 0) return null

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
      <div className="bg-gradient-to-r from-rose-500/10 to-indigo-500/10 backdrop-blur-xl border border-rose-500/20 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Bell size={24} fill="currentColor" className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Upcoming Bills <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{bills.length}</span>
              </h3>
              <p className="text-sm text-gray-400 font-medium">You have important payments due in the next 7 days.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {bills.slice(0, 3).map((bill, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-4 pr-5 hover:bg-white/10 transition-colors group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{new Date(bill.nextOccurrence).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-sm font-black text-white leading-none mt-0.5">{new Date(bill.nextOccurrence).getDate()}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-tight leading-none mb-1">{bill.title}</p>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">₹{bill.amount.toLocaleString()}</p>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcomingBills
