def map_ticketmaster_event(event):
    """Transform Ticketmaster event to consistent format with full details"""
    images = event.get('images', [])
    image_url = images[0].get('url') if images else None

    venues = event.get('_embedded', {}).get('venues', [])
    venue = venues[0] if venues else {}

    classifications = event.get('classifications', [])
    classification = classifications[0] if classifications else {}
    segment = classification.get('segment', {})
    genre = classification.get('genre', {})
    subgenre = classification.get('subGenre', {})

    price_ranges = event.get('priceRanges', [])
    price_info = price_ranges[0] if price_ranges else {}

    # Extract full venue address
    venue_address_parts = []
    if venue.get('address', {}).get('line1'):
        venue_address_parts.append(venue['address']['line1'])
    if venue.get('address', {}).get('line2'):
        venue_address_parts.append(venue['address']['line2'])
    if venue.get('city', {}).get('name'):
        venue_address_parts.append(venue['city']['name'])
    if venue.get('state', {}).get('stateCode'):
        venue_address_parts.append(venue['state']['stateCode'])
    if venue.get('postalCode'):
        venue_address_parts.append(venue['postalCode'])
    
    full_venue_address = ', '.join(venue_address_parts)

    # Extract attractions (artists)
    attractions = event.get('_embedded', {}).get('attractions', [])
    artists = [att.get('name') for att in attractions] if attractions else []

    # Extract promoter info
    promoter = event.get('promoter', {})

    return {
        'id': event.get('id'),
        'ticketmaster_id': event.get('id'),
        'name': event.get('name'),
        'description': event.get('info') or event.get('pleaseNote') or '',
        'start_date': event.get('dates', {}).get('start', {}).get('dateTime'),
        'end_date': None,
        'url': event.get('url'),
        'checkout_url': event.get('url'),  # Only used when user clicks in modal
        'image_url': image_url,
        'venue_name': venue.get('name', 'TBD'),
        'venue_address': full_venue_address or 'Address TBD',
        'venue_city': venue.get('city', {}).get('name'),
        'venue_state': venue.get('state', {}).get('stateCode'),
        'venue_country': venue.get('country', {}).get('countryCode'),
        'venue_postal_code': venue.get('postalCode'),
        'venue_phone': venue.get('phoneNumber'),
        'venue_url': venue.get('url'),
        'venue_capacity': venue.get('capacity'),
        'online_event': False,
        'currency': price_info.get('currency', 'USD'),
        'is_free': not bool(price_info),
        'category': segment.get('name', 'Entertainment'),
        'genre': genre.get('name'),
        'subgenre': subgenre.get('name'),
        'min_price': price_info.get('min'),
        'max_price': price_info.get('max'),
        'artists': artists,
        'promoter_name': promoter.get('name'),
        'status': event.get('status'),
        'tickets': []
    }


def map_ticketmaster_events(ticketmaster_response):
    """Transform list of Ticketmaster events"""
    if not ticketmaster_response or '_embedded' not in ticketmaster_response:
        return []

    events = ticketmaster_response['_embedded'].get('events', [])
    return [map_ticketmaster_event(event) for event in events]
