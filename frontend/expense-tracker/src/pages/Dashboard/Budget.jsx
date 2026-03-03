import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"

const Budget = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [monthlyLimit, setMonthlyLimit] = useState("")
  const [data, setData] = useState(null)

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const saveBudget = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/budget`,
        { monthlyLimit: Number(monthlyLimit) },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      setMonthlyLimit("")
      fetchBudget()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  const percentage =
    data?.budget && data?.budget.monthlyLimit
      ? (data.used / data.budget.monthlyLimit) * 100
      : 0

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold text-white">
        Budget Planner
      </h2>

      {/* Set Budget */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
        <p className="text-gray-400 mb-4">Set Monthly Budget</p>

        <div className="flex gap-4">
          <input
            type="number"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            placeholder="Enter monthly limit"
            className="px-4 py-2 bg-[#1f2937] border border-white/10 rounded-xl text-white"
          />

          <button
            onClick={saveBudget}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white"
          >
            Save
          </button>
        </div>
      </div>

      {/* Budget Usage */}
      {data?.budget && (
        <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 mb-2">
            Monthly Limit: ₹{data.budget.monthlyLimit}
          </p>
          <p className="text-gray-400 mb-4">
            Used: ₹{data.used}
          </p>

          <div className="w-full bg-[#1f2937] rounded-full h-4">
            <div
              className="bg-emerald-500 h-4 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-sm mt-2 text-gray-400">
            {percentage.toFixed(1)}% used
          </p>
        </div>
      )}
    </div>
  )
}

export default Budget