from app.models.saved_event import (
    SavedEvent
)

from app.models.user import db


class SavedEventService:

    @staticmethod
    def get_saved_events(user_id):

        return (
            SavedEvent.query
            .filter_by(
                user_id=int(user_id)
            )
            .order_by(
                SavedEvent.saved_at.desc()
            )
            .all()
        )

    @staticmethod
    def save_event(
        user_id,
        data
    ):

        existing = (
            SavedEvent.query
            .filter_by(
                user_id=int(user_id),
                external_event_id=data.get(
                    'external_event_id'
                ),
                source=data.get(
                    'source'
                )
            )
            .first()
        )

        if existing:
            return (
                None,
                'Event already saved'
            )

        saved_event = SavedEvent(

            user_id=int(user_id),

            external_event_id=data.get(
                'external_event_id'
            ),

            source=data.get(
                'source'
            ),

            event_name=data.get(
                'event_name'
            ),

            event_description=data.get(
                'event_description'
            ),

            venue_name=data.get(
                'venue_name'
            ),

            venue_address=data.get(
                'venue_address'
            ),

            image_url=data.get(
                'image_url'
            ),

            event_url=data.get(
                'event_url'
            ),

            event_date=data.get(
                'event_date'
            ),

            category=data.get(
                'category'
            )
        )

        db.session.add(
            saved_event
        )

        db.session.commit()

        return (
            saved_event,
            None
        )

    @staticmethod
    def unsave_event(
        user_id,
        saved_event_id
    ):

        saved_event = (
            SavedEvent.query
            .filter_by(
                id=saved_event_id,
                user_id=int(user_id)
            )
            .first()
        )

        if not saved_event:
            return False

        db.session.delete(
            saved_event
        )

        db.session.commit()

        return True