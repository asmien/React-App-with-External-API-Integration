import requests
from flask import current_app

class EventbriteService:
    """Service for Eventbrite API interactions"""
    
    def __init__(self):
        self.token = current_app.config['EVENTBRITE_PRIVATE_TOKEN']
        self.org_id = current_app.config['EVENTBRITE_ORG_ID']
        self.base_url = current_app.config['EVENTBRITE_API_BASE']
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
    
    def search_events(self, query=None, location=None, page=1):
        """Get events from your organization (and public events if available)"""
        # Get organization events instead of global search
        url = f"{self.base_url}/organizations/{self.org_id}/events/"
        
        params = {
            'page': page,
            'expand': 'venue,ticket_availability',
            'status': 'live,started,ended'  # Get all event statuses
        }
        
        # Note: Organization endpoint doesn't support 'q' or 'location' filters
        # We'll filter on the frontend or add filtering logic here
            
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Client-side filtering if query provided
            events = data.get('events', [])
            if query:
                query_lower = query.lower()
                events = [e for e in events 
                         if query_lower in e.get('name', {}).get('text', '').lower() or
                            query_lower in e.get('description', {}).get('text', '').lower()]
            
            return {
                'events': events,
                'pagination': data.get('pagination', {})
            }
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Eventbrite API error: {str(e)}")
            return None
    
    def get_event(self, event_id):
        """Get single event details"""
        url = f"{self.base_url}/events/{event_id}/"
        
        params = {'expand': 'venue,ticket_availability,category,subcategory'}
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error fetching event: {str(e)}")
            return None
    
    def create_event(self, event_data):
        """Create a new event under the organization"""
        url = f"{self.base_url}/organizations/{self.org_id}/events/"
        
        payload = {
            "event": {
                "name": {"html": event_data['name']},
                "description": {"html": event_data.get('description', '')},
                "start": {
                    "timezone": event_data.get('timezone', 'Africa/Nairobi'),
                    "utc": event_data['start_date']
                },
                "end": {
                    "timezone": event_data.get('timezone', 'Africa/Nairobi'),
                    "utc": event_data['end_date']
                },
                "currency": event_data.get('currency', 'KES'),
                "online_event": event_data.get('online_event', False),
                "listed": True,
                "shareable": True,
                "capacity": event_data.get('capacity', 100)
            }
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error creating event: {str(e)}")
            return None
    
    def create_ticket_class(self, event_id, ticket_data):
        """Create ticket types for an event"""
        url = f"{self.base_url}/events/{event_id}/ticket_classes/"
        
        payload = {
            "ticket_class": {
                "name": ticket_data['name'],
                "quantity_total": ticket_data.get('quantity', 100),
                "cost": f"KES {ticket_data.get('price', 0)}.00",
                "free": ticket_data.get('price', 0) == 0
            }
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error creating ticket: {str(e)}")
            return None
    
    def publish_event(self, event_id):
        """Publish an event to make it live"""
        url = f"{self.base_url}/events/{event_id}/publish/"

        try:
            response = requests.post(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error publishing event: {str(e)}")
            return None

    def get_organization_events(self):
        """Get all events from your organization"""
        url = f"{self.base_url}/organizations/{self.org_id}/events/"

        params = {
            'expand': 'venue,ticket_availability',
            'status': 'live'
        }

        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error fetching org events: {str(e)}")
            return None