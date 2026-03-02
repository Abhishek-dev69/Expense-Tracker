import { useEffect, useState } from "react"
import axios from "axios"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchTransactions = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const res = await axios.get(
        `http://localhost:5001/api/transactions?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setTransactions(res.data.transactions)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, search])

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search transactions..."
        className="border px-4 py-2 rounded mb-4 w-80"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">{tx.category}</td>

                  <td className="p-3">{tx.title}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td
                    className={`p-3 text-right font-semibold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹ {Math.abs(tx.amount).toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteTransaction(tx._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions