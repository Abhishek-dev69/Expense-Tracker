import express from "express"
import mongoose from "mongoose"
import { protect } from "../middleware/authMiddleware.js"
import Transaction from "../models/Transaction.js"

import Budget from "../models/Budget.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = 5
    const skip = (page - 1) * limit

    const userId = new mongoose.Types.ObjectId(req.user.id)

    // 🗓️ Current Month Info
    const today = new Date()
    const currentMonthString = today.toISOString().slice(0, 7) // "YYYY-MM"
    const daysPassed = today.getDate()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    // 💰 Fetch Budget for current month
    const budgetDoc = await Budget.findOne({ user: userId, month: currentMonthString })
    const monthlyBudgetLimit = budgetDoc ? budgetDoc.monthlyLimit : 0

    // 🔢 Total count for pagination
    const totalCount = await Transaction.countDocuments({
      user: userId,
    })

    // 📄 Paginated transactions
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 💰 Aggregate totals
    const totals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                { $abs: "$amount" },
                0,
              ],
            },
          },
        },
      },
    ])

    const totalIncome = totals[0]?.totalIncome || 0
    const totalExpense = totals[0]?.totalExpense || 0
    const totalBalance = totalIncome - totalExpense

    // 📊 All transactions for Analytics (unlimited)
    const allTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .lean()

    /* =============================
       📈 Forecast Engine
    ============================== */

    const avgDailyExpense =
      daysPassed > 0 ? totalExpense / daysPassed : 0

    const predictedExpense = avgDailyExpense * daysInMonth
    const predictedBalance = totalIncome - predictedExpense

    res.json({
      totalIncome,
      totalExpense,
      totalBalance,
      predictedBalance,
      averageDailyExpense: avgDailyExpense,
      monthlyBudgetLimit,
      transactions,
      allTransactions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (err) {
    console.error("Dashboard error:", err)
    res.status(500).json({ message: "Dashboard fetch failed" })
  }
})

export default router