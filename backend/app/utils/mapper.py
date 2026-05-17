def map_eventbrite_event(event):
    """Transform Eventbrite event to consistent format"""
    eventbrite_id = event.get('id', '')

    # Try logo first, then fallback to original image
    image_url = None
    logo = event.get('logo')
    if logo:
        image_url = logo.get('url')
    if not image_url:
        original = event.get('original')
        if original:
            image_url = original.get('url')

    return {
        'id': eventbrite_id,
        'eventbrite_id': eventbrite_id,
        'name': event.get('name', {}).get('text', ''),
        'description': event.get('description', {}).get('text', ''),
        'start_date': event.get('start', {}).get('local'),
        'end_date': event.get('end', {}).get('local'),
        'url': event.get('url'),
        'checkout_url': event.get('url'),
        'image_url': image_url,
        'venue_name': event.get('venue', {}).get('name') if event.get('venue') else None,
        'venue_address': event.get('venue', {}).get('address', {}).get('localized_address_display') if event.get('venue') else None,
        'online_event': event.get('online_event', False),
        'currency': event.get('currency'),
        'is_free': event.get('is_free', False),
        'category': event.get('category', {}).get('name') if event.get('category') else None,
        'capacity': event.get('capacity'),
        'tickets': []
    }

def map_eventbrite_events(events_response):
    """Transform list of Eventbrite events"""
    if not events_response or 'events' not in events_response:
        return []
    
    return [map_eventbrite_event(event) for event in events_response['events']]