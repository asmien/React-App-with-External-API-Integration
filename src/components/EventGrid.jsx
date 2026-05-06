// src/components/EventGrid.jsx
import { EventCard } from './EventCard';

export function EventGrid({ events = [], savedEvents = [], onSave }) {
  return (
    <section className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSave={onSave}
          isSaved={savedEvents.some((item) => item.id === event.id)}
        />
      ))}
    </section>
  );
}