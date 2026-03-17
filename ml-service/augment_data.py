import pandas as pd
import random
from datetime import datetime

DATA_PATH = "personal_finance_dataset_8000_extended.csv"
df = pd.read_csv(DATA_PATH)

# Natural language templates for augmentation
augmentation_data = [
    # Food
    ("Lunch at office cafeteria", "Food"),
    ("Dinner with friends at pizza hut", "Food"),
    ("Ordered biryani from Zomato", "Food"),
    ("Morning coffee and snack", "Food"),
    ("Restaurant bill for family dinner", "Food"),
    ("Burger and fries", "Food"),
    ("Samosa and tea", "Food"),
    ("Breakfast at hotel", "Food"),
    
    # Bills
    ("Monthly electricity bill payment", "Bills"),
    ("Airtel broadband bill", "Bills"),
    ("Water bill for March", "Bills"),
    ("Gas cylinder booking", "Bills"),
    ("Mobile recharge for father", "Bills"),
    ("Property tax online payment", "Bills"),
    ("Credit card bill payment", "Bills"),
    ("Internet bill", "Bills"),
    
    # Healthcare
    ("Doctor consultation fee", "Healthcare"),
    ("Bought medicines from pharmacy", "Healthcare"),
    ("Pathology lab test charges", "Healthcare"),
    ("Dental checkup", "Healthcare"),
    ("Eye clinic visit", "Healthcare"),
    ("Bought vitamins and supplements", "Healthcare"),
    ("Hospital bill", "Healthcare"),
    
    # Transport
    ("Uber ride to airport", "Transport"),
    ("Ola cab for commute", "Transport"),
    ("Petrol for car", "Transport"),
    ("Diesel for generator", "Transport"),
    ("Metro card recharge", "Transport"),
    ("Auto rickshaw fare", "Transport"),
    ("Rapido bike taxi", "Transport"),
    ("Bus ticket fare", "Transport"),
    
    # Grocery
    ("Weekly groceries from BigBazaar", "Grocery"),
    ("Bought milk and bread", "Grocery"),
    ("Fruits and vegetables from market", "Grocery"),
    ("Reliance Fresh shopping", "Grocery"),
    ("Kirana store bill", "Grocery"),
    ("Supermarket items", "Grocery"),
    ("Household supplies", "Grocery"),
    
    # Online Shopping
    ("Amazon order for shoes", "Online Shopping"),
    ("Flipkart shopping", "Online Shopping"),
    ("Bought headphones from Myntra", "Online Shopping"),
    ("Ajio clothing order", "Online Shopping"),
    ("Online purchase from Snapdeal", "Online Shopping"),
    
    # Clothing
    ("Bought a new shirt from Zara", "Clothing"),
    ("Levi's jeans purchase", "Clothing"),
    ("Shoes from Adidas store", "Clothing"),
    ("T-shirt and jacket", "Clothing"),
    ("Clothing shopping at Mall", "Clothing"),
    
    # Electronics
    ("Bought a laptop from Dell", "Electronics"),
    ("Mobile phone at Apple Store", "Electronics"),
    ("Electronic gadgets purchase", "Electronics"),
    ("Television and speakers", "Electronics"),
    ("Camera accessories", "Electronics"),

    # Entertainment
    ("Movie tickets for weekend", "Entertainment"),
    ("Netflix monthly subscription", "Entertainment"),
    ("Spotify premium", "Entertainment"),
    ("Hotstar VIP subscription", "Entertainment"),
    ("Game credits purchase", "Entertainment"),
    ("Concert tickets", "Entertainment"),

    # Travel
    ("Flight ticket to Delhi", "Travel"),
    ("Train booking IRCTC", "Travel"),
    ("Hotel stay in Mumbai", "Travel"),
    ("Vistara flight booking", "Travel"),
    ("Bus booking RedBus", "Travel"),
    ("Vacation expenses", "Travel")
]

# Generate multiple variations
new_rows = []
for _ in range(500):
    desc, cat = random.choice(augmentation_data)
    # Randomly add amounts based on category
    if cat in ["Electronics", "Travel"]:
        amount = random.uniform(5000, 50000)
    elif cat in ["Bills", "Clothing", "Online Shopping"]:
        amount = random.uniform(500, 10000)
    else:
        amount = random.uniform(50, 2000)
        
    new_rows.append({
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Description": desc,
        "Amount": round(amount, 2),
        "Category": cat,
        "PaymentMethod": random.choice(["UPI", "Debit Card", "Credit Card", "Net Banking"]),
        "Location": random.choice(["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"]),
        "AccountType": "Savings",
        "TransactionType": "Debit",
        "DeviceUsed": "Mobile",
        "Currency": "INR",
        "MerchantType": "Various",
        "LoyaltyProgram": "No",
        "Weekday": "Various",
        "Month": "Various",
        "TimeOfDay": "Various"
    })

new_df = pd.DataFrame(new_rows)
updated_df = pd.concat([df, new_df], ignore_index=True)

updated_df.to_csv(DATA_PATH, index=False)
print(f"Added {len(new_rows)} augmented rows to {DATA_PATH}")
