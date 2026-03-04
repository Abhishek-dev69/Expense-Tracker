from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import string

# Load trained model
model = joblib.load("model_artifacts/model.pkl")
vectorizer = joblib.load("model_artifacts/vectorizer.pkl")

# Create FastAPI instance
app = FastAPI()


# Input schema
class TransactionInput(BaseModel):
    text: str


# Clean text function
def clean_text(text):

    text = str(text).lower()

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