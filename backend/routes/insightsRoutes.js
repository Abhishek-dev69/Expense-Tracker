import express from "express"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)

    const transactions = await Transaction.find({ user: userId })

    const insights = []

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const savingsRate = totalIncome > 0
      ? ((totalIncome - totalExpense) / totalIncome) * 100
      : 0

    if (savingsRate < 20) {
      insights.push("⚠️ Your savings rate is below 20%. Consider reducing expenses.")
    } else {
      insights.push("✅ Good job! Your savings rate is healthy.")
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
      insights.push(`📊 Your highest spending category is ${topCategory[0]}.`)
    }

    res.json({
      totalIncome,
      totalExpense,
      savingsRate: savingsRate.toFixed(2),
      insights,
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router