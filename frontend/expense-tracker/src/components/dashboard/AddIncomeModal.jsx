import { X } from "lucide-react"

const AddIncomeModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target

    const incomeData = {
  title: form.notes.value,
  amount: Number(form.amount.value),
  category: form.category.value,
  date: form.date.value,
}

    onSubmit(incomeData)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-emerald-900/30 backdrop-blur-md flex items-center justify-center z-50">

      {/* Glass Card */}
      <div className="w-[420px] rounded-3xl p-8 relative 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-white tracking-wide">
            Add New Income
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-white/70 hover:text-white transition" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Amount */}
          <div className="text-center">
            <p className="text-xs text-white/70 mb-2 tracking-widest">AMOUNT</p>
            <div className="text-4xl font-semibold text-emerald-300">
              + ₹
              <input
                name="amount"
                type="number"
                placeholder="0.00"
                className="w-32 text-center bg-transparent outline-none text-white"
                required
              />
            </div>
          </div>

          {/* Neumorphism Fields */}
          <div>
            <label className="text-sm text-white/70">Category</label>
            <select
              name="category"
              required
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white
                shadow-[6px_6px_16px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.05)]
                focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Date</label>
            <input
              name="date"
              type="date"
              required
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white
                shadow-[6px_6px_16px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.05)]
                focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Notes</label>
            <textarea
              name="notes"
              placeholder="Add a description..."
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white
                shadow-[6px_6px_16px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.05)]
                focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium text-white
              bg-gradient-to-r from-emerald-400 to-emerald-600
              shadow-lg hover:scale-[1.02] transition duration-300"
          >
            Save Income
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddIncomeModal