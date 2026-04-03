import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Banknote, ArrowRight, CheckCircle2, X } from "lucide-react"

const SalarySetupBanner = () => {
  const [hasSalary, setHasSalary] = useState(true)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [setupStep, setSetupStep] = useState("idle")

  useEffect(() => {
    const checkSalary = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${BASE_URL}/api/recurring`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const salaryItem = res.data.find(
          (item) =>
            item.category.toLowerCase() === "salary" || item.title.toLowerCase().includes("salary")
        )

        setHasSalary(!!salaryItem)
      } catch (err) {
        console.error("Error checking salary:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSalary()
  }, [])

  const handleQuickSetup = async (event) => {
    event.preventDefault()
    const amount = event.target.amount.value
    if (!amount) return

    try {
      setSetupStep("loading")
      const token = localStorage.getItem("token")
      await axios.post(
        `${BASE_URL}/api/recurring`,
        {
          title: "Monthly Salary",
          amount: parseFloat(amount),
          category: "Salary",
          type: "income",
          frequency: "monthly",
          startDate: new Date().toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setSetupStep("success")
      setTimeout(() => setDismissed(true), 3000)
    } catch (err) {
      console.error("Salary setup error:", err)
      setSetupStep("idle")
    }
  }

  if (loading || hasSalary || dismissed) return null

  return (
    <section className="glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="absolute left-[-3rem] top-[-2rem] h-40 w-40 rounded-full bg-emerald-400/10 blur-[90px]" />

      <button
        onClick={() => setDismissed(true)}
        className="premium-chip absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl text-slate-300"
        aria-label="Dismiss salary setup"
      >
        <X size={16} />
      </button>

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-emerald-400/14 text-emerald-200">
            <Banknote size={30} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
              Automation shortcut
            </p>
            <h3 className="mt-2 font-['Outfit'] text-2xl font-semibold text-white">
              Add your salary once, automate it every month
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              This removes repetitive entries and makes your monthly reporting and savings trends more accurate.
            </p>
          </div>
        </div>

        {setupStep === "idle" ? (
          <form onSubmit={handleQuickSetup} className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                name="amount"
                required
                type="number"
                placeholder="Monthly salary"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3 pl-8 pr-4 text-white placeholder:text-slate-500 focus:border-emerald-300/40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="premium-button flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Automate Now
              <ArrowRight size={16} />
            </button>
          </form>
        ) : setupStep === "success" ? (
          <div className="rounded-[1.5rem] border border-emerald-400/18 bg-emerald-400/10 px-5 py-4 text-emerald-100">
            <div className="flex items-center gap-3 font-semibold">
              <CheckCircle2 size={20} />
              Automation active
            </div>
            <p className="mt-2 text-sm text-emerald-100/80">
              Your recurring salary entry has been created successfully.
            </p>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-slate-300">
            Processing your salary automation...
          </div>
        )}
      </div>
    </section>
  )
}

export default SalarySetupBanner
