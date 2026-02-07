import express from "express"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)

    const allTx = await Transaction.find({ user: req.user.id })

    const income = allTx
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0)

    const expense = allTx
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + Math.abs(b.amount), 0)

    res.json({
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
      transactions,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
