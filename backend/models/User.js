import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  streakCount: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  hasSeenTutorial: { type: Boolean, default: false },
  badges: [{ type: String }], // e.g. ["First Saver", "Budget Master"]
})

userSchema.pre('save', async function () {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase()
  }
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model('User', userSchema)
