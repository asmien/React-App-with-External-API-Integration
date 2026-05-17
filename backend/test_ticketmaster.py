from app import create_app
from app.services.ticketmaster import TicketmasterService

app = create_app()

with app.app_context():
    print("Testing Ticketmaster API...\n")
    
    # Check if API key is loaded
    api_key = app.config.get('TICKETMASTER_API_KEY')
    print(f"API Key loaded: {api_key[:10] if api_key else 'NOT FOUND'}...\n")
    
    if not api_key:
        print("❌ ERROR: TICKETMASTER_API_KEY not found in config!")
        print("Make sure it's in your .env file")
        exit()
    
    # Try to fetch events
    service = TicketmasterService()
    result = service.search_events(query='music', size=5)
    
    if result:
        print(f"✅ Success! Response keys: {result.keys()}\n")
        
        if '_embedded' in result and 'events' in result['_embedded']:
            events = result['_embedded']['events']
            print(f"Found {len(events)} events:\n")
            
            for event in events[:3]:
                print(f"- {event.get('name')}")
                print(f"  ID: {event.get('id')}")
                print(f"  URL: {event.get('url')}\n")
        else:
            print(f"⚠️ No events found in response")
            print(f"Response: {result}\n")
    else:
        print("❌ Failed to fetch events from Ticketmaster")
