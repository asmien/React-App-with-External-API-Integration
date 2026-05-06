// Custom hook that owns all event-fetching state for the app.
// Accepts keyword, countryCode, and segmentName — re-fetches automatically
// whenever any of them change (handled by the useEffect dependency array).
// Components call this hook and never call fetchEvents() directly.

import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/ticketmasterService';
import { normalizeTicketmasterEvent } from '../utils/formatters';

export function useEvents({ keyword, countryCode, segmentName }) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ignore flag prevents a stale async response from updating state
    // if the user changes filters before the previous request finishes.
    let ignore = false;

    async function loadInitialEvents() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchEvents({
          keyword,
          countryCode,
          segmentName,
          page: 0,
          size: 12,
          sort: 'date,asc',
        });

        // Normalize raw TM objects before storing in state.
        // ?? [] guards against undefined if TM returns no _embedded block.
        const normalized = (data?.events ?? []).map(normalizeTicketmasterEvent);

        if (!ignore) {
          setEvents(normalized);
          setPage(0);
          setTotalPages(data?.pageInfo?.totalPages ?? 0);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load events');
          setEvents([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadInitialEvents();

    // Cleanup: mark this request stale when deps change or component unmounts.
    return () => {
      ignore = true;
    };
  }, [keyword, countryCode, segmentName]);

  // Appends the next page to existing results (Load More pattern).
  // Only fires if there are more pages available — checked via totalPages.
  async function loadMore() {
    if (page + 1 >= totalPages) return;

    setLoadingMore(true);
    setError('');

    try {
      const nextPage = page + 1;
      const data = await fetchEvents({
        keyword,
        countryCode,
        segmentName,
        page: nextPage,
        size: 12,
        sort: 'date,asc',
      });

      const normalized = (data?.events ?? []).map(normalizeTicketmasterEvent);

      setEvents((prev) => [...prev, ...normalized]);
      setPage(nextPage);
      setTotalPages(data?.pageInfo?.totalPages ?? 0);
    } catch (err) {
      setError(err.message || 'Failed to load more events');
    } finally {
      setLoadingMore(false);
    }
  }

  return {
    events,
    loading,
    error,
    loadingMore,
    hasMore: page + 1 < totalPages,
    loadMore,
  };
}