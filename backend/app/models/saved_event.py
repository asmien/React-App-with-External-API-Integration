from datetime import datetime
from app.models.user import db

class SavedEvent(db.Model):
    __tablename__ = 'saved_events'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Store reference to event (could be local, eventbrite, or ticketmaster)
    event_id = db.Column(db.String(100), nullable=False)  # Can be int or string
    event_source = db.Column(db.String(50), nullable=False)  # 'local', 'eventbrite', 'ticketmaster'
    
    # Cache event data for quick display
    event_name = db.Column(db.String(255))
    event_image = db.Column(db.String(500))
    event_date = db.Column(db.DateTime)
    
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint: user can only save an event once
    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', 'event_source', name='unique_user_event'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'event_source': self.event_source,
            'event_name': self.event_name,
            'event_image': self.event_image,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'saved_at': self.saved_at.isoformat()
        }
