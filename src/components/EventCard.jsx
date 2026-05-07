import "./EventCard.css";

function EventCard({ event }) {

  return (
    <article className="event-card">

      <div className="event-image-wrapper">

        <img
          src={event.image}
          alt={event.title}
          className="event-image"
        />

        <div className={`event-status ${event.status}`}>
          {event.status}
        </div>

      </div>

      <div className="event-content">

        <div className="event-tags">

          {event.segment && (
            <span className="event-tag">
              {event.segment}
            </span>
          )}

          {event.genre && (
            <span className="event-tag secondary">
              {event.genre}
            </span>
          )}

        </div>

        <h3>{event.title}</h3>

        <div className="event-meta">

          <p>
             {event.date}
            {event.time && ` • ${event.time}`}
          </p>

          <p>
             {event.venue}
          </p>

          <p>
            {event.city}
            {event.country && `, ${event.country}`}
          </p>

        </div>

        {(event.priceMin || event.priceMax) && (
          <p className="event-price">

            {event.currency}

            {" "}

            {event.priceMin}

            {event.priceMax &&
              ` - ${event.priceMax}`}

          </p>
        )}

        <div className="event-actions">

          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="ticket-btn"
          >
            Get Tickets
          </a>

          <button className="save-btn">
            Save
          </button>

        </div>

      </div>

    </article>
  );
}

export default EventCard;