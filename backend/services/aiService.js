import axios from "axios"

export const predictCategory = async (text) => {
  try {
    const res = await axios.post("http://localhost:8000/predict", {
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