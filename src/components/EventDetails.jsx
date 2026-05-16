import { useState, useEffect, useRef } from 'react';
import EventbriteCheckoutButton from './EventbriteCheckoutButton';
import './style/EventDetails.css';

const EventDetails = ({ eventId, eventSource, eventData, onClose }) => {
  const [event, setEvent] = useState(eventData);
  const [loading, setLoading] = useState(!eventData);
  const [error, setError] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch event');
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRef = useRef(fetchEventDetails);

  useEffect(() => {
    if (!eventData) {
      fetchRef.current();
    }
  }, [eventId, eventData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-loading">Loading event details...</div>
    </div>
  );

  if (error) return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-error">Error: {error}</div>
    </div>
  );

  if (!event) return null;

  const source = event.source || eventSource;
  const isEventbriteEvent = source === 'eventbrite';
  const isTicketmasterEvent = source === 'ticketmaster';
  const isLocalEvent = source === 'local';

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className={`event-source-badge badge-${source}`}>
          {isTicketmasterEvent && '🎟️ Ticketmaster Event'}
          {isEventbriteEvent && '🎫 Eventbrite Event'}
          {isLocalEvent && '🏠 Community Event'}
        </div>

         {event.image_url ? (
           <div className="event-details__hero">
             <img src={event.image_url} alt={event.name} />
           </div>
         ) : (
           <div className="event-details__hero event-details__hero--placeholder">
             <span className="placeholder-icon">🎪</span>
             <span className="placeholder-text">{event.name}</span>
           </div>
         )}

        <div className="event-details__content">
          {event.category && (
            <span className="event-details__category">{event.category}</span>
          )}

          <h1 className="event-details__title">{event.name}</h1>

          <div className="event-details__info">
            <div className="info-item">
              <span className="icon">📅</span>
              <div>
                <strong>Date & Time</strong>
                <p>{formatDate(event.start_date)}</p>
                {event.end_date && <p>to {formatDate(event.end_date)}</p>}
              </div>
            </div>

            <div className="info-item">
              <span className="icon">{event.online_event ? '💻' : '📍'}</span>
              <div>
                <strong>Location</strong>
                {event.online_event ? (
                  <p>Online Event</p>
                ) : (
                  <>
                    {event.venue_name && <p><strong>{event.venue_name}</strong></p>}
                    {event.venue_address && <p>{event.venue_address}</p>}
                    {event.venue_phone && <p>📞 {event.venue_phone}</p>}
                    {event.venue_capacity && <p>👥 Capacity: {event.venue_capacity.toLocaleString()}</p>}
                    {event.venue_url && (
                      <p>
                        <a href={event.venue_url} target="_blank" rel="noopener noreferrer">
                          Venue Website →
                        </a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {isTicketmasterEvent && event.artists && event.artists.length > 0 && (
              <div className="info-item">
                <span className="icon">🎤</span>
                <div>
                  <strong>Artists</strong>
                  <p>{event.artists.join(', ')}</p>
                </div>
              </div>
            )}

            {isTicketmasterEvent && event.genre && (
              <div className="info-item">
                <span className="icon">🎵</span>
                <div>
                  <strong>Genre</strong>
                  <p>{event.genre}</p>
                </div>
              </div>
            )}

            {isTicketmasterEvent && (event.min_price !== undefined || event.max_price !== undefined) && (
              <div className="info-item">
                <span className="icon">💰</span>
                <div>
                  <strong>Price Range</strong>
                  <p>
                    {event.currency || 'USD'} {event.min_price || 0} - {event.max_price || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="event-details__description">
            <h2>About this event</h2>
            <p>{event.description || 'No description provided.'}</p>
          </div>

          {!isTicketmasterEvent && event.tickets && event.tickets.length > 0 && (
            <div className="event-details__tickets">
              <h2>Tickets</h2>
              <div className="tickets-list">
                {event.tickets.map((ticket, index) => (
                  <div key={ticket.id || index} className="ticket-item">
                    <div className="ticket-info">
                      <h3>{ticket.name}</h3>
                      {ticket.description && <p>{ticket.description}</p>}
                      {ticket.quantity_available !== undefined && (
                        <div className="ticket-availability">
                          {ticket.quantity_available} / {ticket.quantity_total} available
                        </div>
                      )}
                    </div>
                    <div className="ticket-price">
                      {ticket.price === 0 ? (
                        <span className="free">FREE</span>
                      ) : (
                        <span className="price">
                          {event.currency || 'KES'} {ticket.price?.toFixed(2) || '0.00'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="event-details__action">
            {isEventbriteEvent ? (
              <EventbriteCheckoutButton
                eventbriteId={event.eventbrite_id}
                eventUrl={event.checkout_url || event.url}
                isFree={event.is_free}
                className="checkout-btn-large"
              />
            ) : isTicketmasterEvent ? (
              <div className="ticketmaster-cta">
                <p className="cta-message">🎟️ Get tickets for this event on Ticketmaster</p>
                <a
                  href={event.checkout_url || event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ticketmaster-button"
                >
                  View on Ticketmaster →
                </a>
              </div>
            ) : (
              <div className="no-checkout-message">
                <p>🎉 This is a community event. Contact the organizer for attendance details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
