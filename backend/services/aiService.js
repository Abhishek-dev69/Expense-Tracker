import axios from "axios"

export const predictCategory = async (text) => {
  try {
    let mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"
    
    // Remove trailing slash if present to avoid //predict
    mlUrl = mlUrl.replace(/\/+$/, "")
    
    const targetUrl = `${mlUrl}/predict`
    console.log(`🤖 AI Service: Calling prediction at ${targetUrl} for text: "${text}"`)

    const res = await axios.post(targetUrl, {
      text,
    })

    console.log(`✅ AI Service: Prediction received: ${res.data.predicted_category} (${res.data.confidence})`)
    return res.data
  } catch (err) {
    console.error("❌ AI prediction failed:", err.message)
    if (err.response) {
      console.error("Error data:", err.response.data)
      console.error("Error status:", err.response.status)
    }

    return {
      predicted_category: "General",
      confidence: 0,
    }
  }
}