import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import Transaction from "../models/Transaction.js"

const router = express.Router()

// 📊 Get Split Summary (Who owes me / Who I owe)
router.get("/summary", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      "splitDetails.0": { $exists: true } // Only transactions with splits
    }).lean()

    const debts = [] // Who owes me
    const ious = []  // Who I owe (for cases where we might support others paying later)

    transactions.forEach(tx => {
      tx.splitDetails.forEach(split => {
        if (split.status === "pending") {
          debts.push({
            transactionId: tx._id,
            title: tx.title,
            person: split.name,
            amount: split.amount,
            date: tx.date
          })
        }
      })
    })

    res.json({ debts, ious })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ➕ Add/Update Split for a Transaction
router.post("/split/:id", protect, async (req, res) => {
  try {
    const { splits } = req.body // Array of { name, amount }
    
    const tx = await Transaction.findOne({ _id: req.id, user: req.user.id })
    if (!tx) return res.status(404).json({ message: "Transaction not found" })

    tx.splitDetails = splits
    await tx.save()

    res.json({ message: "Split updated successfully", transaction: tx })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Settle a Split
router.post("/settle/:txId/:name", protect, async (req, res) => {
  try {
    const { txId, name } = req.params

    const tx = await Transaction.findOne({ _id: txId, user: req.user.id })
    if (!tx) return res.status(404).json({ message: "Transaction not found" })

    const split = tx.splitDetails.find(s => s.name === name)
    if (split) {
      split.status = "settled"
      await tx.save()
    }

    res.json({ message: "Split marked as settled", transaction: tx })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
