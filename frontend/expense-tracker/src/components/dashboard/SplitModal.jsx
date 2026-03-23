// src/components/dashboard/SplitModal.jsx
import { useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Users, X, Plus, Trash2, CheckCircle2, History } from "lucide-react"

const SplitModal = ({ isOpen, onClose, transaction, onRefresh }) => {
  const [splits, setSplits] = useState(transaction?.splitDetails?.length > 0 ? transaction.splitDetails : [])
  const [isSocial, setIsSocial] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen || !transaction) return null

  const addPerson = () => {
    setSplits([...splits, { name: "", email: "", amount: 0, status: "pending" }])
  }

  const removePerson = (index) => {
    setSplits(splits.filter((_, i) => i !== index))
  }

  const updatePerson = (index, field, value) => {
    const newSplits = [...splits]
    newSplits[index][field] = value
    setSplits(newSplits)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (isSocial) {
        // Send individual social requests
        await Promise.all(splits.map(split => 
          axios.post(`${BASE_URL}/api/splits/send-request`, {
            toEmail: split.email,
            amount: split.amount,
            transactionTitle: transaction.title
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ))
      }

      // Also save the local record on the transaction for the current user
      await axios.post(`${BASE_URL}/api/splits/split/${transaction._id}`, { splits }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      onRefresh()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to save split details.")
    } finally {
      setLoading(false)
    }
  }

  const totalSplit = splits.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0)
  const myShare = Math.abs(transaction.amount) - totalSplit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
      <div className="absolute inset-0 bg-[#0b1220]/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl p-10 rounded-[3rem] bg-[#161d2a] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white">Split Transaction</h2>
        </div>
        <p className="text-gray-400 mb-6 ml-16">Divide "{transaction.title}" among friends.</p>

        {/* 🚀 Social Toggle */}
        <div className="ml-16 mb-8 flex items-center gap-3 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
          <button 
            onClick={() => setIsSocial(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isSocial ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            LOCAL RECORD
          </button>
          <button 
            onClick={() => setIsSocial(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isSocial ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            SOCIAL REQUEST
          </button>
        </div>

        <div className="space-y-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Bill</p>
               <p className="text-xl font-black text-white">₹{Math.abs(transaction.amount).toLocaleString()}</p>
             </div>
             <div className="text-right">
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Share</p>
               <p className={`text-xl font-black ${myShare < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                 ₹{myShare.toLocaleString()}
               </p>
             </div>
          </div>

          {splits.map((split, index) => (
            <div key={index} className="group flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Friend's Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                    value={split.name}
                    onChange={(e) => updatePerson(index, "name", e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    placeholder="₹ 0"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold text-sm"
                    value={split.amount}
                    onChange={(e) => updatePerson(index, "amount", e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => removePerson(index)}
                  className="p-3 rounded-xl bg-white/5 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {isSocial && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    type="email"
                    placeholder="Registered Email Address"
                    className="w-full px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-200 placeholder:text-indigo-300/30 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-xs"
                    value={split.email || ""}
                    onChange={(e) => updatePerson(index, "email", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={addPerson}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Someone
          </button>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading || splits.some(s => !s.name || !s.amount || (isSocial && !s.email))}
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-40"
          >
            {loading ? "Processing..." : isSocial ? "SEND REQUESTS" : "SAVE SPLITS"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SplitModal
