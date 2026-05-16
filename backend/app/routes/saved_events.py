from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.models.user import db
from app.models.saved_event import SavedEvent
from datetime import datetime

saved_events_bp = Blueprint('saved_events', __name__)

@saved_events_bp.route('/saved-events', methods=['GET'])
@token_required
def get_saved_events(current_user):
    """Get all saved events for current user"""
    saved = SavedEvent.query.filter_by(user_id=current_user.id).order_by(SavedEvent.saved_at.desc()).all()
    
    return jsonify({
        'saved_events': [s.to_dict() for s in saved],
        'total': len(saved)
    }), 200

@saved_events_bp.route('/saved-events', methods=['POST'])
@token_required
def save_event(current_user):
    """Save an event to favorites"""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['event_id', 'event_source']):
        return jsonify({'error': 'Missing event_id or event_source'}), 400
    
    # Check if already saved
    existing = SavedEvent.query.filter_by(
        user_id=current_user.id,
        event_id=str(data['event_id']),
        event_source=data['event_source']
    ).first()
    
    if existing:
        return jsonify({'error': 'Event already saved'}), 400
    
    # Create saved event
    saved_event = SavedEvent(
        user_id=current_user.id,
        event_id=str(data['event_id']),
        event_source=data['event_source'],
        event_name=data.get('event_name'),
        event_image=data.get('event_image'),
        event_date=datetime.fromisoformat(data['event_date'].replace('Z', '+00:00')) if data.get('event_date') else None
    )
    
    db.session.add(saved_event)
    db.session.commit()
    
    return jsonify({
        'message': 'Event saved successfully',
        'saved_event': saved_event.to_dict()
    }), 201

@saved_events_bp.route('/saved-events/<int:saved_event_id>', methods=['DELETE'])
@token_required
def unsave_event(current_user, saved_event_id):
    """Remove event from favorites"""
    saved_event = SavedEvent.query.get(saved_event_id)
    
    if not saved_event:
        return jsonify({'error': 'Saved event not found'}), 404
    
    if saved_event.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(saved_event)
    db.session.commit()
    
    return jsonify({'message': 'Event removed from favorites'}), 200

@saved_events_bp.route('/saved-events/check/<event_source>/<event_id>', methods=['GET'])
@token_required
def check_if_saved(current_user, event_source, event_id):
    """Check if an event is saved by the user"""
    saved = SavedEvent.query.filter_by(
        user_id=current_user.id,
        event_id=event_id,
        event_source=event_source
    ).first()
    
    return jsonify({
        'is_saved': saved is not None,
        'saved_event_id': saved.id if saved else None
    }), 200
