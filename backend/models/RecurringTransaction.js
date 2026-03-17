import mongoose from "mongoose"

const recurringTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String, // "income" or "expense"
    required: true,
    enum: ["income", "expense"],
  },
  frequency: {
    type: String,
    required: true,
    enum: ["daily", "weekly", "monthly", "yearly"],
    default: "monthly",
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  nextOccurrence: {
    type: Date,
    required: true,
  },
  lastProcessed: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "paused"],
    default: "active",
  },
}, { timestamps: true })

export default mongoose.model("RecurringTransaction", recurringTransactionSchema)
