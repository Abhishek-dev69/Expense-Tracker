import express from "express"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"
import mongoose from "mongoose"

const router = express.Router()

router.get("/monthly", protect, async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7)
    const start = new Date(`${month}-01`)
    const end = new Date()
    end.setMonth(end.getMonth() + 1)

    const userId = new mongoose.Types.ObjectId(req.user.id)

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: start, $lte: end },
    })

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    res.json({
      month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router