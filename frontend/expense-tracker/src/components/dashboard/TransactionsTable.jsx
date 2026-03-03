const TransactionsTable = ({
  transactions = [],
  page,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <div className="rounded-3xl p-8 bg-[#111827] border border-white/10 shadow-xl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-semibold text-white">
          Recent Transactions
        </h3>
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-sm">No transactions yet</p>
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-4 text-sm text-gray-400 pb-4 border-b border-white/10">
            <div>Type</div>
            <div>Category</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Rows */}
          <div className="mt-4 space-y-4">
            {transactions.map((t) => {
              const isIncome = t.amount > 0

              const date = new Date(t.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })

              return (
                <div
                  key={t._id}
                  className="grid grid-cols-4 items-center px-5 py-4 rounded-2xl bg-[#1f2937] hover:bg-[#273449] transition"
                >
                  <div className="font-medium text-white">
                    {isIncome ? "Income" : "Expense"}
                  </div>

                  <div className="text-gray-300">
                    {t.category}
                  </div>

                  <div className="text-gray-400">
                    {date}
                  </div>

                  <div
                    className={`text-right font-semibold ${
                      isIncome
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {Math.abs(t.amount).toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onPrev}
              disabled={page === 1}
              className="px-6 py-2 rounded-xl bg-[#1f2937] text-white hover:bg-[#273449] transition disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={onNext}
              disabled={page === totalPages}
              className="px-6 py-2 rounded-xl bg-[#1f2937] text-white hover:bg-[#273449] transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TransactionsTable