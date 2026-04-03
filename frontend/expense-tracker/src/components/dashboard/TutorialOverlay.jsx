import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  LayoutDashboard, 
  List, 
  Brain, 
  TrendingUp 
} from "lucide-react"

const TutorialOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to FinTrack AI",
      description: "Your intelligent wealth management companion. Let's take a quick tour of your new command center.",
      icon: Sparkles,
      color: "from-emerald-400 to-cyan-400",
      highlight: null,
    },
    {
      title: "Navigation Center",
      description: "Quickly access your accounts, transactions, and deep financial insights from the polished sidebar.",
      icon: LayoutDashboard,
      color: "from-indigo-400 to-blue-500",
      highlight: "sidebar", // Will be used for spotlight in parent
    },
    {
      title: "Smart Transactions",
      description: "Keep track of every penny. Categorize, tag, and split expenses with ease in the transaction hub.",
      icon: List,
      color: "from-amber-400 to-orange-500",
      highlight: "transactions",
    },
    {
      title: "AI Power Insights",
      description: "Our advanced AI analyzes your spending patterns to provide personalized saving tips and financial forecasting.",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      highlight: "insights",
    },
    {
      title: "Wealth Growth",
      description: "Visualize your progress with beautiful, real-time analytics and set aggressive savings goals.",
      icon: TrendingUp,
      color: "from-emerald-400 to-teal-500",
      highlight: "analytics",
    },
  ]

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const current = steps[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.6)]"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 flex">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-full transition-all duration-500 ${i <= step ? `bg-gradient-to-r ${current.color}` : "bg-transparent"}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-10 pb-8">
          <div className="flex justify-between items-start mb-8">
            <motion.div 
              key={step}
              initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center text-slate-950 shadow-2xl pulse-glow`}
            >
              <Icon size={32} />
            </motion.div>
            <button 
              onClick={onComplete}
              className="p-2 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                {current.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-semibold">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-10 pt-0 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-white" : "bg-white/20"}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onComplete}
              className="text-sm font-bold text-slate-500 hover:text-white transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={nextStep}
              className={`group flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r ${current.color} text-slate-950 font-black shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all outline-none`}
            >
              {step === steps.length - 1 ? "Get Started" : "Continue"}
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TutorialOverlay
