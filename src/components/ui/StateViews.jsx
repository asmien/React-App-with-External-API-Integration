// src/components/ui/StateViews.jsx
export function Loader() {
  return <p>Loading events...</p>;
}

export function ErrorState({ message }) {
  return <p>{message}</p>;
}

export function EmptyState({ regionLabel, categoryLabel }) {
  return (
    <p>
      No events found
      {regionLabel ? ` in ${regionLabel}` : ''}
      {categoryLabel ? ` for ${categoryLabel}` : ''}.
    </p>
  );
}