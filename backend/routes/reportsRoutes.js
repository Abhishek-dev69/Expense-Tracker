import express from "express"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/monthly", protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const month = parseInt(req.query.month, 10)
    const year = parseInt(req.query.year, 10)
    
    // selectedMonth is 1-based (1=Jan, 2=feb), convert to 0-based for JS Date
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)
    
    // Manual format to YYYY-MM to avoid timezone shift from toISOString
    const selectedMonthStr = `${year}-${month.toString().padStart(2, '0')}`

    // Previous month range for comparison
    const prevStart = new Date(start)
    prevStart.setMonth(prevStart.getMonth() - 1)
    const prevEnd = new Date(start)
    prevEnd.setSeconds(-1)

    // Fetch current month transactions with lean for efficiency
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).lean()

    // Fetch previous month transactions for comparison
    const prevTransactions = await Transaction.find({
      user: userId,
      date: { $gte: prevStart, $lte: prevEnd },
    }).lean()

    const calculateMetrics = (txs) => {
      const income = txs
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expense = txs
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      return { income, expense, balance: income - expense, count: txs.length }
    }

    const currentMetrics = calculateMetrics(transactions)
    const prevMetrics = calculateMetrics(prevTransactions)

    // Category Breakdown
    const categoryBreakdown = {}
    transactions.forEach(t => {
      if (t.type === "expense") {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount)
      }
    })

    const breakdownArray = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)

    res.json({
      month: selectedMonthStr,
      ...currentMetrics,
      previousMonth: prevMetrics,
      breakdown: breakdownArray,
      transactions: transactions.map(t => ({
        id: t._id,
        date: t.date,
        title: t.title || t.description || "Untitled Transaction",
        amount: t.amount,
        type: t.type,
        category: t.category,
        splitDetails: t.splitDetails || []
      }))
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router