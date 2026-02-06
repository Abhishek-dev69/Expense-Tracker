import express from 'express'
import Transaction from '../models/Transaction.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0)

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + b.amount, 0)

  res.json({
    balance: income - expense,
    income,
    expense,
    transactions,
  })
})

export default router
