import "./EventGrid.css";

import EventCard from "./EventCard";

import {
  Loader,
  ErrorState,
  EmptyState,
} from "./ui/StateViews";

function EventGrid({
  events,
  isLoading,
  error,
  hasMore,
  loadMore,
  loadingMore,
}) {

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
      />
    );
  }

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="events-section">

      <div className="event-grid">

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={false}
            toggleSave={() => {}}
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