import joblib
import re
import string

# Load trained model
model = joblib.load("model_artifacts/model.pkl")
vectorizer = joblib.load("model_artifacts/vectorizer.pkl")

def clean_text(text):
    text = str(text).lower()
    noise = ["transaction at", "payment to", "spent on", "order at", "upi", "pos", "term", "ref", "imps", "neft", "transfer"]
    for n in noise:
        text = text.replace(n, "")
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text).strip()
    return text

test_cases = [
    "Lunch at Subway",
    "Bought a shirt from Zara",
    "Paid for monthly electricity bill",
    "Netflix subscription",
    "Uber ride across town",
    "Bought groceries at BigBazaar",
    "Bought an iPhone at Apple Store",
    "Doctor consultation fee",
    "Flight to Mumbai via IndiGo"
]

for tc in test_cases:
    cleaned = clean_text(tc)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]
    prob = model.predict_proba(vector).max()
    print(f"Input: {tc} | Cleaned: {cleaned} | Pred: {prediction} | Confidence: {prob:.4f}")
