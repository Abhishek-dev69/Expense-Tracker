import express from "express"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {

  try {

    const transactions = await Transaction.find({
      user: req.user.id
    })

    const insights = []

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const savingsRate = totalIncome
      ? ((totalIncome - totalExpense) / totalIncome) * 100
      : 0


    if (savingsRate < 20) {
      insights.push("⚠️ Your savings rate is low. Try reducing discretionary spending.")
    } else if (savingsRate > 40) {
      insights.push("🚀 Excellent savings rate! You're managing money well.")
    } else {
      insights.push("✅ Healthy savings habits.")
    }


    const categoryMap = {}

    transactions.forEach(t => {
      if (t.type === "expense") {

        categoryMap[t.category] =
          (categoryMap[t.category] || 0) + Math.abs(t.amount)

      }
    })

    const topCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0]

    if (topCategory) {
      insights.push(`📊 Highest spending category: ${topCategory[0]}`)
    }


    res.json({
      totalIncome,
      totalExpense,
      savingsRate: savingsRate.toFixed(2),
      insights
    })

  } catch (err) {

    res.status(500).json({ message: err.message })

  }

})

export default router