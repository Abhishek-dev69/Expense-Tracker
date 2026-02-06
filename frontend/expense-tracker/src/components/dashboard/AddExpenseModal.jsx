import { useState } from "react"

const AddExpenseModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target
    const expenseData = {
      title: form.title.value,
      amount: Number(form.amount.value),
    }

    onSubmit(expenseData)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Expense</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Expense name"
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal

