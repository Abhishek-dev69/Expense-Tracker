// src/pages/Dashboard/Debts.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Users, HandMetal, CheckCircle2, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const Debts = () => {
  const [debts, setDebts] = useState([])
  const [ious, setIous] = useState([])
  const [activeTab, setActiveTab] = useState("local") // "local" or "social"
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/splits/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDebts(res.data.debts)
      setIous(res.data.ious)
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

  const handleRespond = async (id, status) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(`${BASE_URL}/api/splits/respond-request/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSummary()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSettleSocial = async (id) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(`${BASE_URL}/api/splits/settle-social/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSummary()
    } catch (err) {
      console.error(err)
    }
  }

  const totalOwedToMe = debts.reduce((acc, curr) => acc + curr.amount, 0)
  const totalIOwe = ious.reduce((acc, curr) => acc + (curr.status !== "settled" ? curr.amount : 0), 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">
            Friends & <span className="text-emerald-400 font-outline-2">Debts</span>
          </h1>
          <p className="text-gray-400 font-medium">Track shared expenses and settle up with ease.</p>
        </div>

        <div className="flex gap-4">
          <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-6 shadow-xl shadow-emerald-500/5">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
               <HandMetal size={24} />
             </div>
             <div>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-1">Owed to You</p>
               <p className="text-2xl font-black text-white">₹{totalOwedToMe.toLocaleString()}</p>
             </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center gap-6 shadow-xl shadow-rose-500/5">
             <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center">
               <ArrowUpRight size={24} />
             </div>
             <div>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-400/60 mb-1">You Owe</p>
               <p className="text-2xl font-black text-white">₹{totalIOwe.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-4 p-1.5 rounded-3xl bg-white/5 border border-white/10 w-fit">
            <button 
              onClick={() => setActiveTab("local")}
              className={`px-6 py-3 rounded-2xl text-xs font-black tracking-widest transition-all ${activeTab === "local" ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              LOCALLY SPLIT
            </button>
            <button 
              onClick={() => setActiveTab("social")}
              className={`px-6 py-3 rounded-2xl text-xs font-black tracking-widest transition-all ${activeTab === "social" ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              SOCIAL REQUESTS
              {ious.filter(i => i.status === "pending").length > 0 && (
                <span className="ml-2 w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
              )}
            </button>
          </div>

          {activeTab === "local" ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <ArrowDownLeft className="text-emerald-400" />
                 <h2 className="text-xl font-bold text-white tracking-tight">Who Owes Me</h2>
              </div>

              <div className="space-y-4">
                {debts.length === 0 ? (
                  <div className="p-10 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                     <p className="text-gray-400">All settled up locally!</p>
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
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <ArrowUpRight className="text-indigo-400" />
                 <h2 className="text-xl font-bold text-white tracking-tight">Pending Approval / Payment</h2>
              </div>

              <div className="space-y-4">
                {ious.length === 0 ? (
                  <div className="p-10 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                     <p className="text-gray-400">No incoming social requests.</p>
                  </div>
                ) : (
                  ious.map((iou, index) => (
                    <div key={index} className="group p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-500 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-xl border border-indigo-500/20">
                            {iou.person[0].toUpperCase()}
                         </div>
                         <div>
                           <p className="text-white font-bold text-lg">{iou.person}</p>
                           <p className="text-xs text-gray-500 font-medium tracking-wide">Sent you a split for "{iou.title}"</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black text-rose-400 mr-4">₹{iou.amount.toLocaleString()}</p>
                        
                        {iou.status === "pending" && (
                          <div className="flex gap-2">
                             <button 
                               onClick={() => handleRespond(iou._id, "accepted")}
                               className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                               Accept
                             </button>
                             <button 
                               onClick={() => handleRespond(iou._id, "rejected")}
                               className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all"
                             >
                               Reject
                             </button>
                          </div>
                        )}

                        {iou.status === "accepted" && (
                          <button 
                            onClick={() => handleSettleSocial(iou._id)}
                            className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Mark Paid
                          </button>
                        )}

                        {iou.status === "settled" && (
                          <span className="px-4 py-2 rounded-xl bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                            Settled
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
           <div className="sticky top-8 p-10 rounded-[3rem] bg-indigo-600 overflow-hidden shadow-2xl shadow-indigo-500/20 relative group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-xl">
                  <HandMetal size={32} />
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">Industry Standard<br/>Collaboration.</h3>
                <p className="text-indigo-100 font-medium opacity-80">
                  Switch to <b>Social Requests</b> to send real-time split asks to other users. No more manual reminders.
                </p>
                <div className="pt-4 flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                   <CheckCircle2 size={16} /> Cross-User Sync
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Debts
