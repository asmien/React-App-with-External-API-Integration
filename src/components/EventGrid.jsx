import "./EventGrid.css";
import EventCard from "./EventCard";

import {
  Loader,
  ErrorState,
  EmptyState,
} from "./ui/StateViews";

function EventGrid({
  events,
  loading,
  error,
  hasMore,
  loadMore,
  loadingMore,
  regionLabel,
  categoryLabel,
}) {

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState message={error} />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        regionLabel={regionLabel}
        categoryLabel={categoryLabel}
      />
    );
  }

  return (
    <section className="events-section">

      <div className="event-grid">

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}

      </div>

      {hasMore && (
        <div className="load-more-wrapper">

          <button
            className="load-more-btn"
            onClick={loadMore}
            disabled={loadingMore}
          >

            {loadingMore
              ? "Loading..."
              : "Load More Events"}

          </button>

        </div>
      )}

    </section>
  );
}

export default EventGrid;