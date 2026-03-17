import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import Transaction from "../models/Transaction.js"
import Goal from "../models/Goal.js"

const router = express.Router()

// @desc    Get user's gamification status (streak & badges)
router.get("/status", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("streakCount lastLoginDate badges")
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @desc    Update/Check streaks (called on dashboard load)
router.post("/check-streak", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!user.lastLoginDate) {
      user.streakCount = 1
      user.lastLoginDate = today
    } else {
      const lastLogin = new Date(user.lastLoginDate)
      lastLogin.setHours(0, 0, 0, 0)

      const diffTime = Math.abs(today - lastLogin)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Logged in today after logging in yesterday
        user.streakCount += 1
        user.lastLoginDate = today
      } else if (diffDays > 1) {
        // Streak broken
        user.streakCount = 1
        user.lastLoginDate = today
      }
      // If diffDays === 0, user already checked in today
    }

    await user.save()
    res.json({ streakCount: user.streakCount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @desc    Check and unlock badges
router.post("/sync-badges", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const txCount = await Transaction.countDocuments({ user: req.user.id })
    const goalCount = await Goal.countDocuments({ user: req.user.id, status: "completed" })
    
    const newBadges = []

    if (txCount >= 1 && !user.badges.includes("First Step")) {
      newBadges.push("First Step") // First transaction
    }
    if (txCount >= 50 && !user.badges.includes("Transaction Pro")) {
      newBadges.push("Transaction Pro")
    }
    if (goalCount >= 1 && !user.badges.includes("Goal Crusher")) {
      newBadges.push("Goal Crusher")
    }
    if (user.streakCount >= 7 && !user.badges.includes("Weekly Warrior")) {
      newBadges.push("Weekly Warrior")
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges)
      await user.save()
    }

    res.json({ badges: user.badges, unlocked: newBadges })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
