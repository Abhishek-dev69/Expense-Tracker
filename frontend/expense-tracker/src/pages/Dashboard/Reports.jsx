import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"

const Reports = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [report, setReport] = useState(null)

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/reports/monthly`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => setReport(res.data))
      .catch(console.error)
  }, [])

  if (!report) return <p className="text-gray-400">Loading report...</p>

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        Monthly Report
      </h2>

      <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 space-y-3">
        <p className="text-gray-400">Month: {report.month}</p>
        <p className="text-gray-400">
          Total Income: ₹{report.totalIncome}
        </p>
        <p className="text-gray-400">
          Total Expense: ₹{report.totalExpense}
        </p>
        <p className="text-gray-400">
          Balance: ₹{report.balance}
        </p>
        <p className="text-gray-400">
          Transactions: {report.transactionCount}
        </p>
      </div>
    </div>
  )
}

export default Reports