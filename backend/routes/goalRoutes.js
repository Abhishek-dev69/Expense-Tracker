import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import Goal from "../models/Goal.js"

const router = express.Router()

// @desc    Get all goals for a user
router.get("/", protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(goals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @desc    Create a goal
router.post("/", protect, async (req, res) => {
  try {
    const { name, targetAmount, deadline, category } = req.body
    const newGoal = await Goal.create({
      user: req.user.id,
      name,
      targetAmount,
      deadline,
      category
    })
    res.status(201).json(newGoal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @desc    Update a goal (including adding funds)
router.put("/:id", protect, async (req, res) => {
  try {
    const { currentAmount } = req.body
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id })
    
    if (!goal) return res.status(404).json({ message: "Goal not found" })

    // If updating amount, check status
    if (currentAmount !== undefined) {
      goal.currentAmount = currentAmount
      if (goal.currentAmount >= goal.targetAmount) {
        goal.status = "completed"
      } else {
        goal.status = "active"
      }
    }

    // Merge other updates
    Object.assign(goal, req.body)
    await goal.save()
    
    res.json(goal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @desc    Delete a goal
router.delete("/:id", protect, async (req, res) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: "Goal removed" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
