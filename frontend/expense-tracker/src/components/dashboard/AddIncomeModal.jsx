import { X } from "lucide-react"

const AddIncomeModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target
    const incomeData = {
      amount: Number(form.amount.value),
      category: form.category.value,
      date: form.date.value,
      notes: form.notes.value,
    }

    onSubmit(incomeData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Add New Income</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Amount */}
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
          <div className="text-4xl font-semibold text-green-500">
            + ₹
            <input
              name="amount"
              type="number"
              placeholder="0.00"
              className="w-32 text-center outline-none"
              required
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category */}
          <div>
            <label className="text-sm text-gray-500">Category</label>
            <select
              name="category"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-gray-500">Date</label>
            <input
              name="date"
              type="date"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-500">Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Add a description..."
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-emerald-400 text-white py-3 rounded-xl font-medium"
          >
            Save Income
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddIncomeModal
