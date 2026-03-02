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
// 📥 Get All Transactions (with filters + pagination)
router.get("/transactions", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, startDate, endDate } = req.query

    const query = { user: req.user.id }

    // 🔍 Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    // 📂 Filter by category
    if (category && category !== "All") {
      query.category = category
    }

    // 📅 Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Transaction.countDocuments(query)

    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// ❌ Delete transaction
router.delete("/transactions/:id", protect, async (req, res) => {
  try {
    const tx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!tx) return res.status(404).json({ message: "Transaction not found" })

    await tx.deleteOne()

    res.json({ message: "Transaction deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
