from flask import Blueprint, request, jsonify, current_app
from app.models.user import db
from app.models.event import Event
from app.services.eventbrite import EventbriteService
from app.services.ticketmaster import TicketmasterService
from app.utils.mapper import map_eventbrite_events
from app.utils.ticketmaster_mapper import map_ticketmaster_events

events_bp = Blueprint('events', __name__)

@events_bp.route('/events/search', methods=['GET'])
def search_events():
    """
    Search events from:
    1. Your local database (user-created events)
    2. Eventbrite organization events
    3. Ticketmaster events
    """
    query = request.args.get('q', '').lower()
    location = request.args.get('location', '')
    source = request.args.get('source', 'all')

    try:
        all_events = []

        if source in ['all', 'local']:
            local_query = Event.query.filter_by(status='published')

            if query:
                local_query = local_query.filter(
                    db.or_(
                        Event.name.ilike(f'%{query}%'),
                        Event.description.ilike(f'%{query}%')
                    )
                )

            local_events = local_query.order_by(Event.start_date.asc()).all()
            all_events.extend([{**event.to_dict(), 'source': 'local'} for event in local_events])

        if source in ['all', 'eventbrite']:
            try:
                eb_service = EventbriteService()
                eventbrite_result = eb_service.get_organization_events()

                if eventbrite_result and 'events' in eventbrite_result:
                    eb_events = map_eventbrite_events(eventbrite_result)

                    if query:
                        eb_events = [e for e in eb_events
                                    if query in e.get('name', '').lower() or
                                       query in e.get('description', '').lower()]

                    all_events.extend([{**event, 'source': 'eventbrite'} for event in eb_events])
            except Exception as e:
                current_app.logger.error(f"Error fetching Eventbrite events: {str(e)}")

        if source in ['all', 'ticketmaster']:
            try:
                tm_service = TicketmasterService()
                ticketmaster_result = tm_service.search_events(
                    query=query,
                    location=location,
                    size=20
                )

                if ticketmaster_result:
                    tm_events = map_ticketmaster_events(ticketmaster_result)
                    all_events.extend([{**event, 'source': 'ticketmaster'} for event in tm_events])
            except Exception as e:
                current_app.logger.error(f"Error fetching Ticketmaster events: {str(e)}")

        return jsonify({
            'events': all_events,
            'total': len(all_events)
        }), 200

    except Exception as e:
        print(f"Error in search_events: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to fetch events',
            'details': str(e)
        }), 500

@events_bp.route('/events/<event_id>', methods=['GET'])
def get_event(event_id):
    """Get single event details - try local DB, then external APIs"""
    try:
        event_id_int = int(event_id)
        event = Event.query.get(event_id_int)
        if event:
            return jsonify({**event.to_dict(), 'source': 'local'}), 200
    except ValueError:
        pass

    try:
        tm_service = TicketmasterService()
        tm_event = tm_service.get_event(event_id)
        if tm_event:
            from app.utils.ticketmaster_mapper import map_ticketmaster_event
            mapped = map_ticketmaster_event(tm_event)
            return jsonify({**mapped, 'source': 'ticketmaster'}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching from Ticketmaster: {str(e)}")

    try:
        eb_service = EventbriteService()
        eb_event = eb_service.get_event(event_id)
        if eb_event:
            from app.utils.mapper import map_eventbrite_event
            mapped = map_eventbrite_event(eb_event)
            return jsonify({**mapped, 'source': 'eventbrite'}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching from Eventbrite: {str(e)}")

    return jsonify({'error': 'Event not found'}), 404

@events_bp.route('/events/eventbrite/<string:eventbrite_id>', methods=['GET'])
def get_eventbrite_event(eventbrite_id):
    """Get single event details from Eventbrite by Eventbrite ID"""
    try:
        service = EventbriteService()
        result = service.get_event(eventbrite_id)
        if not result:
            return jsonify({'error': 'Event not found on Eventbrite'}), 404
        event_data = map_eventbrite_events({'events': [result]})
        if event_data:
            return jsonify({**event_data[0], 'source': 'eventbrite'}), 200
        return jsonify({'error': 'Failed to parse event data'}), 500
    except Exception as e:
        print(f"Error in get_eventbrite_event: {str(e)}")
        return jsonify({'error': str(e)}), 500

@events_bp.route('/events/categories', methods=['GET'])
def get_categories():
    """Get all event categories"""
    try:
        categories = db.session.query(Event.category).distinct().all()
        return jsonify({
            'categories': [cat[0] for cat in categories if cat[0]]
        }), 200
    except Exception as e:
        print(f"Error in get_categories: {str(e)}")
        return jsonify({'error': str(e)}), 500
