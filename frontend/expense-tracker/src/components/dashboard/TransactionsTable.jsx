const TransactionsTable = ({
  transactions = [],
  page,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <div
      className="
        relative rounded-3xl p-8
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      "
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex justify-between items-center mb-8">
        <h3 className="text-xl font-semibold text-white tracking-wide">
          Recent Transactions
        </h3>
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-sm relative">
          No transactions yet
        </p>
      ) : (
        <>
          {/* Header Row */}
          <div className="relative grid grid-cols-4 text-sm text-gray-400 pb-4 border-b border-white/10">
            <div>Type</div>
            <div>Category</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Rows */}
          <div className="relative mt-6 space-y-4">
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
                  className="
                    grid grid-cols-4 items-center
                    px-6 py-4 rounded-2xl
                    bg-[#1f2937]/70
                    backdrop-blur-md
                    border border-white/5
                    shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
                    hover:scale-[1.01]
                    hover:bg-[#273449]/80
                    transition-all duration-300
                  "
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
                    className={`text-right font-semibold tracking-wide ${
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
          <div className="relative flex justify-end gap-4 mt-10">
            <button
              onClick={onPrev}
              disabled={page === 1}
              className="
                px-6 py-2 rounded-xl
                bg-[#1f2937]/70 backdrop-blur-md
                border border-white/5
                text-white
                shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
                hover:scale-105
                transition-all
                disabled:opacity-40
              "
            >
              Previous
            </button>

            <button
              onClick={onNext}
              disabled={page === totalPages}
              className="
                px-6 py-2 rounded-xl
                bg-[#1f2937]/70 backdrop-blur-md
                border border-white/5
                text-white
                shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
                hover:scale-105
                transition-all
                disabled:opacity-40
              "
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