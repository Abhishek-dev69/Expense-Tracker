import axios from "axios"

export const predictCategory = async (text) => {
  try {
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"
    const res = await axios.post(`${mlUrl}/predict`, {
      text,
    })

    return res.data
  } catch (err) {
    console.error("AI prediction failed:", err.message)

    return {
      predicted_category: "General",
      confidence: 0,
    }
  }
}