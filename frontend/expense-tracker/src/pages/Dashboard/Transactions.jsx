import { useEffect, useState } from "react"
import axios from "axios"
import { Search, Trash2, Download } from "lucide-react"

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

  // ✅ EXPORT CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return

    // Define headers
    const headers = ["Date", "Category", "Title", "Type", "Amount"]
    
    // Format rows
    const rows = transactions.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      `"${tx.category}"`, // Quote to handle commas
      `"${tx.title}"`,
      tx.type,
      tx.amount
    ].join(","))

    // Combine
    const csvContent = [headers.join(","), ...rows].join("\n")
    
    // Create Blob and trigger download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          Transactions
        </h2>

        <div className="flex items-center gap-4">
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm"
          >
            <Download size={16} />
            Export CSV
          </button>

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
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none focus:border-emerald-500/50
                transition-all
              "
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-gray-400">Loading transactions...</div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">

          {/* Table Header */}
          <div className="grid grid-cols-6 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
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
                  hover:bg-white/5
                  transition-all
                "
              >
                <div className="text-gray-300 text-sm">
                  {new Date(tx.date).toLocaleDateString()}
                </div>

                <div className="text-gray-300 text-sm italic">
                  {tx.category}
                </div>

                <div className="text-white font-medium">
                  {tx.title}
                </div>

                <div>
                  <span
                    className={`
                      px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg
                      ${
                        tx.type === "income"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }
                    `}
                  >
                    {tx.type}
                  </span>
                </div>

                <div
                  className={`text-right font-bold ${
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
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition-all active:scale-95"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-white/5 text-sm text-gray-400">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-40 transition-all font-bold text-xs uppercase"
            >
              Prev
            </button>

            <span className="font-medium tracking-wide">
              Page <span className="text-emerald-400">{page}</span> of <span className="text-white">{totalPages}</span>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-40 transition-all font-bold text-xs uppercase"
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