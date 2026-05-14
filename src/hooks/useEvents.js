import { useEffect, useState } from "react";
import { fetchEvents } from "../services/ticketmasterService";
import { normalizeTicketmasterEvent } from "../utils/formatters";
import { REGIONS, CATEGORIES } from "../utils/constants";

export function useEvents(keyword, filters) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const region = filters?.region ?? "global";
  const category = filters?.category ?? "general";

  useEffect(() => {
    let ignore = false;

    const activeRegion =
      REGIONS.find((r) => r.value === region) || REGIONS[0];

    const activeCategory =
      CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];

    async function loadInitialEvents() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchEvents({
          keyword,
          countryCode: activeRegion.countryCode,
          segmentName: activeCategory.segmentName,
          page: 0,
          size: 12,
          sort: "date,asc",
        });

        const normalized = (data?.events ?? []).map(normalizeTicketmasterEvent);

        if (!ignore) {
          setEvents(normalized);
          setPage(0);
          setTotalPages(data?.pageInfo?.totalPages ?? 0);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load events");
          setEvents([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialEvents();

    return () => {
      ignore = true;
    };
  }, [keyword, region, category]);

  async function loadMore() {
    if (loadingMore || loading) return;
    if (page + 1 >= totalPages) return;

    setLoadingMore(true);
    setError("");

    try {
      const nextPage = page + 1;

      const activeRegion =
        REGIONS.find((r) => r.value === region) || REGIONS[0];

      const activeCategory =
        CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];

      const data = await fetchEvents({
        keyword,
        countryCode: activeRegion.countryCode,
        segmentName: activeCategory.segmentName,
        page: nextPage,
        size: 12,
        sort: "date,asc",
      });

      const normalized = (data?.events ?? []).map(normalizeTicketmasterEvent);

      setEvents((prev) => [...prev, ...normalized]);
      setPage(nextPage);
      setTotalPages(data?.pageInfo?.totalPages ?? 0);
    } catch (err) {
      setError(err.message || "Failed to load more events");
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