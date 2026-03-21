import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"
import insightsRoutes from "./routes/insightsRoutes.js"
import reportsRoutes from "./routes/reportsRoutes.js"
import recurringRoutes from "./routes/recurringRoutes.js"
import goalRoutes from "./routes/goalRoutes.js"
import gamificationRoutes from "./routes/gamificationRoutes.js"
import splitRoutes from "./routes/splitRoutes.js"

dotenv.config()

const app = express()

/* =====================
   Middleware
===================== */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:517")) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

/* =====================
   Routes
===================== */

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api", transactionRoutes)
app.use("/api/budget", budgetRoutes)
app.use("/api/insights", insightsRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/recurring", recurringRoutes)
app.use("/api/goals", goalRoutes)
app.use("/api/gamification", gamificationRoutes)
app.use("/api/splits", splitRoutes)

/* =====================
   Mongo + Server
===================== */

const PORT = process.env.PORT || 5001

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in .env")
    }

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    })

    console.log("✅ MongoDB Connected")
    console.log("📦 DB Name:", mongoose.connection.name)

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error("❌ Mongo connection error:", err.message)
    process.exit(1)
  }
}

startServer()