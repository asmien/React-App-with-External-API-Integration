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
 /**
 * Save an event to favorites
 */
async saveEvent(event) {
  const token = authService.getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const payload = {
    external_event_id: String(
      event.id ||
      event.eventbrite_id,
    ),

    source:
      event.source || 'local',

    event_name:
      event.name ||
      event.title,

    event_description:
      event.description || '',

    venue_name:
      event.venue_name ||
      event.venue ||
      '',

    venue_address:
      event.venue_address || '',

    image_url:
      event.image_url ||
      event.image ||
      '',

    event_url:
      event.checkout_url ||
      event.url ||
      '',

    event_date:
      event.start_date ||
      event.date ||
      '',

    category:
      event.category ||
      event.segment ||
      event.genre ||
      ''
  };

  const response = await fetch(
    `${API_BASE_URL}/user/saved-events`,
    {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      'Failed to save event'
    );
  }

  return data;
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
async checkIfSaved(
  eventId,
  eventSource
) {
  const token =
    authService.getToken();

  if (!token) {
    return {
      is_saved: false
    };
  }

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/user/saved-events`,
        {
          headers:
            authService.getAuthHeaders()
        }
      );

    if (!response.ok) {
      return {
        is_saved: false
      };
    }

    const data =
      await response.json();

    const saved =
      data.saved_events?.find(
        (event) =>
          event.external_event_id ===
            eventId &&
          event.source ===
            eventSource
      );

    return {
      is_saved: !!saved,
      saved_event_id:
        saved?.id || null
    };
  } catch {
    return {
      is_saved: false
    };
  }
}

}

export default new SavedEventsService();