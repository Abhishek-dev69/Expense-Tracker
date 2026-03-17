import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { 
  Medal, 
  Flame, 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Star,
  Zap,
  Award,
  ShieldCheck
} from "lucide-react"

const Achievements = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/gamification/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const allBadges = [
    { name: "First Step", description: "Log your first transaction", icon: <Star />, color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Transaction Pro", description: "Log 50 transactions", icon: <Zap />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Goal Crusher", description: "Complete your first savings goal", icon: <Award />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Weekly Warrior", description: "Maintain a 7-day login streak", icon: <Flame />, color: "text-rose-400", bg: "bg-rose-400/10" },
    { name: "Budget Master", description: "Stay under budget for 3 months", icon: <ShieldCheck />, color: "text-blue-400", bg: "bg-blue-400/10" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Medal className="text-amber-500" />
            Hall of Fame
          </h1>
          <p className="text-gray-400 mt-2 text-lg font-medium">
            Unlock achievements and build your financial legacy.
          </p>
        </div>

        {data && (
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl">
             <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 animate-pulse">
                <Flame size={24} fill="currentColor" />
             </div>
             <div>
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Active Streak</p>
                <p className="text-2xl font-black text-white leading-none">{data.streakCount} Days</p>
             </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
            <div className="col-span-full h-64 flex items-center justify-center text-gray-500 italic">
                Polishing your medals...
            </div>
        ) : (
          allBadges.map(badge => {
            const isUnlocked = data?.badges?.includes(badge.name)
            return (
              <div 
                key={badge.name}
                className={`relative group p-10 rounded-[3rem] border-2 transition-all duration-500 overflow-hidden ${isUnlocked ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/[0.02] border-white/5 opacity-60 grayscale'}`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-6 right-6 ${isUnlocked ? 'text-emerald-400' : 'text-gray-600'}`}>
                   {isUnlocked ? <CheckCircle2 size={24} /> : <Lock size={24} />}
                </div>

                {/* Badge Icon */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-2xl ${badge.color} ${badge.bg} ${isUnlocked && 'shadow-current/20'}`}>
                  {badge.icon}
                </div>

                <div className="relative">
                  <h3 className={`text-2xl font-black transition-colors ${isUnlocked ? 'text-white group-hover:text-amber-400' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-gray-400 mt-2 font-medium leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                {isUnlocked && (
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Stats Summary */}
      {!loading && (
        <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-emerald-500/20 border border-white/10 flex flex-col items-center text-center gap-6">
           <Trophy size={64} className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
           <div>
              <h2 className="text-3xl font-black text-white">Your Progress</h2>
              <p className="text-gray-400 mt-2 text-lg">You have unlocked {data?.badges?.length || 0} out of {allBadges.length} legendary achievements.</p>
           </div>
           
           <div className="h-4 w-full max-w-xl bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((data?.badges?.length || 0) / allBadges.length) * 100}%` }}
              />
           </div>
        </div>
      )}
    </div>
  )
}

export default Achievements
