// src/components/dashboard/SplitModal.jsx
import { useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Users, X, Plus, Trash2, CheckCircle2, History } from "lucide-react"

const SplitModal = ({ isOpen, onClose, transaction, onRefresh }) => {
  const [splits, setSplits] = useState(transaction?.splitDetails?.length > 0 ? transaction.splitDetails : [])
  const [loading, setLoading] = useState(false)

  if (!isOpen || !transaction) return null

  const addPerson = () => {
    setSplits([...splits, { name: "", amount: 0, status: "pending" }])
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
        <p className="text-gray-400 mb-8 ml-16">Divide "{transaction.title}" among friends.</p>

        <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
            <div key={index} className="group flex items-center gap-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Friend's Name"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={split.name}
                  onChange={(e) => updatePerson(index, "name", e.target.value)}
                />
              </div>
              <div className="w-32 space-y-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold"
                  value={split.amount}
                  onChange={(e) => updatePerson(index, "amount", e.target.value)}
                />
              </div>
              <button 
                onClick={() => removePerson(index)}
                className="p-4 rounded-2xl bg-white/5 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
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
            disabled={loading || splits.some(s => !s.name || !s.amount)}
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-40"
          >
            {loading ? "Saving..." : "Save Splits"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SplitModal
