import { useEffect, useState } from "react"
import axios from "axios"
import { Search, Trash2 } from "lucide-react"

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
          headers: { Authorization: `Bearer ${token}` },
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

      await axios.delete(
        `http://localhost:5001/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          Transactions
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              pl-9 pr-4 py-2 w-72 rounded-xl
              bg-[#1f2937]
              border border-white/10
              text-white
              focus:outline-none focus:border-emerald-500
              transition
            "
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-gray-400">Loading transactions...</div>
      ) : (
        <div className="rounded-2xl bg-[#111827] border border-white/10 shadow-lg">

          {/* Table Header */}
          <div className="grid grid-cols-6 px-6 py-4 text-sm text-gray-400 border-b border-white/10">
            <div>Date</div>
            <div>Category</div>
            <div>Title</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="
                  grid grid-cols-6 items-center
                  px-6 py-4
                  hover:bg-[#1f2937]
                  transition
                "
              >
                <div className="text-gray-300">
                  {new Date(tx.date).toLocaleDateString()}
                </div>

                <div className="text-gray-300">
                  {tx.category}
                </div>

                <div className="text-white font-medium">
                  {tx.title}
                </div>

                <div>
                  <span
                    className={`
                      px-3 py-1 text-xs rounded-full font-medium
                      ${
                        tx.type === "income"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }
                    `}
                  >
                    {tx.type}
                  </span>
                </div>

                <div
                  className={`text-right font-semibold ${
                    tx.type === "income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  ₹ {Math.abs(tx.amount).toLocaleString()}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => deleteTransaction(tx._id)}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-white/10 text-sm text-gray-400">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg bg-[#1f2937] hover:bg-[#273449] disabled:opacity-40 transition"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg bg-[#1f2937] hover:bg-[#273449] disabled:opacity-40 transition"
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