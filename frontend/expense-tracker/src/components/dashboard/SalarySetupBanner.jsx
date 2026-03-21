// src/components/dashboard/SalarySetupBanner.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Banknote, ArrowRight, CheckCircle2, X } from "lucide-react"

const SalarySetupBanner = () => {
  const [hasSalary, setHasSalary] = useState(true) // Default true to prevent flicker
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [setupStep, setSetupStep] = useState('idle') // idle, naming, success

  useEffect(() => {
    const checkSalary = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${BASE_URL}/api/recurring`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        const salaryItem = res.data.find(item => 
          item.category.toLowerCase() === 'salary' || 
          item.title.toLowerCase().includes('salary')
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

  const handleQuickSetup = async (e) => {
    e.preventDefault()
    const amount = e.target.amount.value
    if (!amount) return

    try {
      setSetupStep('loading')
      const token = localStorage.getItem("token")
      await axios.post(`${BASE_URL}/api/recurring`, {
        title: "Monthly Salary",
        amount: parseFloat(amount),
        category: "Salary",
        type: "income",
        frequency: "monthly",
        startDate: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSetupStep('success')
      setTimeout(() => setDismissed(true), 3000)
    } catch (err) {
      console.error("Salary setup error:", err)
      setSetupStep('idle')
    }
  }

  if (loading || hasSalary || dismissed) return null

  return (
    <div className="mb-8 animate-in slide-in-from-top duration-700">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        
        {/* Close Button */}
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
              <Banknote size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Simplify Your Tracking</h3>
              <p className="text-gray-400 font-medium">Why add your salary every month? Set it once and let us handle it.</p>
            </div>
          </div>

          {setupStep === 'idle' ? (
            <form onSubmit={handleQuickSetup} className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-48">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input 
                  name="amount"
                  required
                  type="number"
                  placeholder="Monthly Salary"
                  className="w-full pl-8 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
              <button 
                type="submit"
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                Automate Now <ArrowRight size={16} />
              </button>
            </form>
          ) : setupStep === 'success' ? (
            <div className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-[0.2em] text-sm animate-pulse">
              <CheckCircle2 size={24} /> Automation Active
            </div>
          ) : (
            <div className="text-gray-500 font-black uppercase tracking-widest text-xs">Processing...</div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      </div>
    </div>
  )
}

export default SalarySetupBanner
