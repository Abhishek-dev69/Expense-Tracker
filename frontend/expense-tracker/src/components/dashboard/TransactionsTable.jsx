const TransactionsTable = ({
  transactions = [],
  page,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recent Transactions</h3>
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => {
                const isIncome = t.amount > 0
                const date = new Date(t.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })

                return (
                  <tr key={t._id} className="border-b last:border-none">
                    <td className="py-3 font-medium">
                      {isIncome ? "Income" : "Expense"}
                    </td>
                    <td className="py-3 text-gray-500">{t.category}</td>
                    <td className="py-3 text-gray-500">{date}</td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        isIncome ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}₹{Math.abs(t.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onPrev}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={onNext}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
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
