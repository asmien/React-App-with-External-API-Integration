import requests
from dotenv import load_dotenv
import os

load_dotenv()

token = os.getenv('EVENTBRITE_PRIVATE_TOKEN')
print(f"Token loaded: {token[:10]}..." if token else "❌ Token not found!")

url = "https://www.eventbriteapi.com/v3/events/search/"
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

params = {
    'q': 'music',
    'page': 1
}

print(f"\n🔍 Testing Eventbrite API...")
print(f"URL: {url}")
print(f"Params: {params}\n")

response = requests.get(url, headers=headers, params=params)

print(f"Status Code: {response.status_code}")
print(f"Response:\n{response.text[:500]}")  # First 500 chars

if response.status_code == 200:
    data = response.json()
    print(f"\n✅ Success! Found {len(data.get('events', []))} events")
    if data.get('events'):
        print(f"First event: {data['events'][0].get('name', {}).get('text')}")
else:
    print(f"\n❌ Error: {response.status_code}")
    print(response.json())