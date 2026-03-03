import express from "express"
import Budget from "../models/Budget.js"
import Transaction from "../models/Transaction.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// ✅ Set or Update Monthly Budget
router.post("/", protect, async (req, res) => {
  try {
    const { monthlyLimit, categoryLimits } = req.body

    const month = new Date().toISOString().slice(0, 7)

    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, month },
      { monthlyLimit, categoryLimits, month, user: req.user.id },
      { upsert: true, new: true }
    )

    res.json(budget)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Get Budget + Usage
router.get("/", protect, async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7)

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
    })

    const start = new Date(`${month}-01`)
    const end = new Date()
    end.setMonth(end.getMonth() + 1)

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: new (await import("mongoose")).default.Types.ObjectId(req.user.id),
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: { $abs: "$amount" } },
        },
      },
    ])

    const used = expenses[0]?.totalExpense || 0

    res.json({
      budget,
      used,
      remaining: budget ? budget.monthlyLimit - used : 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router