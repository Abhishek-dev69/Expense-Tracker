import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { BellRing, ArrowRight } from "lucide-react"

const UpcomingBills = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${BASE_URL}/api/recurring`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const now = new Date()
        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(now.getDate() + 7)

        const upcoming = res.data.filter((bill) => {
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
    <section className="glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-6">
      <div className="absolute right-[-2rem] top-[-1rem] h-32 w-32 rounded-full bg-rose-400/10 blur-[80px]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-rose-400/14 text-rose-200 shadow-[0_18px_40px_rgba(244,63,94,0.16)]">
            <BellRing size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-['Outfit'] text-2xl font-semibold text-white">Upcoming Bills</h3>
              <span className="rounded-full bg-rose-400/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-rose-200">
                {bills.length} due soon
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Important recurring payments arriving in the next 7 days.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {bills.slice(0, 3).map((bill) => {
            const nextDate = new Date(bill.nextOccurrence)

            return (
              <div
                key={bill._id || `${bill.title}-${bill.nextOccurrence}`}
                className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.05] p-4 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-slate-950/30 px-3 py-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {nextDate.toLocaleString("default", { month: "short" })}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{nextDate.getDate()}</p>
                  </div>
                  <ArrowRight size={16} className="mt-1 text-slate-600 transition-colors group-hover:text-emerald-200" />
                </div>
                <p className="mt-4 font-semibold text-white">{bill.title}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-semibold text-rose-200">₹{bill.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default UpcomingBills
