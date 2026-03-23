from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import string

print("--- Starting ML Service ---")
print("Loading model artifacts...")

try:
    model = joblib.load("model_artifacts/model.pkl")
    vectorizer = joblib.load("model_artifacts/vectorizer.pkl")
    print("✅ Model artifacts loaded successfully.")
except Exception as e:
    print(f"❌ ERROR loading model artifacts: {str(e)}")
    print(f"Current working directory: {os.getcwd()}")
    import sys
    sys.exit(1)

# Create FastAPI instance
app = FastAPI()


# Input schema
class TransactionInput(BaseModel):
    text: str


# Clean text function
def clean_text(text):
    text = str(text).lower()

    # Remove transaction noise common in Indian context
    noise = [
        "transaction at", "payment to", "spent on", "order at",
        "upi", "pos", "term", "ref", "imps", "neft", "transfer"
    ]
    for n in noise:
        text = text.replace(n, "")

    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text).strip()

    return text


# Prediction API
@app.post("/predict")
def predict(data: TransactionInput):

    cleaned = clean_text(data.text)

    vector = vectorizer.transform([cleaned])

    prediction = model.predict(vector)[0]

    probability = model.predict_proba(vector).max()

    return {
        "predicted_category": prediction,
        "confidence": float(probability)
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)