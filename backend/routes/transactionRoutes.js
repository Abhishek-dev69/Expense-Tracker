import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import Transaction from "../models/Transaction.js"

const router = express.Router()

// ➕ Add Income
router.post("/income", protect, async (req, res) => {
  try {
    const tx = await Transaction.create({
      user: req.user.id,
      title: req.body.title || "Income",
      amount: Math.abs(req.body.amount),
      type: "income",
      category: req.body.category,
      date: req.body.date,
    })

    res.status(201).json(tx)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ➖ Add Expense
router.post("/expense", protect, async (req, res) => {
  try {
    const tx = await Transaction.create({
      user: req.user.id,
      title: req.body.title || "Expense",
      amount: -Math.abs(req.body.amount),
      type: "expense",
      category: req.body.category,
      date: req.body.date,
    })

    res.status(201).json(tx)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
