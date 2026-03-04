import { X } from "lucide-react"

const AddExpenseModal = ({ onClose, onSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target

    const expenseData = {
      title: form.notes.value,   // ⭐ important
      amount: Number(form.amount.value),
      category: form.category.value,
      date: form.date.value,
    }

    onSubmit(expenseData)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-red-900/30 backdrop-blur-md flex items-center justify-center z-50">

      <div className="w-[420px] rounded-3xl p-8 relative 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-white">
            Add New Expense
          </h3>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-white/70 hover:text-white transition"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="text-center">
            <p className="text-xs text-white/70 mb-2">AMOUNT</p>

            <div className="text-4xl font-semibold text-red-300">
              − ₹
              <input
                name="amount"
                type="number"
                placeholder="0.00"
                className="w-32 text-center bg-transparent outline-none text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Category</label>

            <select
              name="category"
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white"
            >
              <option value="">AI Auto Detect</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Date</label>

            <input
              name="date"
              type="date"
              required
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Description</label>

            <textarea
              name="notes"
              placeholder="Uber ride to airport"
              className="w-full mt-2 p-3 rounded-xl bg-[#1e1e1e]/40 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium text-white
              bg-gradient-to-r from-red-400 to-red-600"
          >
            Save Expense
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal