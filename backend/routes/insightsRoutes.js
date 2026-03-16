import express from "express"
import Transaction from "../models/Transaction.js"
import Budget from "../models/Budget.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id
    const month = new Date().toISOString().slice(0, 7)
    
    // Fetch all user transactions
    const transactions = await Transaction.find({ user: userId })
    
    // Fetch current month's transactions for velocity check
    const startOfMonth = new Date(`${month}-01`)
    const currentTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth)
    
    const insights = []

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const currentMonthExpense = currentTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const savingsRate = totalIncome
      ? ((totalIncome - totalExpense) / totalIncome) * 100
      : 0

    // 1️⃣ Savings Rate Insight
    if (savingsRate < 20) {
      insights.push({
        type: "warning",
        message: "Your savings rate is below the recommended 20%. Consider auditing your subscription and entertainment costs.",
        icon: "TrendingDown"
      })
    } else if (savingsRate > 40) {
      insights.push({
        type: "success",
        message: "Outstanding! Your savings rate is over 40%. You are building wealth significantly faster than average.",
        icon: "Rocket"
      })
    } else {
      insights.push({
        type: "success",
        message: "You have a healthy savings rate. Keep maintaining this balance to reach your financial goals.",
        icon: "ShieldCheck"
      })
    }

    // 2️⃣ Top Category Insight
    const categoryMap = {}
    transactions.forEach(t => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount)
      }
    })

    const topCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0]

    if (topCategory) {
      insights.push({
        type: "info",
        message: `Your top expense is ${topCategory[0]} (₹${topCategory[1].toLocaleString()}). Is there a way to optimize this?`,
        icon: "BarChart3"
      })
    }

    // 3️⃣ Spending Velocity check
    const today = new Date().getDate()
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    
    // Fetch budget for proximity check
    const budget = await Budget.findOne({ user: userId, month })
    
    if (budget && budget.monthlyLimit > 0) {
      const budgetLimit = budget.monthlyLimit
      const spendingRatio = currentMonthExpense / budgetLimit
      const timeRatio = today / daysInMonth

      if (spendingRatio > timeRatio + 0.15) {
        insights.push({
          type: "warning",
          message: `Caution: You've used ${(spendingRatio * 100).toFixed(0)}% of your budget, but we're only ${(timeRatio * 100).toFixed(0)}% through the month. Slow down!`,
          icon: "Zap"
        })
      } else if (spendingRatio < timeRatio - 0.1) {
        insights.push({
          type: "success",
          message: "Great discipline! You are spending slower than your budget's pace for this month.",
          icon: "ZapOff"
        })
      }
    }

    // 4️⃣ Uncategorized Detection
    const uncategorizedCount = transactions.filter(t => t.category === "General" || !t.category).length
    if (uncategorizedCount > 5) {
      insights.push({
        type: "tip",
        message: `You have ${uncategorizedCount} transactions in 'General'. Categorizing them helps the AI give you better advice.`,
        icon: "Tag"
      })
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