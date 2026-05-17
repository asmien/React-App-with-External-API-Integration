const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class EventbriteService {
  async searchEvents(query = '', source = 'all', page = 1) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        source,
        ...(query && { q: query })
      });

      const response = await fetch(`${API_BASE_URL}/events/search?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      return {
        events: data.events || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  async getEvent(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async createEvent(eventData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.details || 'Failed to create event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async getMyEvents(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/events/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your events');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching my events:', error);
      throw error;
    }
  }
}

export default new EventbriteService();
