import { X } from "lucide-react"

const AddExpenseModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target

    const expenseData = {
      amount: Number(form.amount.value),
      category: form.category.value,
      date: form.date.value,
      notes: form.notes.value,
    }

    onSubmit(expenseData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Add New Expense</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Amount */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
            <div className="text-4xl font-semibold text-red-500">
              − ₹
              <input
                name="amount"
                type="number"
                placeholder="0.00"
                className="w-32 text-center outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-gray-500">Category</label>
            <select
              name="category"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
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
            <label className="text-sm text-gray-500">Notes</label>
            <textarea
              name="notes"
              placeholder="What was this expense for?"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
          >
            Save Expense
          </button>
        </form>
        {/* FORM END */}

      </div>
    </div>
  )
}

export default AddExpenseModal
