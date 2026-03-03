import mongoose from "mongoose"

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthlyLimit: {
    type: Number,
    required: true,
  },
  categoryLimits: {
    type: Map,
    of: Number,
  },
  month: {
    type: String, // "2026-03"
    required: true,
  },
})

export default mongoose.model("Budget", budgetSchema)