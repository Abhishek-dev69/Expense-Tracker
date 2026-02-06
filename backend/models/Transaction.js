import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  amount: Number,
  type: { type: String, enum: ['income', 'expense'] },
  category: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Transaction', transactionSchema)
