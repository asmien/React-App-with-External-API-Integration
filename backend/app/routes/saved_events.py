from flask import (
    Blueprint,
    jsonify,
    request
)

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services.saved_event import (
    SavedEventService
)

from app.schemas.saved_event import (
    SavedEventSchema
)

saved_events_bp = Blueprint(
    'saved_events',
    __name__
)

saved_event_schema = SavedEventSchema()

saved_events_schema = SavedEventSchema(
    many=True
)


@saved_events_bp.route(
    '/saved-events',
    methods=['GET']
)
@jwt_required()
def get_saved_events():

    user_id = int(get_jwt_identity())

    events = (
        SavedEventService
        .get_saved_events(user_id)
    )

    return jsonify({
        'saved_events':
            saved_events_schema.dump(events),
        'total': len(events)
    }), 200


@saved_events_bp.route(
    '/saved-events',
    methods=['POST']
)
@jwt_required()
def save_event():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    errors = (
        saved_event_schema
        .validate(data)
    )

    if errors:
        return jsonify({
            'errors': errors
        }), 400

    saved_event, error = (
        SavedEventService
        .save_event(user_id, data)
    )

    if error:
        return jsonify({
            'error': error
        }), 409

    return jsonify({
        'message':
            'Event saved successfully',

        'saved_event':
            saved_event_schema.dump(
                saved_event
            )
    }), 201


@saved_events_bp.route(
    '/saved-events/<int:saved_event_id>',
    methods=['DELETE']
)
@jwt_required()
def unsave_event(saved_event_id):

    user_id = int(get_jwt_identity())

    deleted = (
        SavedEventService
        .unsave_event(
            user_id,
            saved_event_id
        )
    )

    if not deleted:
        return jsonify({
            'error':
                'Saved event not found'
        }), 404

    return jsonify({
        'message':
            'Saved event removed'
    }), 200