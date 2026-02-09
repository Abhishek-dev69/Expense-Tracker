import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"


dotenv.config()

const app = express()

// ✅ CORS (works with Vite ports 5173, 5174, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost:517")) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

// ✅ ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api", transactionRoutes)

// ✅ DB + SERVER START
const PORT = process.env.PORT || 5001

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected")
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Mongo error:", err)
    process.exit(1)
  })
