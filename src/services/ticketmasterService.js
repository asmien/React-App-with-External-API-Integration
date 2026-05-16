// Ticketmaster Discovery API v2 service layer.
// All HTTP calls to TM live here — no fetch() calls anywhere else in the app.
// Base URL and API key are loaded from .env (VITE_ prefix required by Vite).
// API key is passed as ?apikey= query param — TM does not use bearer tokens.

const BASE_URL = import.meta.env.VITE_TICKETMASTER_BASE_URL;
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

// Builds a full TM API URL with the apikey injected.
// Skips any param whose value is empty, null, or undefined —
// this is how Global (no countryCode) and General (no segmentName) work.
function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('apikey', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Throws a descriptive error if TM returns a non-2xx status.
// Includes the raw response text so the team can see TM's error message.
async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ticketmaster request failed: ${response.status} - ${text}`);
  }

  return response.json();
}

// Fetches paginated events from TM Discovery API /events.json.
// countryCode and segmentName are optional — omit to fetch globally or across all categories.
// TM nests results under _embedded.events — always defaults to [] if missing
// (happens when zero results match or when API returns an error body).
// pageInfo contains { page, size, totalElements, totalPages } from TM.
export async function fetchEvents({
  keyword = '',
  countryCode = '',
  segmentName = '',
  page = 0,
  size = 12,
  sort = 'date,asc',
  startDateTime = '',
  endDateTime = '',
}) {
  const url = buildUrl('/events.json', {
    ...(keyword ? { keyword } : {}),
    ...(countryCode ? { countryCode } : {}),
    ...(segmentName ? { segmentName } : {}),
    ...(startDateTime ? { startDateTime } : {}),
    ...(endDateTime ? { endDateTime } : {}),
    page,
    size,
    sort,
  });

  const response = await fetch(url);
  const data = await handleResponse(response);

  return {
    events: data?._embedded?.events ?? [],
    pageInfo: data?.page ?? {},
  };
}