import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import Transaction from "../models/Transaction.js"
import { predictCategory } from "../services/aiService.js"

const router = express.Router()

// ➕ Add Income
router.post("/income", protect, async (req, res) => {
  try {

    const tx = await Transaction.create({
      user: req.user.id,
      title: req.body.title || "Income",
      amount: Math.abs(req.body.amount),
      type: "income",
      category: req.body.category || "Income",
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

    const description = req.body.title || "Expense"

    let category = req.body.category
    let confidence = 0

    // 🤖 Use AI only if category not selected
    if (!category || category === "") {

      const ai = await predictCategory(description)

      category = ai.predicted_category
      confidence = ai.confidence

    }

    const tx = await Transaction.create({
      user: req.user.id,
      title: description,
      amount: -Math.abs(req.body.amount),
      type: "expense",
      category,
      aiConfidence: confidence,
      date: req.body.date,
    })

    res.status(201).json(tx)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// 📥 Get Transactions
router.get("/transactions", protect, async (req, res) => {

  try {

    const { page = 1, limit = 10, search, category, startDate, endDate } = req.query

    const query = { user: req.user.id }

    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
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
      totalPages: Math.ceil(total / limit)
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})


// 📦 Batch Add (Import)
router.post("/batch", protect, async (req, res) => {
  try {
    const { transactions } = req.body

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: "Invalid transactions data" })
    }

    // Process transactions to ensure user ID and proper amounts
    const processedTransactions = transactions.map(tx => ({
      ...tx,
      user: req.user.id,
      amount: tx.type === "expense" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
      date: tx.date || new Date()
    }))

    const docs = await Transaction.insertMany(processedTransactions)
    res.status(201).json({ 
      message: `${docs.length} transactions imported successfully`,
      count: docs.length 
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ❌ Delete
router.delete("/transactions/:id", protect, async (req, res) => {

  try {

    const tx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!tx) {
      return res.status(404).json({
        message: "Transaction not found"
      })
    }

    await tx.deleteOne()

    res.json({
      message: "Transaction deleted"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

export default router