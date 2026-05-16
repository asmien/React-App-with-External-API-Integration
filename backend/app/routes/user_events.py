from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.services.eventbrite import EventbriteService
from app.models.user import db
from app.models.event import Event, Ticket
from datetime import datetime

user_events_bp = Blueprint('user_events', __name__)

@user_events_bp.route('/events', methods=['POST'])
@token_required
def create_event(current_user):
    """Create event in YOUR database + Eventbrite organization"""
    data = request.get_json()

    required = ['name', 'start_date', 'end_date']
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields: name, start_date, end_date'}), 400

    try:
        # 1. Create event in YOUR database first (as draft)
        new_event = Event(
            user_id=current_user.id,
            name=data['name'],
            description=data.get('description', ''),
            category=data.get('category', 'Other'),
            start_date=datetime.fromisoformat(data['start_date'].replace('Z', '+00:00')),
            end_date=datetime.fromisoformat(data['end_date'].replace('Z', '+00:00')),
            timezone=data.get('timezone', 'Africa/Nairobi'),
            venue_name=data.get('venue_name'),
            venue_address=data.get('venue_address'),
            online_event=data.get('online_event', False),
            image_url=data.get('image_url'),
            is_free=data.get('is_free', False),
            currency=data.get('currency', 'KES'),
            capacity=data.get('capacity', 100),
            status='draft'
        )

        db.session.add(new_event)
        db.session.flush()

        # 2. Add tickets to YOUR database
        if 'tickets' in data:
            for ticket_data in data['tickets']:
                ticket = Ticket(
                    event_id=new_event.id,
                    name=ticket_data['name'],
                    description=ticket_data.get('description'),
                    price=float(ticket_data.get('price', 0)),
                    quantity_total=int(ticket_data.get('quantity', 100))
                )
                db.session.add(ticket)

        # 3. Create on Eventbrite
        service = EventbriteService()
        eventbrite_event = service.create_event(data)

        if eventbrite_event:
            eventbrite_id = eventbrite_event.get('id')
            new_event.eventbrite_id = eventbrite_id
            new_event.checkout_url = eventbrite_event.get('url')

            # 4. Create tickets on Eventbrite
            if 'tickets' in data:
                for ticket_data in data['tickets']:
                    service.create_ticket_class(eventbrite_id, ticket_data)

            # 5. Publish on Eventbrite
            service.publish_event(eventbrite_id)

        # 6. Publish on YOUR platform
        new_event.status = 'published'
        db.session.commit()

        return jsonify({
            'message': 'Event created successfully',
            'event': new_event.to_dict(),
            'eventbrite_url': new_event.checkout_url
        }), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@user_events_bp.route('/events/my', methods=['GET'])
@token_required
def get_my_events(current_user):
    """Get all events created by current user"""
    events = Event.query.filter_by(user_id=current_user.id).order_by(Event.created_at.desc()).all()

    return jsonify({
        'events': [event.to_dict() for event in events],
        'total': len(events)
    }), 200

@user_events_bp.route('/events/<int:event_id>', methods=['PUT'])
@token_required
def update_event(current_user, event_id):
    """Update event (only if user owns it)"""
    event = Event.query.get(event_id)

    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if event.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()

    if 'name' in data:
        event.name = data['name']
    if 'description' in data:
        event.description = data['description']
    if 'image_url' in data:
        event.image_url = data['image_url']
    if 'category' in data:
        event.category = data['category']

    event.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'message': 'Event updated successfully',
        'event': event.to_dict()
    }), 200

@user_events_bp.route('/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    """Delete event (only if user owns it)"""
    event = Event.query.get(event_id)

    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if event.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(event)
    db.session.commit()

    return jsonify({'message': 'Event deleted successfully'}), 200
