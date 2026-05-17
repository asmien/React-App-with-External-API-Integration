import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000/api"

# Login first
login_data = {"email": "test@example.com", "password": "password123"}
response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
token = response.json()['access_token']

headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Sample events
events = [
    {
        "name": "Music Festival 2026",
        "description": "Amazing outdoor music festival",
        "category": "Music",
        "start_date": (datetime.now() + timedelta(days=14)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=14, hours=8)).isoformat(),
        "venue_name": "Uhuru Gardens",
        "online_event": False,
        "is_free": False,
        "tickets": [{"name": "VIP", "price": 5000, "quantity": 50}]
    },
    {
        "name": "Startup Pitch Night",
        "description": "Watch entrepreneurs pitch their ideas",
        "category": "Business",
        "start_date": (datetime.now() + timedelta(days=5)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=5, hours=2)).isoformat(),
        "venue_name": "Nailab",
        "online_event": False,
        "is_free": True,
        "tickets": [{"name": "Free Entry", "price": 0, "quantity": 100}]
    },
    {
        "name": "Virtual AI Workshop",
        "description": "Learn AI and Machine Learning online",
        "category": "Education",
        "start_date": (datetime.now() + timedelta(days=3)).isoformat(),
        "end_date": (datetime.now() + timedelta(days=3, hours=4)).isoformat(),
        "online_event": True,
        "is_free": False,
        "tickets": [{"name": "Workshop Access", "price": 2000, "quantity": 200}]
    }
]

for event in events:
    response = requests.post(f"{BASE_URL}/user/events", json=event, headers=headers)
    print(f"Created: {event['name']} - Status: {response.status_code}")

print("\n✅ Sample events created! Check your frontend.")