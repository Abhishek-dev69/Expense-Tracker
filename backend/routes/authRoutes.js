import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  const user = await User.create(req.body)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
