// Normalizes a raw Ticketmaster event object into a flat, predictable shape.
// TM data is deeply nested (_embedded, classifications, images, dates).
// This function is the ONLY place we handle that nesting — components never
// touch raw API data directly.

export function normalizeTicketmasterEvent(event) {
  const venue = event._embedded?.venues?.[0];
  const classification = event.classifications?.[0];

  // Prefer a 16:9 image wider than 500px for card display. Fall back
  // to first available image. Empty string if none found.
  const image =
    event.images?.find((img) => img.ratio === '16_9' && img.width >= 500)?.url ||
    event.images?.[0]?.url ||
    '';

  return {
    id: event.id,
    title: event.name || 'Untitled event',
    url: event.url || '#',
    image,
    date: event.dates?.start?.localDate || 'Date unavailable',
    time: event.dates?.start?.localTime || '',
    // TM status codes: 'onsale', 'offsale', 'cancelled', 'postponed', 'rescheduled'
    status: event.dates?.status?.code || 'unknown',
    venue: venue?.name || 'Venue unavailable',
    city: venue?.city?.name || '',
    country: venue?.country?.countryCode || '',
    // Segment = top-level category (Music, Sports). Genre = sub-category.
    segment: classification?.segment?.name || '',
    genre: classification?.genre?.name || '',
    // priceRanges may not exist — always check for null before rendering.
    priceMin: event.priceRanges?.[0]?.min ?? null,
    priceMax: event.priceRanges?.[0]?.max ?? null,
    currency: event.priceRanges?.[0]?.currency || '',
  };
}