import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"

const AIInsights = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/insights`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => setData(res.data))
      .catch(console.error)
  }, [])

  if (!data) return <p className="text-gray-400">Loading insights...</p>

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        AI Financial Insights
      </h2>

      <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 space-y-4">
        <p className="text-gray-400">
          Total Income: ₹{data.totalIncome}
        </p>
        <p className="text-gray-400">
          Total Expense: ₹{data.totalExpense}
        </p>
        <p className="text-gray-400">
          Savings Rate: {data.savingsRate}%
        </p>
      </div>

      <div className="space-y-4">
        {data.insights.map((insight, index) => (
          <div
            key={index}
            className="bg-[#1f2937] p-4 rounded-xl border border-white/10 text-white"
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIInsights