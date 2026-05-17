import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class SavedEventsService {
  /**
   * Get all saved events for current user
   */
  async getSavedEvents() {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/saved-events`, {
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch saved events');
    return await response.json();
  }

  /**
   * Save an event to favorites
   */
  async saveEvent(event) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');

    const payload = {
      event_id: event.id,
      event_source: event.source,
      event_name: event.name,
      event_image: event.image_url,
      event_date: event.start_date
    };

    const response = await fetch(`${API_BASE_URL}/user/saved-events`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save event');
    }

    return await response.json();
  }

  /**
   * Remove event from favorites
   */
  async unsaveEvent(savedEventId) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/saved-events/${savedEventId}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to remove event');
    return await response.json();
  }

  /**
   * Check if event is saved
   */
  async checkIfSaved(eventId, eventSource) {
    const token = authService.getToken();
    if (!token) return { is_saved: false };

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/saved-events/check/${eventSource}/${eventId}`,
        { headers: authService.getAuthHeaders() }
      );

      if (!response.ok) return { is_saved: false };
      return await response.json();
    } catch {
      return { is_saved: false };
    }
  }
}

export default new SavedEventsService();
