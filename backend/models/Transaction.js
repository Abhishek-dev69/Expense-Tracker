import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    aiConfidence: {
      type: Number,
      default: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    splitDetails: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { 
          type: String, 
          enum: ["pending", "settled"], 
          default: "pending" 
        }
      }
    ],
  },
  { timestamps: true }
)

export default mongoose.model("Transaction", transactionSchema)