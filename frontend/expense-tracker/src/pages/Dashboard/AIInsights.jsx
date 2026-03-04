import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"

const AIInsights = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/insights`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        setData(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load AI insights.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [authToken])

  if (loading)
    return <p className="text-gray-400">Loading insights...</p>

  if (error)
    return <p className="text-red-400">{error}</p>

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">
        AI Financial Insights
      </h2>

      {/* SUMMARY */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 space-y-4">
        <p className="text-gray-400">
          Total Income: ₹{data.totalIncome?.toLocaleString()}
        </p>

        <p className="text-gray-400">
          Total Expense: ₹{data.totalExpense?.toLocaleString()}
        </p>

        <p className="text-gray-400">
          Savings Rate: {data.savingsRate}%
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="space-y-4">
        {data.insights?.length > 0 ? (
          data.insights.map((insight, index) => (
            <div
              key={index}
              className="bg-[#1f2937] p-4 rounded-xl border border-white/10 text-white"
            >
              {insight}
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            No insights available yet.
          </p>
        )}
      </div>
    </div>
  )
}

export default AIInsights