from datetime import datetime
from app.models.user import db

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    eventbrite_id = db.Column(db.String(50), unique=True, nullable=True)  # Only for checkout
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Event Details
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    
    # Date & Time
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    timezone = db.Column(db.String(50), default='Africa/Nairobi')
    
    # Location
    venue_name = db.Column(db.String(255))
    venue_address = db.Column(db.String(500))
    online_event = db.Column(db.Boolean, default=False)
    
    # Media
    image_url = db.Column(db.String(500))
    
    # Pricing
    is_free = db.Column(db.Boolean, default=False)
    currency = db.Column(db.String(10), default='KES')
    
    # Capacity
    capacity = db.Column(db.Integer, default=100)
    
    # Status
    status = db.Column(db.String(20), default='draft')  # draft, published, cancelled
    
    # Eventbrite URL (for checkout only)
    checkout_url = db.Column(db.String(500))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tickets = db.relationship('Ticket', backref='event', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert event to dictionary"""
        return {
            'id': self.id,
            'eventbrite_id': self.eventbrite_id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'timezone': self.timezone,
            'venue_name': self.venue_name,
            'venue_address': self.venue_address,
            'online_event': self.online_event,
            'image_url': self.image_url,
            'is_free': self.is_free,
            'currency': self.currency,
            'capacity': self.capacity,
            'status': self.status,
            'checkout_url': self.checkout_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'tickets': [ticket.to_dict() for ticket in self.tickets]
        }

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    eventbrite_ticket_id = db.Column(db.String(50))
    
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, default=0.0)
    quantity_total = db.Column(db.Integer, default=100)
    quantity_sold = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'quantity_total': self.quantity_total,
            'quantity_sold': self.quantity_sold,
            'quantity_available': self.quantity_total - self.quantity_sold
        }