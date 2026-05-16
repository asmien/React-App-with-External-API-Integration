import "./style/EventGrid.css";

import EventCard from "./EventCard";

function EventGrid({ events, onEventClick, onToast, onCheckoutAuth }) {
  return (
    <section className="events-section">
      <div className="event-grid">
        {events.map((event) => (
          <EventCard
            key={event.id || event.name}
            event={event}
            onClick={onEventClick}
            onToast={onToast}
            onCheckoutAuth={onCheckoutAuth}
          />
        ))}
      </div>
    </section>
  );
}

export default EventGrid;
