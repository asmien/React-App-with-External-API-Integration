// src/components/EventCard.jsx
export function EventCard({ event, onSave, isSaved }) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop';

  return (
    <article className="event-card">
      <img
        src={event.image || fallbackImage}
        alt={event.title}
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />

      <div className="event-card-content">
        <p>
          {event.date}
          {event.time ? ` • ${event.time}` : ''}
        </p>

        <h2>{event.title}</h2>
        <p>{event.venue}</p>

        <p>
          {event.city}
          {event.country ? ` • ${event.country}` : ''}
        </p>

        <p>
          {event.segment}
          {event.genre ? ` • ${event.genre}` : ''}
        </p>

        {event.priceMin !== null && event.priceMax !== null && (
          <p>
            {event.currency} {event.priceMin} - {event.priceMax}
          </p>
        )}

        <div className="event-card-actions">
          <a href={event.url} target="_blank" rel="noreferrer">
            View Event
          </a>
          <button onClick={() => onSave(event)}>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  );
}