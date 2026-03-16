import os
import pandas as pd
import re
import string
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# =========================
# 1. Load Dataset
# =========================

DATA_PATH = "personal_finance_dataset_8000_extended.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# =========================
# 2. Select Columns
# =========================

df = df.dropna(subset=["Description", "Category"])

df = df.rename(columns={
    "Description": "text",
    "Category": "label"
})


# =========================
# 3. Clean Text
# =========================

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


df["text"] = df["text"].apply(clean_text)


# =========================
# 6. Features & Labels
# =========================

X = df["text"]
y = df["label"]


# =========================
# 7. Train Test Split
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# =========================
# 8. Vectorization
# =========================

vectorizer = TfidfVectorizer(
    max_features=15000,
    ngram_range=(1,2),
    stop_words="english",
    min_df=3,
    max_df=0.9
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)


# =========================
# 9. Train Model
# =========================

model = SGDClassifier(
    loss="log_loss",
    max_iter=5000,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train_vec, y_train)


# =========================
# 10. Evaluate Model
# =========================

y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("Model Evaluation")
print("==============================")

print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:\n")

print(classification_report(y_test, y_pred))


# =========================
# 11. Save Model
# =========================

os.makedirs("model_artifacts", exist_ok=True)

joblib.dump(model, "model_artifacts/model.pkl")
joblib.dump(vectorizer, "model_artifacts/vectorizer.pkl")

print("\n✅ Model and vectorizer saved successfully.")