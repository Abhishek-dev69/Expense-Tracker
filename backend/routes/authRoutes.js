import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  if (req.body.email) req.body.email = req.body.email.toLowerCase()
  const user = await User.create(req.body)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

router.post('/login', async (req, res) => {
  const email = req.body.email?.toLowerCase()
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    // Ensure the field exists in the response
    const userObj = user.toObject()
    if (userObj.hasSeenTutorial === undefined) {
      userObj.hasSeenTutorial = false
    }
    
    res.json(userObj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/complete-tutorial', protect, async (req, res) => {
  try {
    const userId = req.user._id
    console.log(`Tutorial completed for user: ${userId}`)
    const user = await User.findByIdAndUpdate(
      userId,
      { hasSeenTutorial: true },
      { new: true }
    ).select('-password')
    
    if (!user) {
      console.log('User not found for tutorial completion update')
      return res.status(404).json({ message: 'User not found' })
    }

    console.log(`Tutorial update saved for ${user.email}: hasSeenTutorial=${user.hasSeenTutorial}`)
    res.json(user)
  } catch (err) {
    console.error('Tutorial completion error:', err)
    res.status(500).json({ message: err.message })
  }
})

export default router
