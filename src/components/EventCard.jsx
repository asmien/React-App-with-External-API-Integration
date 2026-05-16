import React, { useState, useEffect } from 'react';
import EventbriteCheckoutButton from './EventbriteCheckoutButton';
import authService from '../services/authService';
import savedEventsService from '../services/savedEventsService';
import './style/EventCard.css';

const EventCard = ({ event, onClick, onSaveToggle, onToast, onCheckoutAuth }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedEventId, setSavedEventId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [event.id, event.source]);

  const checkIfSaved = async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const result = await savedEventsService.checkIfSaved(event.id, event.source);
      setIsSaved(result.is_saved);
      setSavedEventId(result.saved_event_id);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    
    if (!authService.isAuthenticated()) {
      alert('Please login to save events');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await savedEventsService.unsaveEvent(savedEventId);
        setIsSaved(false);
        setSavedEventId(null);
        if (onToast) onToast('Event removed from saved', 'info');
      } else {
        const result = await savedEventsService.saveEvent(event);
        setIsSaved(true);
        setSavedEventId(result.saved_event.id);
        if (onToast) onToast('Event saved!', 'success');
      }
      
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      console.error('Error toggling save:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.eventbrite-checkout-btn') || 
        e.target.closest('.ticketmaster-link-btn') ||
        e.target.closest('.favorite-btn') ||
        e.target.closest('.event-card__button')) {
      return;
    }
    onClick(event);
  };

  const {
    name,
    description,
    start_date,
    image_url,
    venue_name,
    venue_address,
    is_free,
    online_event,
    category,
    eventbrite_id,
    checkout_url,
    source,
    min_price,
    max_price,
    currency
  } = event;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canCheckout = source === 'eventbrite';
  const isTicketmaster = source === 'ticketmaster';
  const isLocal = source === 'local';

  const placeholderGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];

  const getPlaceholder = () => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return placeholderGradients[hash % placeholderGradients.length];
  };

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-card__image" style={!image_url ? { background: getPlaceholder() } : undefined}>
        {image_url ? (
          <img src={image_url} alt={name} />
        ) : (
          <div className="event-card__placeholder">
            <span className="placeholder-icon">🎪</span>
            <span className="placeholder-text">{name}</span>
          </div>
        )}
        {category && <span className="event-card__badge">{category}</span>}
        {source && (
          <span className={`source-badge source-${source}`}>
            {source === 'ticketmaster' ? '🎟️ Ticketmaster' : 
             source === 'eventbrite' ? '🎫 Eventbrite' : '🏠 Local'}
          </span>
        )}
        
        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
          disabled={saving}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="event-card__content">
        <h3 className="event-card__title">{name}</h3>
        
        <div className="event-card__date">
          📅 {formatDate(start_date)}
        </div>

        <div className="event-card__venue">
          {online_event ? (
            <>💻 Online Event</>
          ) : (
            <>📍 {venue_name || venue_address || 'Venue TBA'}</>
          )}
        </div>

        {description && (
          <p className="event-card__description">
            {description.substring(0, 100)}
            {description.length > 100 ? '...' : ''}
          </p>
        )}

        <div className="event-card__footer">
          <span className="event-card__price">
            {is_free ? 'FREE' : 
             min_price ? `${currency} ${min_price} - ${max_price}` :
             'Paid Event'}
          </span>
          
          {canCheckout ? (
            <EventbriteCheckoutButton 
              eventbriteId={eventbrite_id}
              eventUrl={checkout_url}
              isFree={is_free}
              className="event-card__button"
              onRequireAuth={onCheckoutAuth}
            />
          ) : isTicketmaster ? (
            <a 
              href={checkout_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="event-card__button ticketmaster-link-btn"
              onClick={(e) => e.stopPropagation()}
            >
              View on Ticketmaster →
            </a>
          ) : (
            <button className="event-card__button view-details-btn">
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
