import { useState, useEffect } from "react";
import eventbriteService from "../services/eventbriteService";

export const useEvents = (searchQuery = '', source = 'all') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await eventbriteService.searchEvents(searchQuery, source);
        setEvents(data.events);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, source]);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await eventbriteService.searchEvents(searchQuery, source);
      setEvents(data.events);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, total, refetch };
};
