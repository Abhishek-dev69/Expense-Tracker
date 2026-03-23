import mongoose from "mongoose"
const splitRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "settled"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.model("SplitRequest", splitRequestSchema)
