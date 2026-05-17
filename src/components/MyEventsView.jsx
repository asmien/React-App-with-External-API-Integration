import React, { useState, useEffect } from 'react';
import eventbriteService from '../services/eventbriteService';
import authService from '../services/authService';
import EventGrid from './EventGrid';
import StateViews from './StateViews';
import './style/SavedEventsView.css';

const MyEventsView = ({ onEventClick, onClose }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      const result = await eventbriteService.getMyEvents(token);
      setMyEvents(result.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saved-events-view">
      <div className="view-header">
        <div>
          <h1>📅 My Events</h1>
          <p>Events you've created</p>
        </div>
        <button className="close-view-btn" onClick={onClose}>
          ← Back to All Events
        </button>
      </div>

      {loading && <StateViews.Loading />}
      
      {error && (
        <StateViews.Error 
          message={error} 
          onRetry={fetchMyEvents}
        />
      )}
      
      {!loading && !error && myEvents.length === 0 && (
        <StateViews.Empty 
          message="You haven't created any events yet. Click 'Create Event' to get started!"
        />
      )}
      
      {!loading && !error && myEvents.length > 0 && (
        <EventGrid 
          events={myEvents} 
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
};

export default MyEventsView;
