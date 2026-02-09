const TransactionsTable = ({ transactions = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet</p>
      ) : (
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
              const formattedDate = new Date(t.date).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )

              return (
                <tr
                  key={t._id}
                  className="border-b last:border-none"
                >
                  <td className="py-3 font-medium">
                    {isIncome ? "Income" : "Expense"}
                  </td>

                  <td className="py-3 text-gray-500">
                    {t.category}
                  </td>

                  <td className="py-3 text-gray-500">
                    {formattedDate}
                  </td>

                  <td
                    className={`py-3 text-right font-semibold ${
                      isIncome
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {Math.abs(t.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TransactionsTable
