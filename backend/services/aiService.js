import axios from "axios"

export const predictCategory = async (text) => {
  try {
    let mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"
    
    // Defensive Cleaning: Remove trailing slashes and unintended paths
    mlUrl = mlUrl.trim().replace(/\/+$/, "")
    mlUrl = mlUrl.replace(/\/predict$/, "") // Remove /predict if the user added it manually
    
    const targetUrl = `${mlUrl}/predict`
    console.log(`🤖 AI Service: Requesting prediction from -> ${targetUrl}`)

    const res = await axios.post(targetUrl, {
      text,
    }, {
      timeout: 60000, // 60s timeout for cold starts
      headers: { "Accept": "application/json" }
    })

    if (typeof res.data !== "object") {
      throw new Error(`Invalid response format. Expected JSON, got ${typeof res.data}`)
    }

    console.log(`✅ AI Service: Prediction successful for "${text}" -> ${res.data.predicted_category}`)
    return res.data
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      console.error("❌ AI Service: Prediction timed out (Service might be waking up).")
    } else {
      console.error("❌ AI Service: Prediction Error ->", err.message)
    }
    
    if (err.response) {
      console.error("Response Type:", err.response.headers["content-type"])
      if (err.response.headers["content-type"]?.includes("text/html")) {
        console.error("Received HTML instead of JSON. Check if ML_SERVICE_URL is correct.")
      }
    }

    return {
      predicted_category: "General",
      confidence: 0,
    }
  }
}