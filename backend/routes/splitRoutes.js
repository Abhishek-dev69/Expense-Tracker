import SplitRequest from "../models/SplitRequest.js"

const router = express.Router()

// 📊 Get Split Summary (Who owes me / Who I owe)
router.get("/summary", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      "splitDetails.0": { $exists: true } // Only transactions with splits
    }).lean()

    const debts = [] // Who owes me
    const ious = []  // Who I owe

    transactions.forEach(tx => {
      tx.splitDetails.forEach(split => {
        if (split.status === "pending") {
          debts.push({
            transactionId: tx._id,
            title: tx.title,
            person: split.name,
            amount: split.amount,
            date: tx.date
          })
        }
      })
    })

    // Fetch incoming social requests (Who I owe)
    const socialRequests = await SplitRequest.find({
      toEmail: req.user.email,
      status: { $in: ["pending", "accepted"] }
    }).populate("fromUser", "name email").lean()

    socialRequests.forEach(req => {
      ious.push({
        _id: req._id,
        title: req.transactionTitle,
        person: req.fromUser?.name || req.fromUser?.email,
        amount: req.amount,
        status: req.status,
        date: req.date
      })
    })

    res.json({ debts, ious })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ➕ Send a Social Split Request
router.post("/send-request", protect, async (req, res) => {
  try {
    const { toEmail, amount, transactionTitle } = req.body

    const splitRequest = await SplitRequest.create({
      fromUser: req.user.id,
      toEmail,
      amount,
      transactionTitle,
    })

    res.status(201).json(splitRequest)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 🔄 Respond to Split Request (Accept/Reject)
router.patch("/respond-request/:id", protect, async (req, res) => {
  try {
    const { status } = req.body // 'accepted' or 'rejected'
    
    // Check if request was sent to THIS user's email
    const request = await SplitRequest.findOne({ 
      _id: req.params.id, 
      toEmail: req.user.email 
    })

    if (!request) return res.status(404).json({ message: "Request not found" })

    request.status = status
    await request.save()

    res.json(request)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Settle a Social Split
router.patch("/settle-social/:id", protect, async (req, res) => {
  try {
    const request = await SplitRequest.findOne({ 
      _id: req.params.id,
      $or: [{ fromUser: req.user.id }, { toEmail: req.user.email }]
    })

    if (!request) return res.status(404).json({ message: "Request not found" })

    request.status = "settled"
    await request.save()

    res.json(request)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ➕ Add/Update Split for a Transaction (Local record)
router.post("/split/:id", protect, async (req, res) => {
  try {
    const { splits } = req.body // Array of { name, amount }
    
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id })
    if (!tx) return res.status(404).json({ message: "Transaction not found" })

    tx.splitDetails = splits
    await tx.save()

    res.json({ message: "Split updated successfully", transaction: tx })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Settle a Split
router.post("/settle/:txId/:name", protect, async (req, res) => {
  try {
    const { txId, name } = req.params

    const tx = await Transaction.findOne({ _id: txId, user: req.user.id })
    if (!tx) return res.status(404).json({ message: "Transaction not found" })

    const split = tx.splitDetails.find(s => s.name === name)
    if (split) {
      split.status = "settled"
      await tx.save()
    }

    res.json({ message: "Split marked as settled", transaction: tx })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
