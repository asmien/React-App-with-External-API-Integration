export function Loader() {
  return (
    <div className="state-view">

      <div className="loader-spinner"></div>

      <p>Loading live events...</p>

    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="state-view error-state">

      <h3>Something went wrong</h3>

      <p>{message}</p>

    </div>
  );
}

export function EmptyState({
  regionLabel,
  categoryLabel,
}) {

  return (
    <div className="state-view">

      <h3>No events found</h3>

      <p>
        We couldn't find any events
        {regionLabel
          ? ` in ${regionLabel}`
          : ""}
        {categoryLabel
          ? ` for ${categoryLabel}`
          : ""}.
      </p>

      <span>
        Try changing your filters or search keyword.
      </span>

    </div>
  );
}