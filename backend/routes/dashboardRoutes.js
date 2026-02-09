import express from "express"
import mongoose from "mongoose"
import { protect } from "../middleware/authMiddleware.js"
import Transaction from "../models/Transaction.js"

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = 5
    const skip = (page - 1) * limit

    // ✅ Ensure ObjectId match
    const userId = new mongoose.Types.ObjectId(req.user.id)

    // ✅ Count total transactions for user
    const totalCount = await Transaction.countDocuments({
      user: userId,
    })

    // ✅ Paginated transactions
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // ✅ Aggregate totals (more efficient than filtering JS array)
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

    res.json({
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      transactions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (err) {
    console.error("Dashboard error:", err)
    res.status(500).json({ message: "Dashboard fetch failed" })
  }
})

export default router
