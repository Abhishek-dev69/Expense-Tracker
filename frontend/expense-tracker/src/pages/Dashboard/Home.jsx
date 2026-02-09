import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"

import StatsGrid from "../../components/dashboard/StatsGrid"
import TransactionsTable from "../../components/dashboard/TransactionsTable"

const Home = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return null

  return (
    <>
      <StatsGrid data={data} />
      <TransactionsTable transactions={data.transactions} />
    </>
  )
}

export default Home
