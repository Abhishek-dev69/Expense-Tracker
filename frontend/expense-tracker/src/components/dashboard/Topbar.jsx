const Topbar = ({ onAddIncome, onAddExpense }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="border rounded-lg px-4 py-2"
        />

        <button
          onClick={onAddExpense}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Add Expense
        </button>

        <button
          onClick={onAddIncome}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Add Income
        </button>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="rounded-full"
            alt="User"
          />
          <span className="text-sm font-medium">User</span>
        </div>
      </div>
    </div>
  )
}

export default Topbar
