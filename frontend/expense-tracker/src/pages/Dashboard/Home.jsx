import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"

import StatsGrid from "../../components/dashboard/StatsGrid"
import TransactionsTable from "../../components/dashboard/TransactionsTable"

const Home = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchDashboard = async (pageNo) => {
    try {
      setLoading(true)

      const res = await fetch(
        `${BASE_URL}/api/dashboard?page=${pageNo}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )

      if (!res.ok) throw new Error("Dashboard fetch failed")

      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Dashboard error:", err)
      setData({
        transactions: [],
        totalPages: 1,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard(page)
  }, [page])

  if (!data || loading) return <p>Loading...</p>

  return (
    <>
      <StatsGrid data={data} />

      <TransactionsTable
        transactions={data.transactions || []}
        page={page}
        totalPages={data.totalPages || 1}
        onNext={() =>
          setPage((p) => Math.min(p + 1, data.totalPages || 1))
        }
        onPrev={() =>
          setPage((p) => Math.max(p - 1, 1))
        }
      />
    </>
  )
}

export default Home
