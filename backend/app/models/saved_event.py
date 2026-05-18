from datetime import datetime
from app.models.user import db


class SavedEvent(db.Model):

    __tablename__ = 'saved_events'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False
    )

    external_event_id = db.Column(
        db.String(100),
        nullable=False
    )

    source = db.Column(
        db.String(50),
        nullable=False
    )

    event_name = db.Column(
        db.String(255),
        nullable=False
    )

    event_description = db.Column(
        db.Text
    )

    venue_name = db.Column(
        db.String(255)
    )

    venue_address = db.Column(
        db.String(500)
    )

    image_url = db.Column(
        db.String(500)
    )

    event_url = db.Column(
        db.String(500)
    )

    event_date = db.Column(
        db.String(100)
    )

    category = db.Column(
        db.String(100)
    )

    saved_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    __table_args__ = (
        db.UniqueConstraint(
            'user_id',
            'external_event_id',
            'source',
            name='unique_saved_event'
        ),
    )

    def to_dict(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'external_event_id': self.external_event_id,
            'source': self.source,
            'event_name': self.event_name,
            'event_description': self.event_description,
            'venue_name': self.venue_name,
            'venue_address': self.venue_address,
            'image_url': self.image_url,
            'event_url': self.event_url,
            'event_date': self.event_date,
            'category': self.category,
            'saved_at': self.saved_at.isoformat()
        }