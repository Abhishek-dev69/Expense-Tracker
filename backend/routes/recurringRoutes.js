import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import RecurringTransaction from "../models/RecurringTransaction.js"
import Transaction from "../models/Transaction.js"

const router = express.Router()

// @desc    Get all recurring transactions for a user
router.get("/", protect, async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(recurring)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @desc    Create a recurring transaction
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, type, frequency, startDate } = req.body
    
    // Calculate first occurrence
    const nextOccurrence = new Date(startDate || Date.now())
    
    const newRecurring = await RecurringTransaction.create({
      user: req.user.id,
      title,
      amount,
      category,
      type,
      frequency,
      startDate: startDate || Date.now(),
      nextOccurrence
    })
    
    res.status(201).json(newRecurring)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @desc    Update a recurring transaction
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @desc    Delete a recurring transaction
router.delete("/:id", protect, async (req, res) => {
  try {
    await RecurringTransaction.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: "Recurring transaction removed" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @desc    Check and process pending recurring transactions
router.post("/process", protect, async (req, res) => {
  try {
    const now = new Date()
    const pending = await RecurringTransaction.find({
      user: req.user.id,
      status: "active",
      nextOccurrence: { $lte: now }
    })

    const createdTransactions = []

    for (const item of pending) {
      // Create actual transaction
      const tx = await Transaction.create({
        user: item.user,
        title: `${item.title} (Recurring)`,
        amount: item.amount,
        category: item.category,
        type: item.type,
        date: item.nextOccurrence
      })

      // Calculate next occurrence based on frequency
      const next = new Date(item.nextOccurrence)
      if (item.frequency === "daily") next.setDate(next.getDate() + 1)
      else if (item.frequency === "weekly") next.setDate(next.getDate() + 7)
      else if (item.frequency === "monthly") next.setMonth(next.getMonth() + 1)
      else if (item.frequency === "yearly") next.setFullYear(next.getFullYear() + 1)

      item.lastProcessed = item.nextOccurrence
      item.nextOccurrence = next
      await item.save()

      createdTransactions.push(tx)
    }

    res.json({ 
      message: `Processed ${createdTransactions.length} recurring items`,
      transactions: createdTransactions 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
