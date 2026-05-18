from app.models.saved_event import SavedEvent

from app.repositories.saved_event import (
    SavedEventRepository
)


class SavedEventService:

    @staticmethod
    def get_saved_events(user_id):

        return (
            SavedEventRepository
            .get_user_saved_events(user_id)
        )

    @staticmethod
    def save_event(user_id, data):

        existing = (
            SavedEventRepository
            .find_existing(
                user_id=user_id,
                external_event_id=data.get(
                    'external_event_id'
                ),
                source=data.get('source')
            )
        )

        if existing:
            return None, 'Event already saved'

        saved_event = SavedEvent(
            user_id=user_id,

            external_event_id=data.get(
                'external_event_id'
            ),

            source=data.get('source'),

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

        saved = (
            SavedEventRepository
            .save_event(saved_event)
        )

        return saved, None

    @staticmethod
    def unsave_event(
        user_id,
        saved_event_id
    ):

        saved_event = (
            SavedEventRepository
            .get_saved_event_by_id(
                saved_event_id,
                user_id
            )
        )

        if not saved_event:
            return False

        (
            SavedEventRepository
            .delete_event(saved_event)
        )

        return True