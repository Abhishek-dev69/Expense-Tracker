import axios from "axios"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const predictCategory = async (text) => {
  let mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"
  
  // Defensive Cleaning
  mlUrl = mlUrl.trim().replace(/\/+$/, "").replace(/\/predict$/, "")
  const targetUrl = `${mlUrl}/predict`

  const maxRetries = 3
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 AI Service: Attempt ${attempt}/${maxRetries} to ${targetUrl}`)

      const res = await axios.post(targetUrl, { text }, {
        timeout: 45000, // 45s per attempt
        headers: { "Accept": "application/json" }
      })

      if (typeof res.data !== "object") {
        throw new Error(`Invalid response format. Expected JSON, got ${typeof res.data}`)
      }

      console.log(`✅ AI Service: Prediction successful for "${text}" -> ${res.data.predicted_category}`)
      return res.data
    } catch (err) {
      lastError = err
      const isStatusError = err.response && (err.response.status === 502 || err.response.status === 503 || err.response.status === 504)
      const isTimeout = err.code === "ECONNABORTED"

      if (attempt < maxRetries && (isStatusError || isTimeout)) {
        console.warn(`⚠️ AI Service: Attempt ${attempt} failed (${err.message}). Retrying in 5s...`)
        await sleep(5000)
        continue
      }
      break // Final failure or non-retryable error
    }
  }

  // Final catch-all error logging
  console.error("❌ AI Service: Prediction failed after retries ->", lastError.message)
  if (lastError.response?.headers["content-type"]?.includes("text/html")) {
    console.error("Received HTML instead of JSON. Check if ML_SERVICE_URL is correct.")
  }

  return { predicted_category: "General", confidence: 0 }
}