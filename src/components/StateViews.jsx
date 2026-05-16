export function Loader() {
  return (
    <div className="state-view">
      <div className="loader-spinner"></div>
      <p>Loading events...</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-view error-state">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">Retry</button>
      )}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="state-view">
      <h3>No events found</h3>
      <p>{message}</p>
    </div>
  );
}

// Export as default object for easy access
const StateViews = {
  Loading: Loader,
  Error: ErrorState,
  Empty: EmptyState
};

export default StateViews;
