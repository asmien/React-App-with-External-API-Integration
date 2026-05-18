from app.models.user import db
from app.models.saved_event import SavedEvent


class SavedEventRepository:

    @staticmethod
    def get_user_saved_events(user_id):

        return SavedEvent.query.filter_by(
            user_id=user_id
        ).order_by(
            SavedEvent.saved_at.desc()
        ).all()

    @staticmethod
    def find_existing(
        user_id,
        external_event_id,
        source
    ):

        return SavedEvent.query.filter_by(
            user_id=user_id,
            external_event_id=external_event_id,
            source=source
        ).first()

    @staticmethod
    def save_event(saved_event):

        db.session.add(saved_event)
        db.session.commit()

        return saved_event

    @staticmethod
    def delete_event(saved_event):

        db.session.delete(saved_event)
        db.session.commit()

    @staticmethod
    def get_saved_event_by_id(
        saved_event_id,
        user_id
    ):

        return SavedEvent.query.filter_by(
            id=saved_event_id,
            user_id=user_id
        ).first()